
-- Crear políticas RLS para permitir validación de emails en la tabla usuario
CREATE POLICY "Permitir validación de emails en usuario" 
  ON public.usuario 
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- Crear políticas RLS para permitir validación de emails en usuario_invitaciones
CREATE POLICY "Permitir validación de emails en invitaciones" 
  ON public.usuario_invitaciones 
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- Si las tablas no tienen RLS habilitado, habilitarlo
ALTER TABLE public.usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuario_invitaciones ENABLE ROW LEVEL SECURITY;

-- Política más específica para usuario (solo lectura de campos necesarios para validación)
DROP POLICY IF EXISTS "Permitir validación de emails en usuario" ON public.usuario;
CREATE POLICY "Permitir validación de emails en usuario" 
  ON public.usuario 
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- Política más específica para invitaciones (solo lectura para validación)
DROP POLICY IF EXISTS "Permitir validación de emails en invitaciones" ON public.usuario_invitaciones;
CREATE POLICY "Permitir validación de emails en invitaciones" 
  ON public.usuario_invitaciones 
  FOR SELECT 
  TO anon, authenticated
  USING (true);
