
-- 1. Crear tabla para definir los módulos disponibles en el sistema
CREATE TABLE public.system_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'planning', 'operational', 'reporting', 'integration'
  dependencies TEXT[] DEFAULT '{}', -- módulos que deben estar activos
  version TEXT DEFAULT '1.0.0',
  is_core BOOLEAN DEFAULT false, -- módulos core no se pueden desactivar
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Insertar los módulos base del sistema
INSERT INTO public.system_modules (name, display_name, description, category, is_core) VALUES
('core_immersions', 'Inmersiones y Bitácoras', 'Módulo core para gestión de inmersiones y bitácoras', 'operational', true),
('planning_operations', 'Planificación de Operaciones', 'Gestión de operaciones, HPT y Anexo Bravo', 'planning', false),
('maintenance_networks', 'Mantención de Redes', 'Formularios operativos para mantención de redes', 'operational', false),
('advanced_reporting', 'Reportes Avanzados', 'Sistema de análisis y reportes especializados', 'reporting', false),
('external_integrations', 'Integraciones Externas', 'Conectores con sistemas externos', 'integration', false);

-- 3. Tabla para activación de módulos por empresa
CREATE TABLE public.company_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  company_type TEXT NOT NULL CHECK (company_type IN ('salmonera', 'contratista')),
  module_name TEXT NOT NULL REFERENCES public.system_modules(name),
  is_active BOOLEAN DEFAULT false,
  activated_by UUID REFERENCES auth.users(id),
  activated_at TIMESTAMP WITH TIME ZONE,
  deactivated_at TIMESTAMP WITH TIME ZONE,
  configuration JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(company_id, company_type, module_name)
);

-- 4. Modificar tabla de inmersiones para ser independiente de operaciones
ALTER TABLE public.inmersion 
ADD COLUMN IF NOT EXISTS company_id UUID,
ADD COLUMN IF NOT EXISTS company_type TEXT CHECK (company_type IN ('salmonera', 'contratista')),
ADD COLUMN IF NOT EXISTS is_independent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS work_type TEXT, -- 'maintenance', 'inspection', 'repair', etc.
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS external_operation_code TEXT; -- para referencia externa

-- 5. Crear tabla para formularios operativos modulares
CREATE TABLE public.operational_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inmersion_id UUID NOT NULL REFERENCES public.inmersion(inmersion_id),
  module_name TEXT NOT NULL REFERENCES public.system_modules(name),
  form_type TEXT NOT NULL, -- 'maintenance', 'inspection', etc.
  form_data JSONB NOT NULL DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'approved')),
  created_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE
);

-- 6. Migrar datos existentes de MultiX a la nueva estructura
INSERT INTO public.operational_forms (inmersion_id, module_name, form_type, form_data, status, created_by, created_at)
SELECT 
  -- Necesitamos crear inmersiones dummy para los MultiX existentes que no tienen inmersion_id
  gen_random_uuid(), -- temporal, se actualizará después
  'maintenance_networks',
  tipo_formulario,
  multix_data,
  CASE WHEN firmado THEN 'approved' ELSE 'draft' END,
  user_id,
  created_at
FROM public.multix;

-- 7. Crear índices para optimizar consultas
CREATE INDEX idx_company_modules_company ON public.company_modules(company_id, company_type);
CREATE INDEX idx_company_modules_active ON public.company_modules(company_id, company_type, is_active);
CREATE INDEX idx_operational_forms_inmersion ON public.operational_forms(inmersion_id);
CREATE INDEX idx_operational_forms_module ON public.operational_forms(module_name, form_type);
CREATE INDEX idx_inmersion_company ON public.inmersion(company_id, company_type);

-- 8. Función para verificar acceso a módulos
CREATE OR REPLACE FUNCTION public.has_module_access(
  p_company_id UUID,
  p_company_type TEXT,
  p_module_name TEXT
) RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.company_modules
    WHERE company_id = p_company_id
      AND company_type = p_company_type
      AND module_name = p_module_name
      AND is_active = true
  ) OR EXISTS (
    SELECT 1 FROM public.system_modules
    WHERE name = p_module_name
      AND is_core = true
  );
$$;

-- 9. Función para obtener módulos activos de una empresa
CREATE OR REPLACE FUNCTION public.get_company_active_modules(
  p_company_id UUID,
  p_company_type TEXT
) RETURNS TABLE(
  module_name TEXT,
  display_name TEXT,
  description TEXT,
  category TEXT,
  configuration JSONB
)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT 
    sm.name,
    sm.display_name,
    sm.description,
    sm.category,
    COALESCE(cm.configuration, '{}')
  FROM public.system_modules sm
  LEFT JOIN public.company_modules cm ON sm.name = cm.module_name
    AND cm.company_id = p_company_id
    AND cm.company_type = p_company_type
  WHERE sm.is_core = true
    OR (cm.is_active = true);
$$;

-- 10. Trigger para actualizar timestamp en company_modules
CREATE OR REPLACE FUNCTION public.update_company_modules_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  IF NEW.is_active = true AND OLD.is_active = false THEN
    NEW.activated_at = now();
  ELSIF NEW.is_active = false AND OLD.is_active = true THEN
    NEW.deactivated_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_company_modules_timestamp
  BEFORE UPDATE ON public.company_modules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_company_modules_timestamp();

-- 11. RLS policies para las nuevas tablas
ALTER TABLE public.system_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operational_forms ENABLE ROW LEVEL SECURITY;

-- Policy para system_modules (todos pueden leer)
CREATE POLICY "Everyone can read system modules" ON public.system_modules
  FOR SELECT USING (true);

-- Policy para company_modules (solo superuser y admin de la empresa)
CREATE POLICY "Company admins can manage their modules" ON public.company_modules
  FOR ALL USING (
    public.get_user_role() = 'superuser' OR
    (public.get_user_role() IN ('admin_salmonera', 'admin_servicio') AND
     ((company_type = 'salmonera' AND company_id = public.get_current_user_salmonera()) OR
      (company_type = 'contratista' AND company_id = public.get_current_user_servicio())))
  );

-- Policy para operational_forms (acceso según rol y empresa)
CREATE POLICY "Users can access operational forms" ON public.operational_forms
  FOR ALL USING (
    public.get_user_role() = 'superuser' OR
    EXISTS (
      SELECT 1 FROM public.inmersion i
      WHERE i.inmersion_id = operational_forms.inmersion_id
      AND (
        public.get_user_role() IN ('admin_salmonera', 'admin_servicio') OR
        i.supervisor_id = auth.uid() OR
        i.buzo_principal_id = auth.uid() OR
        i.buzo_asistente_id = auth.uid()
      )
    )
  );
