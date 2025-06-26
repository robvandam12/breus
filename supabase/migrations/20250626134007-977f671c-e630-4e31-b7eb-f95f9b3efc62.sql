
-- Crear tabla para equipos de inmersión (reemplaza el sistema de texto actual)
CREATE TABLE public.inmersion_team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inmersion_id UUID NOT NULL REFERENCES public.inmersion(inmersion_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.usuario(usuario_id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('supervisor', 'buzo_principal', 'buzo_asistente', 'buzo_emergencia')),
  is_emergency BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Evitar roles duplicados por inmersión (excepto buzo_asistente y buzo_emergencia)
  UNIQUE(inmersion_id, role) DEFERRABLE INITIALLY DEFERRED
);

-- Índices para optimizar consultas
CREATE INDEX idx_inmersion_team_members_inmersion ON public.inmersion_team_members(inmersion_id);
CREATE INDEX idx_inmersion_team_members_user ON public.inmersion_team_members(user_id);

-- Agregar campos necesarios para el sistema de notificaciones
ALTER TABLE public.inmersion 
ADD COLUMN IF NOT EXISTS estimated_end_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS actual_end_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS notification_status JSONB DEFAULT '{"supervisor_notified": false, "team_notified": false}'::jsonb;

-- Function para crear notificación
CREATE OR REPLACE FUNCTION public.create_workflow_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, metadata)
  VALUES (p_user_id, p_type, p_title, p_message, p_metadata)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Trigger: Notificar supervisor cuando se crea inmersión
