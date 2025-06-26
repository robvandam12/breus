
-- Primero eliminar el trigger específico que depende de la columna
DROP TRIGGER IF EXISTS operacion_update_equipo_estado_trigger ON public.operacion;

-- Luego eliminar la función que maneja el estado de equipos
DROP FUNCTION IF EXISTS public.update_equipo_buceo_estado();

-- Ahora eliminar la columna equipo_buceo_id de la tabla operacion
ALTER TABLE public.operacion DROP COLUMN IF EXISTS equipo_buceo_id;
