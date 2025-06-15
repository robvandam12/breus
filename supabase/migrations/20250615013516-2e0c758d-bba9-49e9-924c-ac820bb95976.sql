
-- Añadir columnas para la configuración avanzada de reglas de escalamiento
ALTER TABLE public.security_alert_rules
ADD COLUMN IF NOT EXISTS escalation_policy jsonb NOT NULL DEFAULT '{"levels": [{"after_minutes": 15, "notify_roles": ["admin_servicio"], "channels": ["push"]}]}'::jsonb,
ADD COLUMN IF NOT EXISTS notification_channels text[] NOT NULL DEFAULT ARRAY['push']::text[],
ADD COLUMN IF NOT EXISTS target_roles text[] NOT NULL DEFAULT ARRAY['admin_servicio', 'superuser']::text[],
ADD COLUMN IF NOT EXISTS is_template boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS scope_id uuid,
ADD COLUMN IF NOT EXISTS scope_type text;

-- Asegurarnos que la columna updated_at existe antes de crear el trigger
DO $$
BEGIN
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'security_alert_rules' AND column_name = 'updated_at') THEN
    ALTER TABLE public.security_alert_rules ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
  END IF;
END $$;

-- Crear un trigger para actualizar automáticamente el campo `updated_at`
CREATE OR REPLACE TRIGGER handle_security_alert_rules_updated_at
BEFORE UPDATE ON public.security_alert_rules
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at_column();

-- Añadir una restricción para asegurar la consistencia del alcance de la regla
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_scope_consistency') THEN
        ALTER TABLE public.security_alert_rules
        ADD CONSTRAINT check_scope_consistency
        CHECK ((scope_type IS NULL AND scope_id IS NULL) OR (scope_type IS NOT NULL AND scope_id IS NOT NULL));
    END IF;
END $$;
