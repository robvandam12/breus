
-- Tabla para almacenar las reglas de seguridad configurables.
CREATE TABLE public.security_alert_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL, -- e.g., 'DEPTH_LIMIT', 'ASCENT_RATE', 'BOTTOM_TIME'
    config JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g., {"max_ascent_rate_m_per_min": 10}
    priority TEXT NOT NULL DEFAULT 'warning', -- 'info', 'warning', 'critical', 'emergency'
    message_template TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar Row-Level Security
ALTER TABLE public.security_alert_rules ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura a usuarios autenticados
CREATE POLICY "Allow read access to authenticated users on rules"
ON public.security_alert_rules
FOR SELECT
USING (auth.role() = 'authenticated');

-- Política para permitir a los administradores gestionar las reglas
CREATE POLICY "Allow admin to manage rules"
ON public.security_alert_rules
FOR ALL
USING (public.get_user_role() = 'admin_servicio')
WITH CHECK (public.get_user_role() = 'admin_servicio');

-- Trigger para actualizar el campo updated_at
CREATE TRIGGER handle_updated_at_security_alert_rules
BEFORE UPDATE ON public.security_alert_rules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insertar una regla por defecto para el límite de profundidad
INSERT INTO public.security_alert_rules (name, description, type, priority, message_template)
VALUES
('Límite de Profundidad Excedido', 'Alerta cuando la profundidad actual supera la profundidad máxima planificada.', 'DEPTH_LIMIT', 'critical', '¡Alerta de Profundidad! La inmersión {inmersion_code} ha superado la profundidad máxima planificada de {max_depth}m. Profundidad actual: {current_depth}m.');

-- Tabla para registrar todas las alertas de seguridad generadas.
CREATE TABLE public.security_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inmersion_id UUID NOT NULL REFERENCES public.inmersion(inmersion_id) ON DELETE CASCADE,
    rule_id UUID REFERENCES public.security_alert_rules(id) ON DELETE SET NULL,
    type TEXT NOT NULL,
    priority TEXT NOT NULL,
    details JSONB,
    acknowledged BOOLEAN NOT NULL DEFAULT false,
    acknowledged_by UUID REFERENCES public.usuario(usuario_id),
    acknowledged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar Row-Level Security
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura a administradores y supervisores
CREATE POLICY "Allow read access to admins and supervisors"
ON public.security_alerts
FOR SELECT
USING (
    public.get_user_role() IN ('admin_servicio', 'supervisor')
);

-- Política para permitir a los administradores gestionar las alertas
CREATE POLICY "Allow admin to manage alerts"
ON public.security_alerts
FOR ALL
USING (public.get_user_role() = 'admin_servicio')
WITH CHECK (public.get_user_role() = 'admin_servicio');

-- Trigger para crear una notificación cuando se genera una alerta de seguridad
CREATE OR REPLACE FUNCTION public.create_notification_on_security_alert()
RETURNS TRIGGER AS $$
DECLARE
    inmersion_rec RECORD;
    rule_rec RECORD;
    notification_title TEXT;
    notification_message TEXT;
    current_depth_text TEXT;
    max_depth_text TEXT;
BEGIN
    -- Obtener datos de la inmersión
    SELECT supervisor_id, codigo, operacion_id INTO inmersion_rec
    FROM public.inmersion
    WHERE inmersion_id = NEW.inmersion_id;

    -- Obtener valores de los detalles
    current_depth_text := NEW.details->>'current_depth';
    max_depth_text := NEW.details->>'max_depth';

    -- Si hay una regla asociada, usar su plantilla
    IF NEW.rule_id IS NOT NULL THEN
        SELECT message_template INTO rule_rec
        FROM public.security_alert_rules
        WHERE id = NEW.rule_id;
        
        notification_title := 'Alerta de Seguridad: ' || NEW.type;
        notification_message := rule_rec.message_template;
        notification_message := replace(notification_message, '{inmersion_code}', COALESCE(inmersion_rec.codigo, 'N/A'));
        notification_message := replace(notification_message, '{max_depth}', COALESCE(max_depth_text, 'N/A'));
        notification_message := replace(notification_message, '{current_depth}', COALESCE(current_depth_text, 'N/A'));

    ELSE -- Fallback si no hay regla
        notification_title := 'Alerta de Seguridad: ' || NEW.type;
        notification_message := 'Se ha generado una alerta de tipo ' || NEW.type || ' para la inmersión ' || COALESCE(inmersion_rec.codigo, 'N/A') || '. Detalles: ' || NEW.details::text;
    END IF;

    -- Insertar notificación para el supervisor si existe
    IF inmersion_rec.supervisor_id IS NOT NULL THEN
        INSERT INTO public.notifications (user_id, type, title, message, metadata)
        VALUES (
            inmersion_rec.supervisor_id,
            NEW.priority,
            notification_title,
            notification_message,
            jsonb_build_object(
                'inmersion_id', NEW.inmersion_id,
                'operacion_id', inmersion_rec.operacion_id,
                'security_alert_id', NEW.id,
                'link', '/inmersiones'
            )
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_security_alert_created
AFTER INSERT ON public.security_alerts
FOR EACH ROW
EXECUTE FUNCTION public.create_notification_on_security_alert();
