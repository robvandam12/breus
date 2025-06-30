
-- Agregar campo para vincular bitácora de buzo con bitácora de supervisor
ALTER TABLE public.bitacora_buzo 
ADD COLUMN bitacora_supervisor_id uuid REFERENCES public.bitacora_supervisor(bitacora_id);

-- Agregar índice para mejor rendimiento en consultas
CREATE INDEX idx_bitacora_buzo_supervisor ON public.bitacora_buzo(bitacora_supervisor_id);

-- Agregar campos adicionales para mejorar el tracking de tiempos en bitácora supervisor
ALTER TABLE public.bitacora_supervisor 
ADD COLUMN datos_cuadrilla jsonb DEFAULT '[]'::jsonb,
ADD COLUMN tiempos_detallados jsonb DEFAULT '{}'::jsonb;

-- Comentarios para documentar los nuevos campos
COMMENT ON COLUMN public.bitacora_buzo.bitacora_supervisor_id IS 'Referencia a la bitácora de supervisor de la cual deriva esta bitácora de buzo';
COMMENT ON COLUMN public.bitacora_supervisor.datos_cuadrilla IS 'Información detallada de cada miembro de la cuadrilla incluyendo tiempos específicos';
COMMENT ON COLUMN public.bitacora_supervisor.tiempos_detallados IS 'Tiempos detallados por buzo: entrada, salida, profundidad máxima, etc.';
