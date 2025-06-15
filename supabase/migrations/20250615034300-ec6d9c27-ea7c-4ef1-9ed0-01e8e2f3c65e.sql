
-- 1. Agregar la columna 'estado' a la tabla de equipos de buceo
ALTER TABLE public.equipos_buceo
ADD COLUMN estado TEXT NOT NULL DEFAULT 'disponible'
CONSTRAINT chk_estado CHECK (estado IN ('disponible', 'en_uso', 'mantenimiento'));

COMMENT ON COLUMN public.equipos_buceo.estado IS 'Estado actual del equipo de buceo: disponible, en_uso, mantenimiento';

-- 2. Crear la función para sincronizar el estado del equipo con las operaciones
CREATE OR REPLACE FUNCTION public.update_equipo_buceo_estado()
RETURNS TRIGGER AS $$
BEGIN
    -- Cuando se actualiza una operación
    IF TG_OP = 'UPDATE' THEN
        -- Si se cambia el equipo de una operación activa (o se asigna/desasigna)
        IF NEW.equipo_buceo_id IS DISTINCT FROM OLD.equipo_buceo_id AND NEW.estado = 'activa' THEN
            -- Liberar el equipo antiguo si existía
            IF OLD.equipo_buceo_id IS NOT NULL THEN
                UPDATE public.equipos_buceo SET estado = 'disponible' WHERE id = OLD.equipo_buceo_id;
            END IF;
            -- Ocupar el equipo nuevo si existe
            IF NEW.equipo_buceo_id IS NOT NULL THEN
                UPDATE public.equipos_buceo SET estado = 'en_uso' WHERE id = NEW.equipo_buceo_id;
            END IF;
        END IF;

        -- Si la operación cambia a un estado final (completada, cancelada), liberar el equipo que tenía
        IF NEW.estado IN ('completada', 'cancelada') AND OLD.estado = 'activa' AND OLD.equipo_buceo_id IS NOT NULL THEN
            UPDATE public.equipos_buceo SET estado = 'disponible' WHERE id = OLD.equipo_buceo_id;
        END IF;

        -- Si la operación vuelve a estar activa (y antes no lo estaba) y tiene un equipo, marcarlo como en uso
        IF NEW.estado = 'activa' AND OLD.estado <> 'activa' AND NEW.equipo_buceo_id IS NOT NULL THEN
            UPDATE public.equipos_buceo SET estado = 'en_uso' WHERE id = NEW.equipo_buceo_id;
        END IF;
    END IF;

    -- Cuando se inserta una nueva operación que ya está activa y tiene un equipo asignado
    IF TG_OP = 'INSERT' AND NEW.estado = 'activa' AND NEW.equipo_buceo_id IS NOT NULL THEN
        UPDATE public.equipos_buceo SET estado = 'en_uso' WHERE id = NEW.equipo_buceo_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Eliminar el trigger si ya existe para evitar duplicados y luego crearlo
DROP TRIGGER IF EXISTS operacion_update_equipo_estado_trigger ON public.operacion;

CREATE TRIGGER operacion_update_equipo_estado_trigger
AFTER INSERT OR UPDATE OF estado, equipo_buceo_id ON public.operacion
FOR EACH ROW
EXECUTE FUNCTION public.update_equipo_buceo_estado();

