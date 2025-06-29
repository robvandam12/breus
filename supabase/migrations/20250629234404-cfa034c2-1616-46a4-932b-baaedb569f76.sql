
-- Crear función RPC faltante para validar disponibilidad de cuadrillas
CREATE OR REPLACE FUNCTION public.validate_cuadrilla_availability(
  p_cuadrilla_id uuid, 
  p_fecha_inmersion date, 
  p_inmersion_id uuid DEFAULT NULL
)
RETURNS TABLE(
  is_available boolean, 
  conflicting_inmersion_id uuid, 
  conflicting_inmersion_codigo text
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    NOT EXISTS (
      SELECT 1 FROM public.cuadrilla_asignaciones ca
      JOIN public.inmersion i ON ca.inmersion_id = i.inmersion_id
      WHERE ca.cuadrilla_id = p_cuadrilla_id
      AND ca.fecha_asignacion = p_fecha_inmersion
      AND ca.estado = 'activa'
      AND (p_inmersion_id IS NULL OR ca.inmersion_id != p_inmersion_id)
    ) as is_available,
    COALESCE(
      (SELECT ca.inmersion_id FROM public.cuadrilla_asignaciones ca
       WHERE ca.cuadrilla_id = p_cuadrilla_id
       AND ca.fecha_asignacion = p_fecha_inmersion
       AND ca.estado = 'activa'
       AND (p_inmersion_id IS NULL OR ca.inmersion_id != p_inmersion_id)
       LIMIT 1), 
      NULL
    ) as conflicting_inmersion_id,
    COALESCE(
      (SELECT i.codigo FROM public.cuadrilla_asignaciones ca
       JOIN public.inmersion i ON ca.inmersion_id = i.inmersion_id
       WHERE ca.cuadrilla_id = p_cuadrilla_id
       AND ca.fecha_asignacion = p_fecha_inmersion
       AND ca.estado = 'activa'
       AND (p_inmersion_id IS NULL OR ca.inmersion_id != p_inmersion_id)
       LIMIT 1),
      NULL
    ) as conflicting_inmersion_codigo;
END;
$$;

-- Mejorar constraint en cuadrilla_asignaciones para permitir NULL en cuadrilla_id cuando sea necesario
ALTER TABLE public.cuadrilla_asignaciones 
ALTER COLUMN cuadrilla_id DROP NOT NULL;

-- Agregar índice para mejorar performance de consultas de disponibilidad
CREATE INDEX IF NOT EXISTS idx_cuadrilla_asignaciones_fecha_estado 
ON public.cuadrilla_asignaciones(cuadrilla_id, fecha_asignacion, estado);

-- Primero eliminar política existente si existe
DROP POLICY IF EXISTS "Users can delete their own immersions or company immersions" ON public.inmersion;

-- Crear política RLS para permitir eliminación de inmersiones a usuarios autorizados
CREATE POLICY "Users can delete their own immersions or company immersions" 
ON public.inmersion 
FOR DELETE 
USING (
  auth.uid() IN (
    SELECT usuario_id FROM public.usuario 
    WHERE usuario_id = auth.uid() 
    AND (
      rol = 'superuser' OR
      (rol IN ('admin_salmonera', 'admin_servicio') AND 
       (salmonera_id = inmersion.empresa_creadora_id OR servicio_id = inmersion.empresa_creadora_id)) OR
      supervisor_id = auth.uid() OR
      buzo_principal_id = auth.uid()
    )
  )
);
