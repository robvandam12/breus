-- Buscar y corregir cualquier referencia restante a 'sitios' en políticas RLS y funciones
-- Primero verificamos si hay alguna referencia a 'sitios' en funciones o políticas

-- Actualizar función de conteo de sitios para usar 'centros'
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

-- Crear trigger para la tabla centros
DROP TRIGGER IF EXISTS update_salmonera_sitios_count_trigger ON public.centros;
CREATE TRIGGER update_salmonera_centros_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.centros
    FOR EACH ROW EXECUTE FUNCTION public.update_salmonera_centros_count();