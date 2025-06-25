
-- Primero vamos a consultar el estado actual del usuario
SELECT usuario_id, nombre, apellido, email, rol, salmonera_id, servicio_id 
FROM public.usuario 
WHERE usuario_id = 'f41f92e2-075d-4b05-93c0-e1fd34069fd9';

-- También vamos a ver las salmoneras disponibles
SELECT id, nombre, rut FROM public.salmoneras ORDER BY nombre;

-- Verificar si RLS está habilitado en la tabla usuario
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'usuario';

-- Ver las políticas existentes en la tabla usuario
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'usuario';
