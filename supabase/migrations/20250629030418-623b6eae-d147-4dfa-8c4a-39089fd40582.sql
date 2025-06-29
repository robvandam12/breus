
-- Habilitar RLS en la tabla cuadrilla_miembros
ALTER TABLE public.cuadrilla_miembros ENABLE ROW LEVEL SECURITY;

-- Política para SELECT - usuarios pueden ver miembros de cuadrillas de su empresa
CREATE POLICY "Users can view cuadrilla members from their company" 
ON public.cuadrilla_miembros 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.cuadrillas_buceo cb
    WHERE cb.id = cuadrilla_miembros.cuadrilla_id
    AND (
      (cb.tipo_empresa = 'salmonera' AND cb.empresa_id = public.get_current_user_salmonera_id())
      OR 
      (cb.tipo_empresa = 'contratista' AND cb.empresa_id = public.get_current_user_servicio_id())
      OR
      public.get_current_user_role() = 'superuser'
    )
  )
);

-- Política para INSERT - usuarios pueden agregar miembros a cuadrillas de su empresa
CREATE POLICY "Users can insert cuadrilla members to their company cuadrillas" 
ON public.cuadrilla_miembros 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.cuadrillas_buceo cb
    WHERE cb.id = cuadrilla_miembros.cuadrilla_id
    AND (
      (cb.tipo_empresa = 'salmonera' AND cb.empresa_id = public.get_current_user_salmonera_id())
      OR 
      (cb.tipo_empresa = 'contratista' AND cb.empresa_id = public.get_current_user_servicio_id())
      OR
      public.get_current_user_role() = 'superuser'
    )
  )
);

-- Política para UPDATE - usuarios pueden actualizar miembros de cuadrillas de su empresa
CREATE POLICY "Users can update cuadrilla members from their company" 
ON public.cuadrilla_miembros 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.cuadrillas_buceo cb
    WHERE cb.id = cuadrilla_miembros.cuadrilla_id
    AND (
      (cb.tipo_empresa = 'salmonera' AND cb.empresa_id = public.get_current_user_salmonera_id())
      OR 
      (cb.tipo_empresa = 'contratista' AND cb.empresa_id = public.get_current_user_servicio_id())
      OR
      public.get_current_user_role() = 'superuser'
    )
  )
);

-- Política para DELETE - usuarios pueden eliminar miembros de cuadrillas de su empresa
CREATE POLICY "Users can delete cuadrilla members from their company" 
ON public.cuadrilla_miembros 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.cuadrillas_buceo cb
    WHERE cb.id = cuadrilla_miembros.cuadrilla_id
    AND (
      (cb.tipo_empresa = 'salmonera' AND cb.empresa_id = public.get_current_user_salmonera_id())
      OR 
      (cb.tipo_empresa = 'contratista' AND cb.empresa_id = public.get_current_user_servicio_id())
      OR
      public.get_current_user_role() = 'superuser'
    )
  )
);
