
-- Eliminar la política incorrecta si existe
DROP POLICY IF EXISTS "Permitir registro desde invitaciones válidas" ON public.usuario;

-- Crear nueva política RLS para permitir registro desde invitaciones válidas
-- Usamos una función de seguridad para verificar la invitación
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

-- Crear la política usando la función
CREATE POLICY "Permitir registro desde invitaciones válidas" 
  ON public.usuario 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (public.check_valid_invitation(email));

-- Actualizar la política existente para ser más específica
DROP POLICY IF EXISTS "Los usuarios pueden crear sus propios perfiles" ON public.usuario;

CREATE POLICY "Los usuarios autenticados pueden crear sus propios perfiles" 
  ON public.usuario 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

-- Crear política para que admins puedan crear usuarios
CREATE POLICY "Los admins pueden crear usuarios" 
  ON public.usuario 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.usuario 
      WHERE usuario_id = auth.uid() 
        AND rol IN ('superuser', 'admin_salmonera', 'admin_servicio')
    )
  );
