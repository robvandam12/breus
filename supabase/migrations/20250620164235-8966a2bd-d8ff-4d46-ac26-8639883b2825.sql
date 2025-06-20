
-- Crear tabla para configuración avanzada de módulos
CREATE TABLE public.module_configurations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_name text NOT NULL,
  company_id uuid NOT NULL,
  company_type text NOT NULL CHECK (company_type IN ('salmonera', 'contratista')),
  config_data jsonb NOT NULL DEFAULT '{}',
  usage_limits jsonb DEFAULT '{}',
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(module_name, company_id, company_type)
);

-- Crear tabla para métricas de uso de módulos
CREATE TABLE public.module_usage_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_name text NOT NULL,
  company_id uuid NOT NULL,
  company_type text NOT NULL CHECK (company_type IN ('salmonera', 'contratista')),
  date_recorded date NOT NULL DEFAULT CURRENT_DATE,
  usage_count integer NOT NULL DEFAULT 0,
  active_users integer NOT NULL DEFAULT 0,
  operations_count integer NOT NULL DEFAULT 0,
  performance_metrics jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(module_name, company_id, company_type, date_recorded)
);

-- Crear tabla para logs de activación/desactivación de módulos
CREATE TABLE public.module_activation_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_name text NOT NULL,
  company_id uuid NOT NULL,
  company_type text NOT NULL CHECK (company_type IN ('salmonera', 'contratista')),
  action text NOT NULL CHECK (action IN ('activated', 'deactivated', 'configured')),
  previous_state jsonb DEFAULT '{}',
  new_state jsonb DEFAULT '{}',
  reason text,
  performed_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS en las nuevas tablas
ALTER TABLE public.module_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_usage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_activation_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para module_configurations
CREATE POLICY "Companies can view their own module configurations" 
  ON public.module_configurations 
  FOR SELECT 
  USING (
    company_id IN (
      SELECT salmonera_id FROM public.usuario WHERE usuario_id = auth.uid()
      UNION 
      SELECT servicio_id FROM public.usuario WHERE usuario_id = auth.uid()
    )
  );

CREATE POLICY "Superusers can manage all module configurations" 
  ON public.module_configurations 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.usuario 
      WHERE usuario_id = auth.uid() 
      AND rol = 'superuser'
    )
  );

-- Políticas para module_usage_stats
CREATE POLICY "Companies can view their own usage stats" 
  ON public.module_usage_stats 
  FOR SELECT 
  USING (
    company_id IN (
      SELECT salmonera_id FROM public.usuario WHERE usuario_id = auth.uid()
      UNION 
      SELECT servicio_id FROM public.usuario WHERE usuario_id = auth.uid()
    )
  );

CREATE POLICY "System can insert usage stats" 
  ON public.module_usage_stats 
  FOR INSERT 
  WITH CHECK (true);

-- Políticas para module_activation_logs
CREATE POLICY "Companies can view their own activation logs" 
  ON public.module_activation_logs 
  FOR SELECT 
  USING (
    company_id IN (
      SELECT salmonera_id FROM public.usuario WHERE usuario_id = auth.uid()
      UNION 
      SELECT servicio_id FROM public.usuario WHERE usuario_id = auth.uid()
    )
  );

CREATE POLICY "Authorized users can create activation logs" 
  ON public.module_activation_logs 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.usuario 
      WHERE usuario_id = auth.uid() 
      AND rol IN ('superuser', 'admin_salmonera', 'admin_servicio')
    )
  );

-- Función para actualizar estadísticas de uso automáticamente
CREATE OR REPLACE FUNCTION public.update_module_usage_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Esta función se llamará desde triggers en tablas relevantes
  -- para actualizar las estadísticas de uso automáticamente
  
  -- Por ahora, solo registramos que hay actividad
  INSERT INTO public.module_usage_stats (
    module_name, 
    company_id, 
    company_type, 
    usage_count, 
    active_users
  ) VALUES (
    TG_ARGV[0], -- module_name pasado como argumento
    TG_ARGV[1]::uuid, -- company_id
    TG_ARGV[2], -- company_type
    1,
    1
  )
  ON CONFLICT (module_name, company_id, company_type, date_recorded)
  DO UPDATE SET
    usage_count = module_usage_stats.usage_count + 1,
    active_users = module_usage_stats.active_users + 1;
    
  RETURN NEW;
END;
$function$;

-- Función para obtener estadísticas de módulos
CREATE OR REPLACE FUNCTION public.get_module_stats(
  p_company_id uuid,
  p_company_type text,
  p_start_date date DEFAULT (CURRENT_DATE - INTERVAL '30 days')::date,
  p_end_date date DEFAULT CURRENT_DATE
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $function$
DECLARE
  stats_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_usage', COALESCE(SUM(usage_count), 0),
    'active_modules', COUNT(DISTINCT module_name),
    'avg_daily_usage', COALESCE(AVG(usage_count), 0),
    'usage_by_module', jsonb_object_agg(module_name, usage_count),
    'usage_trend', jsonb_agg(
      jsonb_build_object(
        'date', date_recorded,
        'usage', usage_count,
        'active_users', active_users
      ) ORDER BY date_recorded
    )
  )
  INTO stats_result
  FROM public.module_usage_stats
  WHERE company_id = p_company_id
    AND company_type = p_company_type
    AND date_recorded >= p_start_date
    AND date_recorded <= p_end_date;
    
  RETURN COALESCE(stats_result, '{}'::jsonb);
END;
$function$;
