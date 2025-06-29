
-- Permitir NULL en campos que deberían ser opcionales para inmersiones planificadas
ALTER TABLE public.inmersion 
ALTER COLUMN temperatura_agua DROP NOT NULL;

ALTER TABLE public.inmersion 
ALTER COLUMN visibilidad DROP NOT NULL;

ALTER TABLE public.inmersion 
ALTER COLUMN corriente DROP NOT NULL;

ALTER TABLE public.inmersion 
ALTER COLUMN buzo_principal DROP NOT NULL;

ALTER TABLE public.inmersion 
ALTER COLUMN supervisor DROP NOT NULL;

-- Agregar comentarios para documentar los cambios
COMMENT ON COLUMN public.inmersion.temperatura_agua IS 'Temperatura del agua. NULL para inmersiones planificadas hasta que se registren los datos durante la ejecución.';
COMMENT ON COLUMN public.inmersion.visibilidad IS 'Visibilidad en metros. NULL para inmersiones planificadas hasta que se registren los datos durante la ejecución.';
COMMENT ON COLUMN public.inmersion.corriente IS 'Tipo de corriente. NULL para inmersiones planificadas hasta que se registren los datos durante la ejecución.';
COMMENT ON COLUMN public.inmersion.buzo_principal IS 'Nombre del buzo principal. NULL para inmersiones planificadas hasta que se asigne el equipo.';
COMMENT ON COLUMN public.inmersion.supervisor IS 'Nombre del supervisor. NULL para inmersiones planificadas hasta que se asigne el equipo.';
