
-- Crear políticas RLS para la tabla cuadrillas_buceo
-- Estas políticas permitirán que los usuarios gestionen cuadrillas según su empresa y rol

-- Política para SELECT - usuarios pueden ver cuadrillas de su empresa
CREATE POLICY "Usuarios pueden ver cuadrillas de su empresa" 
  ON public.cuadrillas_buceo 
  FOR SELECT 
  USING (
    -- Superusers pueden ver todas
    public.get_current_user_role() = 'superuser' OR
    -- Admin salmonera puede ver cuadrillas de su salmonera
    (public.get_current_user_role() = 'admin_salmonera' AND 
     tipo_empresa = 'salmonera' AND 
     empresa_id = public.get_current_user_salmonera_id()) OR
    -- Admin servicio puede ver cuadrillas de su contratista
    (public.get_current_user_role() = 'admin_servicio' AND 
     tipo_empresa = 'contratista' AND 
     empresa_id = public.get_current_user_servicio_id()) OR
    -- Supervisores y buzos pueden ver cuadrillas de su servicio
    (public.get_current_user_role() IN ('supervisor', 'buzo') AND 
     tipo_empresa = 'contratista' AND 
     empresa_id = public.get_current_user_servicio_id())
  );

-- Política para INSERT - usuarios pueden crear cuadrillas en su empresa
CREATE POLICY "Usuarios pueden crear cuadrillas en su empresa" 
  ON public.cuadrillas_buceo 
  FOR INSERT 
  WITH CHECK (
    -- Superusers pueden crear en cualquier empresa
    public.get_current_user_role() = 'superuser' OR
    -- Admin salmonera puede crear cuadrillas de salmonera
    (public.get_current_user_role() = 'admin_salmonera' AND 
     tipo_empresa = 'salmonera' AND 
     empresa_id = public.get_current_user_salmonera_id()) OR
    -- Admin servicio puede crear cuadrillas de contratista
    (public.get_current_user_role() = 'admin_servicio' AND 
     tipo_empresa = 'contratista' AND 
     empresa_id = public.get_current_user_servicio_id())
  );

-- Política para UPDATE - usuarios pueden actualizar cuadrillas de su empresa
CREATE POLICY "Usuarios pueden actualizar cuadrillas de su empresa" 
  ON public.cuadrillas_buceo 
  FOR UPDATE 
  USING (
    -- Superusers pueden actualizar todas
    public.get_current_user_role() = 'superuser' OR
    -- Admin salmonera puede actualizar cuadrillas de su salmonera
    (public.get_current_user_role() = 'admin_salmonera' AND 
     tipo_empresa = 'salmonera' AND 
     empresa_id = public.get_current_user_salmonera_id()) OR
    -- Admin servicio puede actualizar cuadrillas de su contratista
    (public.get_current_user_role() = 'admin_servicio' AND 
     tipo_empresa = 'contratista' AND 
     empresa_id = public.get_current_user_servicio_id())
  );

-- Política para DELETE - solo admins pueden eliminar cuadrillas de su empresa
CREATE POLICY "Admins pueden eliminar cuadrillas de su empresa" 
  ON public.cuadrillas_buceo 
  FOR DELETE 
  USING (
    -- Superusers pueden eliminar todas
    public.get_current_user_role() = 'superuser' OR
    -- Admin salmonera puede eliminar cuadrillas de su salmonera
    (public.get_current_user_role() = 'admin_salmonera' AND 
     tipo_empresa = 'salmonera' AND 
     empresa_id = public.get_current_user_salmonera_id()) OR
    -- Admin servicio puede eliminar cuadrillas de su contratista
    (public.get_current_user_role() = 'admin_servicio' AND 
     tipo_empresa = 'contratista' AND 
     empresa_id = public.get_current_user_servicio_id())
  );
