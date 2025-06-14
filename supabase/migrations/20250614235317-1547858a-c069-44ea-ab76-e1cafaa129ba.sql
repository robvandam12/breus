
-- Agrega una columna para rastrear el nivel de escalamiento de una alerta.
ALTER TABLE public.security_alerts
ADD COLUMN escalation_level INTEGER NOT NULL DEFAULT 0;

-- Agrega una columna para registrar la marca de tiempo del último escalamiento.
ALTER TABLE public.security_alerts
ADD COLUMN last_escalated_at TIMESTAMPTZ;

-- Añade un comentario para documentar el propósito de la nueva columna.
COMMENT ON COLUMN public.security_alerts.escalation_level IS 'Nivel de escalamiento de la alerta. 0: Inicial, 1: Escalado a Nivel 1, 2: Escalado a Nivel 2, etc.';
