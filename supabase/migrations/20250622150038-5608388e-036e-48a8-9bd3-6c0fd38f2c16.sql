
-- Crear tabla para contextos operativos independientes
CREATE TABLE public.operational_contexts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  company_type TEXT NOT NULL CHECK (company_type IN ('salmonera', 'contratista')),
  context_type TEXT NOT NULL DEFAULT 'direct' CHECK (context_type IN ('planned', 'direct', 'mixed')),
  requires_planning BOOLEAN NOT NULL DEFAULT false,
  requires_documents BOOLEAN NOT NULL DEFAULT false,
  allows_direct_operations BOOLEAN NOT NULL DEFAULT true,
  active_modules TEXT[] NOT NULL DEFAULT ARRAY['core_immersions'],
  configuration JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, company_type)
);

-- Actualizar tabla inmersion para contextos independientes
ALTER TABLE public.inmersion 
ADD COLUMN IF NOT EXISTS context_type TEXT DEFAULT 'planned' CHECK (context_type IN ('planned', 'direct')),
ADD COLUMN IF NOT EXISTS requires_validation BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN ('pending', 'validated', 'not_required')),
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Función para crear contexto operativo por defecto
CREATE OR REPLACE FUNCTION public.ensure_operational_context()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    user_salmonera_id uuid;
    user_servicio_id uuid;
    company_id uuid;
    company_type text;
    default_context_type text;
    requires_docs boolean;
BEGIN
    -- Obtener información del usuario actual
    SELECT salmonera_id, servicio_id 
    INTO user_salmonera_id, user_servicio_id
    FROM public.usuario 
    WHERE usuario_id = auth.uid();
    
    -- Determinar empresa y tipo
    IF user_salmonera_id IS NOT NULL THEN
        company_id := user_salmonera_id;
        company_type := 'salmonera';
        default_context_type := 'mixed'; -- Salmoneras pueden planificar y ejecutar
        requires_docs := true;
    ELSIF user_servicio_id IS NOT NULL THEN
        company_id := user_servicio_id;
        company_type := 'contratista';
        default_context_type := 'direct'; -- Contratistas ejecutan directamente
        requires_docs := false;
    ELSE
        RETURN NEW; -- No hay empresa asociada, continuar
    END IF;
    
    -- Crear contexto si no existe
    INSERT INTO public.operational_contexts (
        company_id,
        company_type,
        context_type,
        requires_planning,
        requires_documents,
        allows_direct_operations,
        active_modules
    ) VALUES (
        company_id,
        company_type,
        default_context_type,
        company_type = 'salmonera',
        requires_docs,
        true,
        ARRAY['core_immersions']
    )
    ON CONFLICT (company_id, company_type) DO NOTHING;
    
    RETURN NEW;
END;
$function$;

-- Trigger para crear contextos automáticamente
CREATE OR REPLACE TRIGGER ensure_operational_context_trigger
    AFTER INSERT ON public.usuario
    FOR EACH ROW
    EXECUTE FUNCTION public.ensure_operational_context();

-- RLS para operational_contexts
ALTER TABLE public.operational_contexts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company operational context"
ON public.operational_contexts FOR SELECT
USING (
  company_id = COALESCE(
    (SELECT salmonera_id FROM public.usuario WHERE usuario_id = auth.uid()),
    (SELECT servicio_id FROM public.usuario WHERE usuario_id = auth.uid())
  )
);

CREATE POLICY "Admins can manage their company operational context"
ON public.operational_contexts FOR ALL
USING (
  company_id = COALESCE(
    (SELECT salmonera_id FROM public.usuario WHERE usuario_id = auth.uid()),
    (SELECT servicio_id FROM public.usuario WHERE usuario_id = auth.uid())
  )
  AND EXISTS (
    SELECT 1 FROM public.usuario 
    WHERE usuario_id = auth.uid() 
    AND rol IN ('superuser', 'admin_salmonera', 'admin_servicio')
  )
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_operational_contexts_company ON public.operational_contexts(company_id, company_type);
CREATE INDEX IF NOT EXISTS idx_inmersion_context ON public.inmersion(context_type, validation_status);
