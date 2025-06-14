
-- Habilita la replicación de identidad completa para la tabla de inmersión
-- Esto es necesario para que las actualizaciones en tiempo real incluyan los datos antiguos y nuevos.
ALTER TABLE public.inmersion REPLICA IDENTITY FULL;

-- Agrega la tabla de inmersión a la publicación en tiempo real de Supabase
-- Esto habilita la transmisión de cambios (INSERT, UPDATE, DELETE) para esta tabla.
ALTER PUBLICATION supabase_realtime ADD TABLE public.inmersion;
