
-- Agrega una columna para almacenar el historial de profundidad en formato JSON.
ALTER TABLE public.inmersion ADD COLUMN depth_history JSONB DEFAULT '[]'::jsonb;
