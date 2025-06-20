
-- Crear tabla para control de contextos operacionales
CREATE TABLE public.operacion_context (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operacion_id uuid NOT NULL REFERENCES public.operacion(id) ON DELETE CASCADE,
  tipo_contexto text NOT NULL CHECK (tipo_contexto IN ('planificada', 'operativa_directa')),
  empresa_origen_id uuid NOT NULL, -- Quién la creó
  empresa_origen_tipo text NOT NULL CHECK (empresa_origen_tipo IN ('salmonera', 'contratista')),
  empresa_destino_id uuid, -- Quién la ejecuta (puede ser null si es la misma empresa)
  empresa_destino_tipo text CHECK (empresa_destino_tipo IN ('salmonera', 'contratista')),
  requiere_documentos boolean NOT NULL DEFAULT false,
  requiere_hpt boolean NOT NULL DEFAULT false,
  requiere_anexo_bravo boolean NOT NULL DEFAULT false,
  estado_planificacion text DEFAULT 'pendiente' CHECK (estado_planificacion IN ('pendiente', 'en_progreso', 'completada', 'cancelada')),
  metadatos jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(operacion_id)
);

-- Habilitar RLS en operacion_context
ALTER TABLE public.operacion_context ENABLE ROW LEVEL SECURITY;

-- Política para que las empresas vean sus contextos
CREATE POLICY "Empresas pueden ver sus contextos operacionales" 
  ON public.operacion_context 
  FOR SELECT 
  USING (
    empresa_origen_id IN (
      SELECT salmonera_id FROM public.usuario WHERE usuario_id = auth.uid()
      UNION 
      SELECT servicio_id FROM public.usuario WHERE usuario_id = auth.uid()
    )
    OR 
    empresa_destino_id IN (
      SELECT salmonera_id FROM public.usuario WHERE usuario_id = auth.uid()
      UNION 
      SELECT servicio_id FROM public.usuario WHERE usuario_id = auth.uid()
    )
  );

-- Política para gestionar contextos
CREATE POLICY "Empresas pueden gestionar sus contextos" 
  ON public.operacion_context 
  FOR ALL 
  USING (
    empresa_origen_id IN (
      SELECT salmonera_id FROM public.usuario WHERE usuario_id = auth.uid()
      UNION 
      SELECT servicio_id FROM public.usuario WHERE usuario_id = auth.uid()
    )
  );

-- Añadir columnas contextuales a inmersion
ALTER TABLE public.inmersion 
ADD COLUMN contexto_operativo text DEFAULT 'planificada' CHECK (contexto_operativo IN ('planificada', 'operativa_directa')),
ADD COLUMN requiere_validacion_previa boolean DEFAULT true,
ADD COLUMN empresa_creadora_id uuid,
ADD COLUMN empresa_creadora_tipo text CHECK (empresa_creadora_tipo IN ('salmonera', 'contratista')),
ADD COLUMN validacion_contextual jsonb DEFAULT '{}';

-- Crear índices para mejorar performance
CREATE INDEX idx_operacion_context_tipo ON public.operacion_context(tipo_contexto);
CREATE INDEX idx_operacion_context_empresa_origen ON public.operacion_context(empresa_origen_id, empresa_origen_tipo);
CREATE INDEX idx_inmersion_contexto ON public.inmersion(contexto_operativo);
CREATE INDEX idx_inmersion_empresa_creadora ON public.inmersion(empresa_creadora_id, empresa_creadora_tipo);

-- Función para crear contexto automáticamente cuando se crea una operación
CREATE OR REPLACE FUNCTION public.create_operacion_context()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_salmonera_id uuid;
    user_servicio_id uuid;
    origen_id uuid;
    origen_tipo text;
BEGIN
    -- Obtener información del usuario actual
    SELECT salmonera_id, servicio_id 
    INTO user_salmonera_id, user_servicio_id
    FROM public.usuario 
    WHERE usuario_id = auth.uid();
    
    -- Determinar empresa origen
    IF user_salmonera_id IS NOT NULL THEN
        origen_id := user_salmonera_id;
        origen_tipo := 'salmonera';
    ELSIF user_servicio_id IS NOT NULL THEN
        origen_id := user_servicio_id;
        origen_tipo := 'contratista';
    ELSE
        RAISE EXCEPTION 'Usuario sin empresa asociada';
    END IF;
    
    -- Crear contexto por defecto (planificada para salmoneras, operativa_directa para contratistas)
    INSERT INTO public.operacion_context (
        operacion_id,
        tipo_contexto,
        empresa_origen_id,
        empresa_origen_tipo,
        empresa_destino_id,
        empresa_destino_tipo,
        requiere_documentos,
        requiere_hpt,
        requiere_anexo_bravo
    ) VALUES (
        NEW.id,
        CASE WHEN origen_tipo = 'salmonera' THEN 'planificada' ELSE 'operativa_directa' END,
        origen_id,
        origen_tipo,
        CASE WHEN NEW.contratista_id IS NOT NULL THEN NEW.contratista_id ELSE NULL END,
        CASE WHEN NEW.contratista_id IS NOT NULL THEN 'contratista' ELSE NULL END,
        origen_tipo = 'salmonera',
        origen_tipo = 'salmonera',
        origen_tipo = 'salmonera'
    );
    
    RETURN NEW;
END;
$$;

