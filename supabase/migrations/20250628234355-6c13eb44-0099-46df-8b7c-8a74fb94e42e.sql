
-- Actualizar la función create_operacion_context para manejar superusers
CREATE OR REPLACE FUNCTION public.create_operacion_context()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    user_salmonera_id uuid;
    user_servicio_id uuid;
    user_role text;
    origen_id uuid;
    origen_tipo text;
BEGIN
    -- Obtener información del usuario actual
    SELECT salmonera_id, servicio_id, rol
    INTO user_salmonera_id, user_servicio_id, user_role
    FROM public.usuario 
    WHERE usuario_id = auth.uid();
    
    -- Si es superuser, usar los datos de la operación directamente
    IF user_role = 'superuser' THEN
        -- Para superusers, usar los datos que vienen en la operación
        IF NEW.salmonera_id IS NOT NULL THEN
            origen_id := NEW.salmonera_id;
            origen_tipo := 'salmonera';
        ELSIF NEW.contratista_id IS NOT NULL THEN
            origen_id := NEW.contratista_id;
            origen_tipo := 'contratista';
        ELSE
            -- Si no hay empresa definida, usar valores por defecto
            origen_id := NULL;
            origen_tipo := 'salmonera'; -- Por defecto
        END IF;
    ELSE
        -- Para usuarios normales, usar su empresa asociada
        IF user_salmonera_id IS NOT NULL THEN
            origen_id := user_salmonera_id;
            origen_tipo := 'salmonera';
        ELSIF user_servicio_id IS NOT NULL THEN
            origen_id := user_servicio_id;
            origen_tipo := 'contratista';
        ELSE
            RAISE EXCEPTION 'Usuario sin empresa asociada';
        END IF;
    END IF;
    
    -- Crear contexto
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
$function$;
