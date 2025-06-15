
-- Crear tabla principal para formularios MultiX
CREATE TABLE public.multix (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  tipo_formulario TEXT NOT NULL CHECK (tipo_formulario IN ('mantencion', 'faena')),
  operacion_id UUID REFERENCES public.operacion(id),
  fecha DATE NOT NULL,
  estado TEXT DEFAULT 'borrador' CHECK (estado IN ('borrador', 'revision', 'firmado')),
  firmado BOOLEAN DEFAULT false,
  progreso INTEGER DEFAULT 0 CHECK (progreso >= 0 AND progreso <= 100),
  user_id UUID NOT NULL,
  
  -- Encabezado general (compartido entre ambos tipos)
  lugar_trabajo TEXT,
  temperatura NUMERIC,
  hora_inicio TIME,
  hora_termino TIME,
  profundidad_max NUMERIC,
  nave_maniobras TEXT,
  team_s TEXT,
  team_be TEXT,
  team_bi TEXT,
  matricula_nave TEXT,
  estado_puerto TEXT,
  
  -- Datos específicos por tipo (estructura flexible)
  multix_data JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla para dotación y roles de buceo
CREATE TABLE public.multix_dotacion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  multix_id UUID REFERENCES public.multix(id) ON DELETE CASCADE,
  rol TEXT NOT NULL,
  nombre TEXT,
  apellido TEXT,
  matricula TEXT,
  contratista BOOLEAN DEFAULT false,
  equipo TEXT,
  hora_inicio_buzo TIME,
  hora_fin_buzo TIME,
  profundidad NUMERIC,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla para equipos de superficie
CREATE TABLE public.multix_equipos_superficie (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  multix_id UUID REFERENCES public.multix(id) ON DELETE CASCADE,
  equipo_sup TEXT,
  matricula_eq TEXT,
  horometro_ini NUMERIC,
  horometro_fin NUMERIC,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_multix_operacion_id ON public.multix(operacion_id);
CREATE INDEX idx_multix_user_id ON public.multix(user_id);
CREATE INDEX idx_multix_fecha ON public.multix(fecha);
CREATE INDEX idx_multix_tipo_formulario ON public.multix(tipo_formulario);
CREATE INDEX idx_multix_dotacion_multix_id ON public.multix_dotacion(multix_id);
CREATE INDEX idx_multix_equipos_multix_id ON public.multix_equipos_superficie(multix_id);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_multix_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_multix_updated_at
  BEFORE UPDATE ON public.multix
  FOR EACH ROW
  EXECUTE FUNCTION update_multix_updated_at();

-- Habilitar RLS en las tablas
ALTER TABLE public.multix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.multix_dotacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.multix_equipos_superficie ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas (los usuarios pueden ver/editar sus propios registros)
CREATE POLICY "Users can view their own multix records" ON public.multix
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own multix records" ON public.multix
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own multix records" ON public.multix
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own multix records" ON public.multix
  FOR DELETE USING (user_id = auth.uid());

-- Políticas para dotacion (basadas en el multix parent)
CREATE POLICY "Users can view dotacion for their multix" ON public.multix_dotacion
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.multix 
      WHERE multix.id = multix_dotacion.multix_id 
      AND multix.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage dotacion for their multix" ON public.multix_dotacion
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.multix 
      WHERE multix.id = multix_dotacion.multix_id 
      AND multix.user_id = auth.uid()
    )
  );

-- Políticas para equipos_superficie (basadas en el multix parent)
CREATE POLICY "Users can view equipos for their multix" ON public.multix_equipos_superficie
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.multix 
      WHERE multix.id = multix_equipos_superficie.multix_id 
      AND multix.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage equipos for their multix" ON public.multix_equipos_superficie
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.multix 
      WHERE multix.id = multix_equipos_superficie.multix_id 
      AND multix.user_id = auth.uid()
    )
  );
