
-- Migración para normalizar nomenclatura de equipos_buceo a cuadrillas_buceo
-- Paso 1: Renombrar tabla equipos_buceo a cuadrillas_buceo
ALTER TABLE public.equipos_buceo RENAME TO cuadrillas_buceo;

-- Paso 2: Renombrar tabla equipo_buceo_miembros a cuadrilla_miembros
ALTER TABLE public.equipo_buceo_miembros RENAME TO cuadrilla_miembros;

-- Paso 3: Actualizar columna de referencia en cuadrilla_miembros
ALTER TABLE public.cuadrilla_miembros RENAME COLUMN equipo_id TO cuadrilla_id;

-- Paso 4: Comentarios para documentar el cambio
COMMENT ON TABLE public.cuadrillas_buceo IS 'Cuadrillas (equipos) de buceo - grupos de personas especializadas en buceo';
COMMENT ON TABLE public.cuadrilla_miembros IS 'Miembros de las cuadrillas de buceo con sus roles específicos';
COMMENT ON COLUMN public.cuadrilla_miembros.cuadrilla_id IS 'Referencia a la cuadrilla de buceo';
COMMENT ON COLUMN public.cuadrilla_miembros.rol_equipo IS 'Rol del miembro dentro de la cuadrilla (supervisor, buzo_principal, buzo_asistente, etc.)';

-- Paso 5: Crear tabla para tracking de asignaciones de cuadrillas a inmersiones
CREATE TABLE IF NOT EXISTS public.cuadrilla_asignaciones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cuadrilla_id UUID NOT NULL REFERENCES public.cuadrillas_buceo(id) ON DELETE CASCADE,
  inmersion_id UUID NOT NULL REFERENCES public.inmersion(inmersion_id) ON DELETE CASCADE,
  fecha_asignacion DATE NOT NULL,
  estado TEXT NOT NULL DEFAULT 'activa' CHECK (estado IN ('activa', 'completada', 'cancelada')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(cuadrilla_id, fecha_asignacion, estado) -- Una cuadrilla no puede tener múltiples asignaciones activas el mismo día
);

-- Comentarios para la nueva tabla
COMMENT ON TABLE public.cuadrilla_asignaciones IS 'Asignaciones de cuadrillas a inmersiones para control de disponibilidad';
COMMENT ON COLUMN public.cuadrilla_asignaciones.fecha_asignacion IS 'Fecha de la inmersión asignada';
COMMENT ON COLUMN public.cuadrilla_asignaciones.estado IS 'Estado de la asignación (activa, completada, cancelada)';

-- Paso 6: Crear función para validar disponibilidad de cuadrilla
CREATE OR REPLACE FUNCTION public.validate_cuadrilla_availability(
  p_cuadrilla_id UUID,
  p_fecha_inmersion DATE,
  p_inmersion_id UUID DEFAULT NULL
)
RETURNS TABLE(
  is_available BOOLEAN,
  conflicting_inmersion_id UUID,
  conflicting_inmersion_codigo TEXT
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

-- Paso 7: Crear trigger para auto-gestionar asignaciones cuando se crea/actualiza inmersión
CREATE OR REPLACE FUNCTION public.manage_cuadrilla_assignment()
RETURNS TRIGGER AS $$
DECLARE
  cuadrilla_id_to_assign UUID;
BEGIN
  -- Solo procesar si hay una cuadrilla asignada en los metadatos de la inmersión
  IF NEW.metadata IS NOT NULL AND NEW.metadata ? 'cuadrilla_id' THEN
    cuadrilla_id_to_assign := (NEW.metadata->>'cuadrilla_id')::UUID;
    
    -- Si es INSERT, crear nueva asignación
    IF TG_OP = 'INSERT' THEN
      INSERT INTO public.cuadrilla_asignaciones (
        cuadrilla_id, 
        inmersion_id, 
        fecha_asignacion,
        estado
      ) VALUES (
        cuadrilla_id_to_assign,
        NEW.inmersion_id,
        NEW.fecha_inmersion,
        CASE NEW.estado
          WHEN 'completada' THEN 'completada'
          WHEN 'cancelada' THEN 'cancelada'
          ELSE 'activa'
        END
      )
      ON CONFLICT (cuadrilla_id, fecha_asignacion, estado) 
      DO UPDATE SET inmersion_id = NEW.inmersion_id;
      
    -- Si es UPDATE, actualizar asignación existente
    ELSIF TG_OP = 'UPDATE' THEN
      -- Actualizar estado de asignación si cambió el estado de la inmersión
      UPDATE public.cuadrilla_asignaciones 
      SET estado = CASE NEW.estado
        WHEN 'completada' THEN 'completada'
        WHEN 'cancelada' THEN 'cancelada'
        ELSE 'activa'
      END,
      fecha_asignacion = NEW.fecha_inmersion
      WHERE inmersion_id = NEW.inmersion_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear el trigger
DROP TRIGGER IF EXISTS manage_cuadrilla_assignment_trigger ON public.inmersion;
CREATE TRIGGER manage_cuadrilla_assignment_trigger
  AFTER INSERT OR UPDATE ON public.inmersion
  FOR EACH ROW
  EXECUTE FUNCTION public.manage_cuadrilla_assignment();

-- Paso 8: Migrar datos existentes de inmersiones que usen equipos antiguos
-- (Si hay datos existentes, crear asignaciones basadas en metadatos actuales)
INSERT INTO public.cuadrilla_asignaciones (cuadrilla_id, inmersion_id, fecha_asignacion, estado)
SELECT 
  (i.metadata->>'cuadrilla_id')::UUID,
  i.inmersion_id,
  i.fecha_inmersion,
  CASE i.estado
    WHEN 'completada' THEN 'completada'
    WHEN 'cancelada' THEN 'cancelada'
    ELSE 'activa'
  END
FROM public.inmersion i
WHERE i.metadata IS NOT NULL 
  AND i.metadata ? 'cuadrilla_id'
  AND (i.metadata->>'cuadrilla_id') ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
ON CONFLICT (cuadrilla_id, fecha_asignacion, estado) DO NOTHING;
