
-- Modificar el trigger de validación para que no se ejecute en inmersiones independientes
CREATE OR REPLACE FUNCTION public.validate_pre_inmersion()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
    -- Solo validar si hay operación asociada (no es inmersión independiente)
    IF NEW.operacion_id IS NOT NULL THEN
        -- Verificar que exista HPT firmado para la operación
        IF NOT EXISTS (
            SELECT 1 FROM public.hpt 
            WHERE operacion_id = NEW.operacion_id 
            AND firmado = true
            AND estado = 'firmado'
        ) THEN
            RAISE EXCEPTION 'No existe HPT firmado para la operación %', NEW.operacion_id;
        END IF;
        
        -- Verificar que exista Anexo Bravo firmado para la operación
        IF NOT EXISTS (
            SELECT 1 FROM public.anexo_bravo 
            WHERE operacion_id = NEW.operacion_id 
            AND firmado = true
            AND estado = 'firmado'
        ) THEN
            RAISE EXCEPTION 'No existe Anexo Bravo firmado para la operación %', NEW.operacion_id;
        END IF;
        
        -- Auto-marcar como validado si pasa las verificaciones
        NEW.hpt_validado = true;
        NEW.anexo_bravo_validado = true;
    ELSE
        -- Para inmersiones independientes, marcar como validado automáticamente
        NEW.hpt_validado = true;
        NEW.anexo_bravo_validado = true;
        NEW.is_independent = true;
    END IF;
    
    RETURN NEW;
END;
$function$;

-- Actualizar la función de validación contextual para manejar inmersiones sin operación
CREATE OR REPLACE FUNCTION public.validate_inmersion_context()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    operacion_context_rec RECORD;
    user_salmonera_id uuid;
    user_servicio_id uuid;
BEGIN
    -- Si no hay operación, es inmersión independiente
    IF NEW.operacion_id IS NULL THEN
        -- Obtener información del usuario
        SELECT salmonera_id, servicio_id 
        INTO user_salmonera_id, user_servicio_id
        FROM public.usuario 
        WHERE usuario_id = auth.uid();
        
        -- Configurar inmersión independiente
        NEW.contexto_operativo = 'independiente';
        NEW.empresa_creadora_id = COALESCE(user_salmonera_id, user_servicio_id);
        NEW.empresa_creadora_tipo = CASE WHEN user_salmonera_id IS NOT NULL THEN 'salmonera' ELSE 'contratista' END;
        NEW.is_independent = true;
        NEW.hpt_validado = true;
        NEW.anexo_bravo_validado = true;
        NEW.requiere_validacion_previa = false;
        NEW.validacion_contextual = jsonb_build_object(
            'tipo_validacion', 'independiente',
            'requiere_documentos', false,
            'validado_automaticamente', true,
            'validado_en', now()
        );
        
        RETURN NEW;
    END IF;

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
$function$;
