
-- Verificar y corregir la configuración de MultiX como empresa de testing

-- Primero, verificar si MultiX existe y en qué tabla
DO $$
DECLARE
    multix_salmonera_id UUID;
    multix_contratista_id UUID;
BEGIN
    -- Buscar MultiX en salmoneras
    SELECT id INTO multix_salmonera_id 
    FROM salmoneras 
    WHERE nombre ILIKE '%multix%' 
    LIMIT 1;
    
    -- Buscar MultiX en contratistas
    SELECT id INTO multix_contratista_id 
    FROM contratistas 
    WHERE nombre ILIKE '%multix%' 
    LIMIT 1;
    
    -- Reportar lo encontrado
    IF multix_salmonera_id IS NOT NULL THEN
        RAISE NOTICE 'MultiX encontrada como SALMONERA con ID: %', multix_salmonera_id;
        
        -- Verificar módulos actuales
        RAISE NOTICE 'Módulos actuales de MultiX (salmonera):';
        FOR multix_contratista_id IN 
            SELECT module_name FROM company_modules 
            WHERE company_id = multix_salmonera_id AND company_type = 'salmonera'
        LOOP
            RAISE NOTICE '  - %', multix_contratista_id;
        END LOOP;
        
        -- Limpiar módulos existentes para MultiX salmonera
        DELETE FROM company_modules 
        WHERE company_id = multix_salmonera_id AND company_type = 'salmonera';
        
        -- Insertar SOLO el módulo core (para testing)
        INSERT INTO company_modules (company_id, company_type, module_name, is_active, activated_at)
        VALUES (multix_salmonera_id, 'salmonera', 'core_immersions', true, now());
        
        RAISE NOTICE 'MultiX (salmonera) configurada con SOLO módulo core_immersions';
        
    ELSIF multix_contratista_id IS NOT NULL THEN
        RAISE NOTICE 'MultiX encontrada como CONTRATISTA con ID: %', multix_contratista_id;
        
        -- Si está como contratista, moverla a salmonera para testing
        INSERT INTO salmoneras (nombre, rut, direccion, estado)
        SELECT nombre, rut, direccion, estado 
        FROM contratistas 
        WHERE id = multix_contratista_id
        ON CONFLICT (rut) DO NOTHING;
        
        -- Obtener el ID de la nueva salmonera
        SELECT id INTO multix_salmonera_id 
        FROM salmoneras 
        WHERE nombre ILIKE '%multix%' 
        LIMIT 1;
        
        -- Insertar SOLO el módulo core
        INSERT INTO company_modules (company_id, company_type, module_name, is_active, activated_at)
        VALUES (multix_salmonera_id, 'salmonera', 'core_immersions', true, now())
        ON CONFLICT (company_id, company_type, module_name) DO NOTHING;
        
        RAISE NOTICE 'MultiX movida a salmonera con ID: % y configurada con SOLO módulo core', multix_salmonera_id;
        
    ELSE
        -- Si no existe, crearla como salmonera
        INSERT INTO salmoneras (nombre, rut, direccion, estado)
        VALUES ('MultiX Salmonera', '76.XXX.XXX-X', 'Dirección de prueba', 'activa')
        RETURNING id INTO multix_salmonera_id;
        
        -- Insertar SOLO el módulo core
        INSERT INTO company_modules (company_id, company_type, module_name, is_active, activated_at)
        VALUES (multix_salmonera_id, 'salmonera', 'core_immersions', true, now());
        
        RAISE NOTICE 'MultiX creada como salmonera con ID: % y configurada con SOLO módulo core', multix_salmonera_id;
    END IF;
END $$;

-- Verificar configuración final
SELECT 
    s.nombre as empresa_nombre,
    s.id as empresa_id,
    'salmonera' as tipo_empresa,
    cm.module_name,
    cm.is_active,
    cm.activated_at
FROM salmoneras s
LEFT JOIN company_modules cm ON s.id = cm.company_id AND cm.company_type = 'salmonera'
WHERE s.nombre ILIKE '%multix%'
ORDER BY cm.module_name;
