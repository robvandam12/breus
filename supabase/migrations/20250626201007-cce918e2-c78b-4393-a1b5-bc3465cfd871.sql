
-- Crear políticas RLS para que admin_salmonera pueda gestionar usuarios de su empresa
CREATE POLICY "Admin salmonera puede ver usuarios de su empresa" 
  ON public.usuario 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.usuario u 
      WHERE u.usuario_id = auth.uid() 
      AND u.rol = 'admin_salmonera' 
      AND u.salmonera_id = usuario.salmonera_id
    )
  );

CREATE POLICY "Admin salmonera puede actualizar usuarios de su empresa" 
  ON public.usuario 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.usuario u 
      WHERE u.usuario_id = auth.uid() 
      AND u.rol = 'admin_salmonera' 
      AND u.salmonera_id = usuario.salmonera_id
    )
  );

CREATE POLICY "Admin salmonera puede crear usuarios en su empresa" 
  ON public.usuario 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.usuario u 
      WHERE u.usuario_id = auth.uid() 
      AND u.rol = 'admin_salmonera' 
      AND u.salmonera_id = salmonera_id
    )
  );
