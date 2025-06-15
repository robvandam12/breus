
-- Crear la tabla para almacenar las configuraciones de los dashboards personalizados de los usuarios
CREATE TABLE public.dashboard_layouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.usuario(usuario_id) ON DELETE CASCADE,
    -- 'layout_config' almacenará la posición y tamaño de los widgets en la grilla
    layout_config JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- 'widget_configs' almacenará la configuración específica de cada widget
    widget_configs JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar la Seguridad a Nivel de Fila (RLS)
ALTER TABLE public.dashboard_layouts ENABLE ROW LEVEL SECURITY;

-- Política para permitir a los usuarios ver sus propias configuraciones de dashboard
CREATE POLICY "Users can view their own dashboard layouts"
ON public.dashboard_layouts FOR SELECT
USING (auth.uid() = user_id);

-- Política para permitir a los usuarios crear sus propias configuraciones de dashboard
CREATE POLICY "Users can insert their own dashboard layouts"
ON public.dashboard_layouts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política para permitir a los usuarios actualizar sus propias configuraciones de dashboard
CREATE POLICY "Users can update their own dashboard layouts"
ON public.dashboard_layouts FOR UPDATE
USING (auth.uid() = user_id);

-- Política para permitir a los usuarios eliminar sus propias configuraciones de dashboard
CREATE POLICY "Users can delete their own dashboard layouts"
ON public.dashboard_layouts FOR DELETE
USING (auth.uid() = user_id);

-- Crear un disparador para actualizar automáticamente la columna 'updated_at' en cada modificación
CREATE TRIGGER handle_dashboard_layouts_updated_at
BEFORE UPDATE ON public.dashboard_layouts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
