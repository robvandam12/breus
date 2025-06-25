
-- Crear la tabla usuario_invitaciones
CREATE TABLE IF NOT EXISTS public.usuario_invitaciones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  nombre TEXT NOT NULL DEFAULT '',
  apellido TEXT NOT NULL DEFAULT '',
  rol TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  invitado_por UUID REFERENCES auth.users(id),
  empresa_id UUID,
  tipo_empresa TEXT,
  estado TEXT NOT NULL DEFAULT 'pendiente',
  fecha_expiracion TIMESTAMP WITH TIME ZONE NOT NULL,
  fecha_invitacion TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS en la tabla
ALTER TABLE public.usuario_invitaciones ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuarios autenticados puedan insertar invitaciones
CREATE POLICY "Los usuarios autenticados pueden crear invitaciones" 
  ON public.usuario_invitaciones 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = invitado_por);

-- Política para permitir que usuarios autenticados vean las invitaciones que han creado
CREATE POLICY "Los usuarios pueden ver sus propias invitaciones" 
  ON public.usuario_invitaciones 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = invitado_por);

-- Política para permitir que usuarios autenticados actualicen sus invitaciones
CREATE POLICY "Los usuarios pueden actualizar sus propias invitaciones" 
  ON public.usuario_invitaciones 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = invitado_por);

-- Política para permitir acceso público a invitaciones válidas (para el registro con token)
CREATE POLICY "Acceso público a invitaciones válidas por token" 
  ON public.usuario_invitaciones 
  FOR SELECT 
  TO anon
  USING (
    estado = 'pendiente' AND 
    fecha_expiracion > now()
  );

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_usuario_invitaciones_token ON public.usuario_invitaciones(token);
CREATE INDEX IF NOT EXISTS idx_usuario_invitaciones_email ON public.usuario_invitaciones(email);
CREATE INDEX IF NOT EXISTS idx_usuario_invitaciones_estado ON public.usuario_invitaciones(estado);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_usuario_invitaciones()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER usuario_invitaciones_updated_at
  BEFORE UPDATE ON public.usuario_invitaciones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_usuario_invitaciones();
