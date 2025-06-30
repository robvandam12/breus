
-- Activar módulos para MultiX (empresa de testing)
-- Primero encontrar el ID de MultiX

DO $$
DECLARE
    multix_id UUID;
BEGIN
    -- Buscar MultiX en contratistas (asumiendo que es un contratista)
    SELECT id INTO multix_id 
    FROM contratistas 
    WHERE nombre ILIKE '%multix%' 
    LIMIT 1;
    
    -- Si no existe como contratista, buscar en salmoneras
    IF multix_id IS NULL THEN
        SELECT id INTO multix_id 
        FROM salmoneras 
        WHERE nombre ILIKE '%multix%' 
        LIMIT 1;
        
        -- Si existe como salmonera, activar módulos
        IF multix_id IS NOT NULL THEN
            -- Insertar o actualizar módulos para salmonera MultiX
            INSERT INTO company_modules (company_id, company_type, module_name, is_active, activated_at)
            VALUES 
                (multix_id, 'salmonera', 'planning_operations', true, now()),
                (multix_id, 'salmonera', 'maintenance_networks', true, now()),
                (multix_id, 'salmonera', 'advanced_reporting', true, now())
            ON CONFLICT (company_id, company_type, module_name)
            DO UPDATE SET 
                is_active = true,
                activated_at = now(),
                updated_at = now();
                
            RAISE NOTICE 'Módulos activados para MultiX (salmonera): %', multix_id;
        END IF;
    ELSE
        -- MultiX es contratista, activar módulos
        INSERT INTO company_modules (company_id, company_type, module_name, is_active, activated_at)
        VALUES 
            (multix_id, 'contratista', 'planning_operations', true, now()),
            (multix_id, 'contratista', 'maintenance_networks', true, now()),
            (multix_id, 'contratista', 'advanced_reporting', true, now())
        ON CONFLICT (company_id, company_type, module_name)
        DO UPDATE SET 
            is_active = true,
            activated_at = now(),
            updated_at = now();
            
        RAISE NOTICE 'Módulos activados para MultiX (contratista): %', multix_id;
    END IF;
    
    -- Si no encontramos MultiX en ninguna tabla
    IF multix_id IS NULL THEN
        RAISE NOTICE 'No se encontró empresa MultiX en el sistema';
    END IF;
END $$;

-- Verificar que los módulos base existen en system_modules
INSERT INTO system_modules (name, display_name, description, category, is_core)
VALUES 
    ('planning_operations', 'Planning de Operaciones', 'Módulo para planificación y gestión de operaciones de buceo', 'operations', false),
    ('maintenance_networks', 'Mantenimiento de Redes', 'Módulo para gestión de mantenimiento de redes de pesca', 'maintenance', false),
    ('advanced_reporting', 'Reportes Avanzados', 'Módulo para generación de reportes y análisis avanzados', 'reporting', false),
    ('external_integrations', 'Integraciones Externas', 'Módulo para integraciones con sistemas externos', 'integrations', false)
ON CONFLICT (name) DO NOTHING;

-- Asegurar que core_immersions existe y está marcado como core
INSERT INTO system_modules (name, display_name, description, category, is_core)
VALUES 
    ('core_immersions', 'Inmersiones Core', 'Funcionalidad básica de inmersiones - siempre activo', 'core', true)
ON CONFLICT (name) 
DO UPDATE SET 
    is_core = true,
    updated_at = now();