-- Trigger para crear contexto automáticamente
CREATE TRIGGER trigger_create_operacion_context
    AFTER INSERT ON public.operacion
    FOR EACH ROW
    EXECUTE FUNCTION public.create_operacion_context();

-- Función para validación contextual de inmersiones
CREATE OR REPLACE FUNCTION public.validate_inmersion_context()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    operacion_context_rec RECORD;
    user_salmonera_id uuid;
    user_servicio_id uuid;
BEGIN
    -- Obtener contexto de la operación
    SELECT * INTO operacion_context_rec
    FROM public.operacion_context
    WHERE operacion_id = NEW.operacion_id;
    
    -- Si no hay contexto, asumir operación legacy (requiere validación tradicional)
    IF operacion_context_rec IS NULL THEN
        -- Validación tradicional (HPT y Anexo Bravo requeridos)
        IF NOT EXISTS (
            SELECT 1 FROM public.hpt 
            WHERE operacion_id = NEW.operacion_id 
            AND firmado = true
        ) THEN
            RAISE EXCEPTION 'No existe HPT firmado para la operación %', NEW.operacion_id;
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM public.anexo_bravo 
            WHERE operacion_id = NEW.operacion_id 
            AND firmado = true
        ) THEN
            RAISE EXCEPTION 'No existe Anexo Bravo firmado para la operación %', NEW.operacion_id;
        END IF;
        
        NEW.hpt_validado = true;
        NEW.anexo_bravo_validado = true;
        NEW.contexto_operativo = 'planificada';
        NEW.requiere_validacion_previa = true;
        
        RETURN NEW;
    END IF;
    
    -- Obtener información del usuario
    SELECT salmonera_id, servicio_id 
    INTO user_salmonera_id, user_servicio_id
    FROM public.usuario 
    WHERE usuario_id = auth.uid();
    
    -- Establecer contexto en la inmersión
    NEW.contexto_operativo = operacion_context_rec.tipo_contexto;
    NEW.empresa_creadora_id = COALESCE(user_salmonera_id, user_servicio_id);
    NEW.empresa_creadora_tipo = CASE WHEN user_salmonera_id IS NOT NULL THEN 'salmonera' ELSE 'contratista' END;
    
    -- Validación contextual
    IF operacion_context_rec.tipo_contexto = 'operativa_directa' THEN
        -- Operación directa: no requiere documentos previos
        NEW.hpt_validado = true;
        NEW.anexo_bravo_validado = true;
        NEW.requiere_validacion_previa = false;
        NEW.validacion_contextual = jsonb_build_object(
            'tipo_validacion', 'operativa_directa',
            'requiere_documentos', false,
            'validado_automaticamente', true,
            'validado_en', now()
        );
    ELSE
        -- Operación planificada: aplicar validaciones según contexto
        NEW.requiere_validacion_previa = operacion_context_rec.requiere_documentos;
        
        IF operacion_context_rec.requiere_hpt THEN
            IF NOT EXISTS (
                SELECT 1 FROM public.hpt 
                WHERE operacion_id = NEW.operacion_id 
                AND firmado = true
            ) THEN
                RAISE EXCEPTION 'HPT firmado requerido para esta operación planificada';
            END IF;
            NEW.hpt_validado = true;
        ELSE
            NEW.hpt_validado = true; -- No requerido
        END IF;
        
        IF operacion_context_rec.requiere_anexo_bravo THEN
            IF NOT EXISTS (
                SELECT 1 FROM public.anexo_bravo 
                WHERE operacion_id = NEW.operacion_id 
                AND firmado = true
            ) THEN
                RAISE EXCEPTION 'Anexo Bravo firmado requerido para esta operación planificada';
            END IF;
            NEW.anexo_bravo_validado = true;
        ELSE
            NEW.anexo_bravo_validado = true; -- No requerido
        END IF;
        
        NEW.validacion_contextual = jsonb_build_object(
            'tipo_validacion', 'planificada',
            'requiere_hpt', operacion_context_rec.requiere_hpt,
            'requiere_anexo_bravo', operacion_context_rec.requiere_anexo_bravo,
            'validado_en', now()
        );
    END IF;
    
    RETURN NEW;
END;
$$;

-- Reemplazar el trigger de validación existente
DROP TRIGGER IF EXISTS validate_pre_inmersion_trigger ON public.inmersion;
CREATE TRIGGER validate_inmersion_context_trigger
    BEFORE INSERT ON public.inmersion
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_inmersion_context();

-- Función para obtener contexto completo de operación
CREATE OR REPLACE FUNCTION public.get_operacion_full_context(p_operacion_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
DECLARE
    result jsonb;
    operacion_data RECORD;
    context_data RECORD;
BEGIN
    -- Obtener datos de operación
    SELECT * INTO operacion_data
    FROM public.operacion
    WHERE id = p_operacion_id;
    
    -- Obtener contexto
    SELECT * INTO context_data
    FROM public.operacion_context
    WHERE operacion_id = p_operacion_id;
    
    -- Construir respuesta
    result := jsonb_build_object(
        'operacion', row_to_json(operacion_data),
        'contexto', COALESCE(row_to_json(context_data), '{}'),
        'tiene_contexto', context_data.id IS NOT NULL,
        'es_legacy', context_data.id IS NULL
    );
    
    RETURN result;
END;
$$;

-- Actualizar timestamp en operacion_context
CREATE TRIGGER update_operacion_context_timestamp
    BEFORE UPDATE ON public.operacion_context
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
