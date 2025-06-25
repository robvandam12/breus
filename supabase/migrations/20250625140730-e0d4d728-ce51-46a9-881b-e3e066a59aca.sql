
-- Agregar la columna updated_at si no existe
ALTER TABLE public.usuario_invitaciones 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

-- Crear o reemplazar la función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_usuario_invitaciones()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger si no existe
DROP TRIGGER IF EXISTS usuario_invitaciones_updated_at ON public.usuario_invitaciones;
CREATE TRIGGER usuario_invitaciones_updated_at
  BEFORE UPDATE ON public.usuario_invitaciones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_usuario_invitaciones();
