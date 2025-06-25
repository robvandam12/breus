
-- Agregar campos de contexto empresarial donde falten y migrar datos existentes

-- 1. Agregar campos faltantes en operacion si no existen
ALTER TABLE public.operacion 
ADD COLUMN IF NOT EXISTS company_id uuid,
ADD COLUMN IF NOT EXISTS company_type text CHECK (company_type IN ('salmonera', 'contratista'));

-- 2. Agregar campos en equipos_buceo si no existen
ALTER TABLE public.equipos_buceo 
ADD COLUMN IF NOT EXISTS company_id uuid,
ADD COLUMN IF NOT EXISTS company_type text CHECK (company_type IN ('salmonera', 'contratista'));

-- 3. Agregar campos en hpt si no existen
ALTER TABLE public.hpt 
ADD COLUMN IF NOT EXISTS company_id uuid,
ADD COLUMN IF NOT EXISTS company_type text CHECK (company_type IN ('salmonera', 'contratista'));

-- 4. Agregar campos en anexo_bravo si no existen
ALTER TABLE public.anexo_bravo 
ADD COLUMN IF NOT EXISTS company_id uuid,
ADD COLUMN IF NOT EXISTS company_type text CHECK (company_type IN ('salmonera', 'contratista'));

-- 5. Agregar campos en bitacora_supervisor si no existen
ALTER TABLE public.bitacora_supervisor 
ADD COLUMN IF NOT EXISTS company_id uuid,
ADD COLUMN IF NOT EXISTS company_type text CHECK (company_type IN ('salmonera', 'contratista'));

-- 6. Agregar campos en bitacora_buzo si no existen
ALTER TABLE public.bitacora_buzo 
ADD COLUMN IF NOT EXISTS company_id uuid,
ADD COLUMN IF NOT EXISTS company_type text CHECK (company_type IN ('salmonera', 'contratista'));

-- 7. Migrar datos existentes en operacion
UPDATE public.operacion SET 
  company_id = salmonera_id,
  company_type = 'salmonera'
WHERE salmonera_id IS NOT NULL AND company_id IS NULL;

UPDATE public.operacion SET 
  company_id = servicio_id,
  company_type = 'contratista'
WHERE servicio_id IS NOT NULL AND company_id IS NULL;

-- 8. Migrar datos existentes en equipos_buceo
UPDATE public.equipos_buceo SET 
  company_id = empresa_id,
  company_type = tipo_empresa
WHERE company_id IS NULL;

-- 9. Migrar datos existentes en inmersion (ya tiene company_id y company_type)
-- No necesita migración

-- 10. Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_operacion_company ON public.operacion(company_id, company_type);
CREATE INDEX IF NOT EXISTS idx_equipos_buceo_company ON public.equipos_buceo(company_id, company_type);
CREATE INDEX IF NOT EXISTS idx_hpt_company ON public.hpt(company_id, company_type);
CREATE INDEX IF NOT EXISTS idx_anexo_bravo_company ON public.anexo_bravo(company_id, company_type);
CREATE INDEX IF NOT EXISTS idx_bitacora_supervisor_company ON public.bitacora_supervisor(company_id, company_type);
CREATE INDEX IF NOT EXISTS idx_bitacora_buzo_company ON public.bitacora_buzo(company_id, company_type);

-- 11. Crear función para obtener contexto de empresa del usuario actual
CREATE OR REPLACE FUNCTION public.get_user_company_context()
RETURNS TABLE(company_id uuid, company_type text, is_superuser boolean)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $function$
DECLARE
    user_salmonera_id uuid;
    user_servicio_id uuid;
    user_role text;
BEGIN
    -- Obtener información del usuario actual
    SELECT salmonera_id, servicio_id, rol
    INTO user_salmonera_id, user_servicio_id, user_role
    FROM public.usuario 
    WHERE usuario_id = auth.uid();
    
    -- Si es superuser, devolver NULL para empresa (debe seleccionar manualmente)
    IF user_role = 'superuser' THEN
        RETURN QUERY SELECT NULL::uuid, NULL::text, true;
        RETURN;
    END IF;
    
    -- Si pertenece a salmonera
    IF user_salmonera_id IS NOT NULL THEN
        RETURN QUERY SELECT user_salmonera_id, 'salmonera'::text, false;
        RETURN;
    END IF;
    
    -- Si pertenece a contratista
    IF user_servicio_id IS NOT NULL THEN
        RETURN QUERY SELECT user_servicio_id, 'contratista'::text, false;
        RETURN;
    END IF;
    
    -- No tiene empresa asociada
    RETURN QUERY SELECT NULL::uuid, NULL::text, false;
END;
$function$;

-- 12. Crear función para validar acceso a empresa
CREATE OR REPLACE FUNCTION public.can_access_company(target_company_id uuid, target_company_type text)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $function$
DECLARE
    user_context RECORD;
BEGIN
    -- Obtener contexto del usuario
    SELECT * INTO user_context FROM public.get_user_company_context();
    
    -- Superuser puede acceder a cualquier empresa
    IF user_context.is_superuser THEN
        RETURN true;
    END IF;
    
    -- Usuario normal solo puede acceder a su propia empresa
    RETURN user_context.company_id = target_company_id 
           AND user_context.company_type = target_company_type;
END;
$function$;
