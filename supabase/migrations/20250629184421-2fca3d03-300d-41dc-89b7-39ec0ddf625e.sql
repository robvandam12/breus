
-- Permitir NULL en operacion_id para soportar inmersiones independientes
ALTER TABLE public.inmersion 
ALTER COLUMN operacion_id DROP NOT NULL;

-- Agregar un comentario para documentar el cambio
COMMENT ON COLUMN public.inmersion.operacion_id IS 'ID de la operación asociada. NULL para inmersiones independientes.';
