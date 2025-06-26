
-- Eliminar las políticas problemáticas
DROP POLICY IF EXISTS "Admin salmonera puede ver usuarios de su empresa" ON public.usuario;
DROP POLICY IF EXISTS "Admin salmonera puede actualizar usuarios de su empresa" ON public.usuario;
DROP POLICY IF EXISTS "Admin salmonera puede crear usuarios en su empresa" ON public.usuario;

-- Crear funciones Security Definer para evitar recursión
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT COALESCE(rol, 'buzo') FROM public.usuario WHERE usuario_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_salmonera_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT salmonera_id FROM public.usuario WHERE usuario_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_servicio_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT servicio_id FROM public.usuario WHERE usuario_id = auth.uid();
$$;

-- Crear políticas corregidas usando las funciones Security Definer
CREATE POLICY "Admin salmonera puede ver usuarios de su empresa" 
  ON public.usuario 
  FOR SELECT 
  USING (
    public.get_current_user_role() = 'admin_salmonera' 
    AND public.get_current_user_salmonera_id() = salmonera_id
  );

CREATE POLICY "Admin salmonera puede actualizar usuarios de su empresa" 
  ON public.usuario 
  FOR UPDATE 
  USING (
    public.get_current_user_role() = 'admin_salmonera' 
    AND public.get_current_user_salmonera_id() = salmonera_id
  );

CREATE POLICY "Admin salmonera puede crear usuarios en su empresa" 
  ON public.usuario 
  FOR INSERT 
  WITH CHECK (
    public.get_current_user_role() = 'admin_salmonera' 
    AND public.get_current_user_salmonera_id() = salmonera_id
  );

-- Política adicional para admin_servicio
CREATE POLICY "Admin servicio puede ver usuarios de su empresa" 
  ON public.usuario 
  FOR SELECT 
  USING (
    public.get_current_user_role() = 'admin_servicio' 
    AND public.get_current_user_servicio_id() = servicio_id
  );

CREATE POLICY "Admin servicio puede actualizar usuarios de su empresa" 
  ON public.usuario 
  FOR UPDATE 
  USING (
    public.get_current_user_role() = 'admin_servicio' 
    AND public.get_current_user_servicio_id() = servicio_id
  );

CREATE POLICY "Admin servicio puede crear usuarios en su empresa" 
  ON public.usuario 
  FOR INSERT 
  WITH CHECK (
    public.get_current_user_role() = 'admin_servicio' 
    AND public.get_current_user_servicio_id() = servicio_id
  );

-- Política para superusers (acceso completo)
CREATE POLICY "Superuser puede gestionar todos los usuarios" 
  ON public.usuario 
  FOR ALL 
  USING (public.get_current_user_role() = 'superuser');

-- Política para usuarios ver su propio perfil
CREATE POLICY "Usuarios pueden ver su propio perfil" 
  ON public.usuario 
  FOR SELECT 
  USING (usuario_id = auth.uid());

CREATE POLICY "Usuarios pueden actualizar su propio perfil" 
  ON public.usuario 
  FOR UPDATE 
  USING (usuario_id = auth.uid());
