
-- Hacer nullable las columnas nombre y apellido en usuario_invitaciones
ALTER TABLE public.usuario_invitaciones 
ALTER COLUMN nombre DROP NOT NULL,
ALTER COLUMN apellido DROP NOT NULL;

-- Agregar valores por defecto para evitar problemas
ALTER TABLE public.usuario_invitaciones 
ALTER COLUMN nombre SET DEFAULT '',
ALTER COLUMN apellido SET DEFAULT '';
