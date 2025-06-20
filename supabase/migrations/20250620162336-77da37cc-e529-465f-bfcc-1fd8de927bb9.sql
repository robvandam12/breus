
-- Crear tabla para control de módulos por empresa
CREATE TABLE public.module_access (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id uuid NOT NULL,
  modulo_nombre text NOT NULL,
  activo boolean NOT NULL DEFAULT false,
  configuracion jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(empresa_id, modulo_nombre)
);

-- Habilitar RLS
ALTER TABLE public.module_access ENABLE ROW LEVEL SECURITY;

-- Política para que las empresas vean solo sus módulos
CREATE POLICY "Empresas pueden ver sus propios módulos" 
  ON public.module_access 
  FOR SELECT 
  USING (
    empresa_id IN (
      SELECT salmonera_id FROM public.usuario WHERE usuario_id = auth.uid()
      UNION 
      SELECT servicio_id FROM public.usuario WHERE usuario_id = auth.uid()
    )
  );

-- Política para que superusers puedan gestionar todos los módulos
CREATE POLICY "Superusers pueden gestionar todos los módulos" 
  ON public.module_access 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.usuario 
      WHERE usuario_id = auth.uid() 
      AND rol = 'superuser'
    )
  );

-- Insertar módulos base para testing
INSERT INTO public.module_access (empresa_id, modulo_nombre, activo) VALUES
-- Estos UUIDs son ejemplos, deberás ajustarlos según las empresas reales
('00000000-0000-0000-0000-000000000001', 'planning', true),
('00000000-0000-0000-0000-000000000001', 'core_operations', true),
('00000000-0000-0000-0000-000000000001', 'network_maintenance', false),
('00000000-0000-0000-0000-000000000001', 'network_operations', false),
('00000000-0000-0000-0000-000000000001', 'reports', true),
('00000000-0000-0000-0000-000000000001', 'integrations', false);
