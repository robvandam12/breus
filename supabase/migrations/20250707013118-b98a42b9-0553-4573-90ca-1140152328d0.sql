-- Crear la foreign key que falta entre centros y salmoneras
ALTER TABLE public.centros ADD CONSTRAINT centros_salmonera_id_fkey 
FOREIGN KEY (salmonera_id) REFERENCES public.salmoneras(id) ON DELETE CASCADE;

-- Verificar la estructura de la tabla centros para asegurar consistencia
CREATE INDEX IF NOT EXISTS idx_centros_salmonera_id ON public.centros(salmonera_id);
CREATE INDEX IF NOT EXISTS idx_centros_estado ON public.centros(estado);