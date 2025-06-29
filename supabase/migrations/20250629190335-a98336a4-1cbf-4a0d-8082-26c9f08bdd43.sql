
-- Revisar y corregir el check constraint para contexto_operativo
-- Primero eliminamos el constraint existente
ALTER TABLE public.inmersion DROP CONSTRAINT IF EXISTS inmersion_contexto_operativo_check;

-- Agregamos el constraint corregido que permite los valores correctos
ALTER TABLE public.inmersion 
ADD CONSTRAINT inmersion_contexto_operativo_check 
CHECK (contexto_operativo IN ('planificada', 'operativa_directa', 'independiente'));

-- También agregar un comentario para clarificar los valores
COMMENT ON COLUMN public.inmersion.contexto_operativo IS 'Tipo de contexto operativo: planificada (con operación), operativa_directa (ejecución directa), independiente (sin operación)';
