
-- Agregar columna región a la tabla sitios
ALTER TABLE public.sitios 
ADD COLUMN region text;

-- Actualizar sitios existentes con regiones basadas en su ubicación
UPDATE public.sitios 
SET region = CASE 
  WHEN ubicacion ILIKE '%valparaíso%' OR ubicacion ILIKE '%valparaiso%' THEN 'Valparaíso'
  WHEN ubicacion ILIKE '%los lagos%' OR ubicacion ILIKE '%puerto montt%' OR ubicacion ILIKE '%osorno%' THEN 'Los Lagos'
  WHEN ubicacion ILIKE '%aysén%' OR ubicacion ILIKE '%aysen%' OR ubicacion ILIKE '%coyhaique%' THEN 'Aysén'
  WHEN ubicacion ILIKE '%magallanes%' OR ubicacion ILIKE '%punta arenas%' THEN 'Magallanes'
  WHEN ubicacion ILIKE '%antofagasta%' THEN 'Antofagasta'
  WHEN ubicacion ILIKE '%atacama%' THEN 'Atacama'
  WHEN ubicacion ILIKE '%coquimbo%' THEN 'Coquimbo'
  WHEN ubicacion ILIKE '%metropolitana%' OR ubicacion ILIKE '%santiago%' THEN 'Metropolitana'
  WHEN ubicacion ILIKE '%ohiggins%' OR ubicacion ILIKE '%rancagua%' THEN 'O´Higgins'
  WHEN ubicacion ILIKE '%maule%' OR ubicacion ILIKE '%talca%' THEN 'Maule'
  WHEN ubicacion ILIKE '%ñuble%' OR ubicacion ILIKE '%chillán%' THEN 'Ñuble'
  WHEN ubicacion ILIKE '%biobío%' OR ubicacion ILIKE '%biobio%' OR ubicacion ILIKE '%concepción%' THEN 'Biobío'
  WHEN ubicacion ILIKE '%araucanía%' OR ubicacion ILIKE '%araucania%' OR ubicacion ILIKE '%temuco%' THEN 'Araucanía'
  WHEN ubicacion ILIKE '%los ríos%' OR ubicacion ILIKE '%los rios%' OR ubicacion ILIKE '%valdivia%' THEN 'Los Ríos'
  ELSE 'Los Lagos' -- Por defecto para sitios de acuicultura
END
WHERE region IS NULL;