CREATE OR REPLACE FUNCTION public.notify_supervisor_on_inmersion_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  supervisor_user_id UUID;
BEGIN
  -- Buscar el ID del usuario supervisor
  SELECT usuario_id INTO supervisor_user_id
  FROM public.usuario
  WHERE nombre = NEW.supervisor AND apellido IS NOT NULL
  LIMIT 1;
  
  -- Si encontramos el supervisor, crear notificación
  IF supervisor_user_id IS NOT NULL THEN
    PERFORM public.create_workflow_notification(
      supervisor_user_id,
      'inmersion_assignment',
      'Nueva Inmersión Asignada',
      'Se te ha asignado como supervisor de la inmersión ' || NEW.codigo || ' programada para ' || NEW.fecha_inmersion::text,
      jsonb_build_object(
        'inmersion_id', NEW.inmersion_id,
        'inmersion_code', NEW.codigo,
        'date', NEW.fecha_inmersion,
        'link', '/inmersiones'
      )
    );
    
    -- Actualizar estado de notificación
    NEW.notification_status = jsonb_set(
      COALESCE(NEW.notification_status, '{}'::jsonb),
      '{supervisor_notified}',
      'true'::jsonb
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger: Notificar supervisor para completar bitácora cuando termina inmersión
CREATE OR REPLACE FUNCTION public.notify_supervisor_bitacora_pending()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  supervisor_user_id UUID;
  has_supervisor_bitacora BOOLEAN;
BEGIN
  -- Solo procesar si el estado cambió a 'completada'
  IF NEW.estado = 'completada' AND (OLD.estado IS NULL OR OLD.estado != 'completada') THEN
    
    -- Buscar el ID del usuario supervisor
    SELECT usuario_id INTO supervisor_user_id
    FROM public.usuario
    WHERE nombre = NEW.supervisor AND apellido IS NOT NULL
    LIMIT 1;
    
    -- Verificar si ya existe bitácora de supervisor
    SELECT EXISTS(
      SELECT 1 FROM public.bitacora_supervisor 
      WHERE inmersion_id = NEW.inmersion_id
    ) INTO has_supervisor_bitacora;
    
    -- Si no hay bitácora y encontramos supervisor, notificar
    IF supervisor_user_id IS NOT NULL AND NOT has_supervisor_bitacora THEN
      PERFORM public.create_workflow_notification(
        supervisor_user_id,
        'bitacora_supervisor_pending',
        'Bitácora de Supervisor Pendiente',
        'La inmersión ' || NEW.codigo || ' ha finalizado. Por favor, complete su bitácora de supervisión.',
        jsonb_build_object(
          'inmersion_id', NEW.inmersion_id,
          'inmersion_code', NEW.codigo,
          'priority', 'high',
          'link', '/bitacoras/supervisor'
        )
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger: Notificar equipo cuando supervisor completa bitácora
CREATE OR REPLACE FUNCTION public.notify_team_bitacora_ready()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  team_member RECORD;
  inmersion_code TEXT;
BEGIN
  -- Solo procesar inserts de nuevas bitácoras de supervisor
  IF TG_OP = 'INSERT' THEN
    
    -- Obtener código de inmersión
    SELECT codigo INTO inmersion_code
    FROM public.inmersion
    WHERE inmersion_id = NEW.inmersion_id;
    
    -- Notificar a todos los miembros del equipo (excepto emergencia)
    FOR team_member IN 
      SELECT itm.user_id, u.nombre, u.apellido, itm.role
      FROM public.inmersion_team_members itm
      JOIN public.usuario u ON itm.user_id = u.usuario_id
      WHERE itm.inmersion_id = NEW.inmersion_id 
        AND itm.is_emergency = false
        AND itm.role IN ('buzo_principal', 'buzo_asistente')
    LOOP
      PERFORM public.create_workflow_notification(
        team_member.user_id,
        'bitacora_buzo_ready',
        'Complete su Bitácora de Buzo',
        'El supervisor ha completado la bitácora para la inmersión ' || COALESCE(inmersion_code, 'N/A') || '. Ahora puede completar su bitácora individual.',
        jsonb_build_object(
          'inmersion_id', NEW.inmersion_id,
          'inmersion_code', COALESCE(inmersion_code, 'N/A'),
          'role', team_member.role,
          'link', '/bitacoras/buzo'
        )
      );
    END LOOP;
    
    -- Marcar equipo como notificado en la inmersión
    UPDATE public.inmersion 
    SET notification_status = jsonb_set(
      COALESCE(notification_status, '{}'::jsonb),
      '{team_notified}',
      'true'::jsonb
    )
    WHERE inmersion_id = NEW.inmersion_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Aplicar triggers
DROP TRIGGER IF EXISTS trigger_notify_supervisor_on_inmersion_created ON public.inmersion;
CREATE TRIGGER trigger_notify_supervisor_on_inmersion_created
  BEFORE INSERT ON public.inmersion
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_supervisor_on_inmersion_created();

DROP TRIGGER IF EXISTS trigger_notify_supervisor_bitacora_pending ON public.inmersion;
CREATE TRIGGER trigger_notify_supervisor_bitacora_pending
  AFTER UPDATE ON public.inmersion
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_supervisor_bitacora_pending();

DROP TRIGGER IF EXISTS trigger_notify_team_bitacora_ready ON public.bitacora_supervisor;
CREATE TRIGGER trigger_notify_team_bitacora_ready
  AFTER INSERT ON public.bitacora_supervisor
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_team_bitacora_ready();

-- Function para calcular tiempo estimado de finalización
CREATE OR REPLACE FUNCTION public.calculate_estimated_end_time(
  start_date DATE,
  start_time TIME,
  planned_bottom_time INTEGER
) RETURNS TIMESTAMP WITH TIME ZONE
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT (start_date + start_time + INTERVAL '1 minute' * COALESCE(planned_bottom_time, 60))::timestamp with time zone;
$$;

-- Trigger para calcular automáticamente estimated_end_time
CREATE OR REPLACE FUNCTION public.update_estimated_end_time()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Calcular tiempo estimado de finalización
  IF NEW.fecha_inmersion IS NOT NULL AND NEW.hora_inicio IS NOT NULL THEN
    NEW.estimated_end_time = public.calculate_estimated_end_time(
      NEW.fecha_inmersion,
      NEW.hora_inicio,
      NEW.planned_bottom_time
    );
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_update_estimated_end_time ON public.inmersion;
CREATE TRIGGER trigger_update_estimated_end_time
  BEFORE INSERT OR UPDATE ON public.inmersion
  FOR EACH ROW
  EXECUTE FUNCTION public.update_estimated_end_time();

-- RLS para la nueva tabla
ALTER TABLE public.inmersion_team_members ENABLE ROW LEVEL SECURITY;

-- Política para que usuarios puedan ver equipos donde participan o supervisan
CREATE POLICY "Users can view team memberships where they participate"
  ON public.inmersion_team_members
  FOR SELECT
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.inmersion i 
      WHERE i.inmersion_id = inmersion_team_members.inmersion_id 
      AND i.supervisor_id = auth.uid()
    )
  );

-- Política para insertar/actualizar (solo supervisores y administradores)
CREATE POLICY "Supervisors and admins can manage team memberships"
  ON public.inmersion_team_members
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.usuario u
      WHERE u.usuario_id = auth.uid()
      AND u.rol IN ('supervisor', 'admin_salmonera', 'admin_servicio', 'superuser')
    )
  );
