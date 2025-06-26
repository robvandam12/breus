
-- Eliminar todas las políticas existentes en la tabla usuario
DROP POLICY IF EXISTS "Los usuarios autenticados pueden crear sus propios perfiles" ON public.usuario;
DROP POLICY IF EXISTS "Los usuarios pueden crear sus propios perfiles" ON public.usuario;
DROP POLICY IF EXISTS "Permitir registro desde invitaciones válidas" ON public.usuario;
DROP POLICY IF EXISTS "Los admins pueden crear usuarios" ON public.usuario;
DROP POLICY IF EXISTS "Permitir validación de emails en usuario" ON public.usuario;

-- Eliminar políticas existentes en usuario_invitaciones
DROP POLICY IF EXISTS "Permitir validación de emails en invitaciones" ON public.usuario_invitaciones;

-- Habilitar RLS en ambas tablas
ALTER TABLE public.usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuario_invitaciones ENABLE ROW LEVEL SECURITY;

-- Crear función para verificar invitaciones válidas si no existe
CREATE OR REPLACE FUNCTION public.check_valid_invitation(user_email text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.usuario_invitaciones 
    WHERE email = user_email 
      AND estado = 'pendiente' 
      AND fecha_expiracion > now()
  );
$$;

-- Políticas para SELECT (validación de emails) - permitir acceso completo para validación
CREATE POLICY "Allow email validation on usuario" 
  ON public.usuario 
  FOR SELECT 
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow email validation on invitations" 
  ON public.usuario_invitaciones 
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- Políticas para INSERT en usuario
CREATE POLICY "Allow user registration with valid invitation" 
  ON public.usuario 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (public.check_valid_invitation(email));

CREATE POLICY "Allow authenticated users to create own profile" 
  ON public.usuario 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

-- Políticas para INSERT en usuario_invitaciones
CREATE POLICY "Allow admins to create invitations" 
  ON public.usuario_invitaciones 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.usuario 
      WHERE usuario_id = auth.uid() 
        AND rol IN ('superuser', 'admin_salmonera', 'admin_servicio')
    )
  );

-- Políticas para UPDATE en usuario_invitaciones
CREATE POLICY "Allow admins to update invitations" 
  ON public.usuario_invitaciones 
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.usuario 
      WHERE usuario_id = auth.uid() 
        AND rol IN ('superuser', 'admin_salmonera', 'admin_servicio')
    )
  );
