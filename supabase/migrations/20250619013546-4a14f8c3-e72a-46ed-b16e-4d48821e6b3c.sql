
-- Crear políticas RLS para la tabla operacion para permitir eliminaciones
ALTER TABLE public.operacion ENABLE ROW LEVEL SECURITY;

-- Política para permitir SELECT a todos los usuarios autenticados
CREATE POLICY "Users can view operations" 
  ON public.operacion 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- Política para permitir INSERT a usuarios autenticados
CREATE POLICY "Users can create operations" 
  ON public.operacion 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Política para permitir UPDATE a usuarios autenticados
CREATE POLICY "Users can update operations" 
  ON public.operacion 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

-- Política para permitir DELETE a usuarios autenticados
CREATE POLICY "Users can delete operations" 
  ON public.operacion 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);
