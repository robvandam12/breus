
-- Permitir NULL en hora_inicio para inmersiones planificadas
ALTER TABLE public.inmersion 
ALTER COLUMN hora_inicio DROP NOT NULL;

-- Agregar un comentario para documentar el cambio
COMMENT ON COLUMN public.inmersion.hora_inicio IS 'Hora de inicio de la inmersión. NULL para inmersiones planificadas que aún no han comenzado.';
