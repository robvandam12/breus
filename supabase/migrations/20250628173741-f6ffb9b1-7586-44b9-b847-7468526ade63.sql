
-- Fase 1: Renombrar tabla sitios a centros
ALTER TABLE sitios RENAME TO centros;

-- Actualizar referencias en otras tablas
ALTER TABLE operacion RENAME COLUMN sitio_id TO centro_id;

-- Actualizar comentarios de tabla para reflejar el cambio
COMMENT ON TABLE centros IS 'Centros de acuicultura (antes sitios)';

-- Crear índices adicionales si es necesario
CREATE INDEX IF NOT EXISTS idx_centros_salmonera_estado ON centros(salmonera_id, estado);
CREATE INDEX IF NOT EXISTS idx_operacion_centro ON operacion(centro_id);

-- Actualizar función para contar centros activos (antes sitios_activos)
CREATE OR REPLACE FUNCTION public.update_salmonera_centros_count()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE public.salmoneras 
    SET sitios_activos = (
      SELECT COUNT(*) 
      FROM public.centros 
      WHERE salmonera_id = NEW.salmonera_id AND estado = 'activo'
    )
    WHERE id = NEW.salmonera_id;
  END IF;
  
  IF TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN
    UPDATE public.salmoneras 
    SET sitios_activos = (
      SELECT COUNT(*) 
      FROM public.centros 
      WHERE salmonera_id = OLD.salmonera_id AND estado = 'activo'
    )
    WHERE id = OLD.salmonera_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Recrear trigger con nuevo nombre de tabla
DROP TRIGGER IF EXISTS update_salmonera_sitios_count ON centros;
CREATE TRIGGER update_salmonera_centros_count
    AFTER INSERT OR UPDATE OR DELETE ON centros
    FOR EACH ROW
    EXECUTE FUNCTION update_salmonera_centros_count();

-- Actualizar cuadrillas para incluir centro_id opcional
ALTER TABLE cuadrillas_buceo ADD COLUMN centro_id UUID REFERENCES centros(id);
CREATE INDEX IF NOT EXISTS idx_cuadrillas_centro ON cuadrillas_buceo(centro_id);

-- Actualizar inmersion para incluir centro_id
ALTER TABLE inmersion ADD COLUMN centro_id UUID REFERENCES centros(id);
CREATE INDEX IF NOT EXISTS idx_inmersion_centro ON inmersion(centro_id);

-- Comentarios para las nuevas columnas
COMMENT ON COLUMN cuadrillas_buceo.centro_id IS 'Centro específico al que pertenece la cuadrilla (opcional, puede ser global por empresa)';
COMMENT ON COLUMN inmersion.centro_id IS 'Centro donde se realiza la inmersión';
