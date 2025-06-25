
-- Verificar los constraints existentes en la tabla
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'public.usuario_invitaciones'::regclass;

-- Eliminar el constraint existente si existe
ALTER TABLE public.usuario_invitaciones 
DROP CONSTRAINT IF EXISTS usuario_invitaciones_estado_check;

-- Crear un nuevo constraint que incluya 'cancelada'
ALTER TABLE public.usuario_invitaciones 
ADD CONSTRAINT usuario_invitaciones_estado_check 
CHECK (estado IN ('pendiente', 'aceptada', 'expirada', 'cancelada'));
