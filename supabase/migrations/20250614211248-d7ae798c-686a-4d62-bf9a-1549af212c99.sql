
-- Añadir columnas para el reconocimiento de alertas
ALTER TABLE public.security_alerts
ADD COLUMN IF NOT EXISTS acknowledged_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS acknowledged_by UUID;

COMMENT ON COLUMN public.security_alerts.acknowledged_by IS 'Almacena el auth.uid() del usuario que reconoció la alerta.';

-- Crear un índice para optimizar la búsqueda de alertas no reconocidas
CREATE INDEX IF NOT EXISTS idx_security_alerts_unacknowledged ON public.security_alerts (acknowledged)
WHERE acknowledged = false;

-- Habilitar Row Level Security si no está habilitado
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas antiguas para evitar conflictos
DROP POLICY IF EXISTS "Supervisors and admins can view alerts" ON public.security_alerts;
DROP POLICY IF EXISTS "Supervisors and admins can acknowledge alerts" ON public.security_alerts;
DROP POLICY IF EXISTS "Authenticated users can create alerts" ON public.security_alerts;

-- Política para que supervisores y administradores puedan ver las alertas
CREATE POLICY "Supervisors and admins can view alerts" ON public.security_alerts
FOR SELECT
USING (
  (get_user_role() IN ('supervisor', 'admin', 'superuser'))
);

-- Política para que supervisores y administradores puedan reconocer (actualizar) alertas
CREATE POLICY "Supervisors and admins can acknowledge alerts" ON public.security_alerts
FOR UPDATE
USING (
  (get_user_role() IN ('supervisor', 'admin', 'superuser'))
);

-- Política para permitir la creación de alertas desde el sistema
-- La lógica de `checkForSecurityBreaches` se ejecuta en el cliente, por lo que necesita permiso de inserción.
CREATE POLICY "Authenticated users can create alerts" ON public.security_alerts
FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated'
);
