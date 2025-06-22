
-- Crear tabla para alertas del sistema (versión simplificada)
CREATE TABLE IF NOT EXISTS public.system_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  severity TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  source TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  resolved BOOLEAN DEFAULT false,
  resolved_by UUID,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear tabla para métricas del sistema (versión simplificada)
CREATE TABLE IF NOT EXISTS public.system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  threshold_warning NUMERIC,
  threshold_critical NUMERIC,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Insertar datos de ejemplo solo si las tablas están vacías
INSERT INTO public.system_metrics (metric_name, value, unit, threshold_warning, threshold_critical, metadata) 
SELECT 'cpu_usage', 45.2, '%', 80, 90, '{"server": "main"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.system_metrics WHERE metric_name = 'cpu_usage');

INSERT INTO public.system_metrics (metric_name, value, unit, threshold_warning, threshold_critical, metadata) 
SELECT 'memory_usage', 2048, 'MB', 6000, 7000, '{"total": "8192MB"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.system_metrics WHERE metric_name = 'memory_usage');

INSERT INTO public.system_alerts (type, severity, title, message, source, metadata) 
SELECT 'performance', 'medium', 'Tiempo de respuesta elevado', 'El tiempo promedio de respuesta ha superado los 200ms', 'api_monitor', '{"endpoint": "/api/inmersiones", "avg_time": "230ms"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.system_alerts WHERE title = 'Tiempo de respuesta elevado');
