
-- Crear bucket para fotos de perfil
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-photos',
  'profile-photos',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Crear políticas para el bucket de fotos de perfil
CREATE POLICY "Users can upload their own profile photos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Profile photos are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can update their own profile photos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own profile photos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Agregar columna de estado a la tabla usuario
ALTER TABLE public.usuario 
ADD COLUMN IF NOT EXISTS estado_buzo text DEFAULT 'inactivo' CHECK (estado_buzo IN ('activo', 'inactivo', 'suspendido'));

-- Función para validar RUT chileno
CREATE OR REPLACE FUNCTION public.validate_rut(rut_input text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  rut_clean text;
  rut_number text;
  check_digit text;
  calculated_digit text;
  sum_val integer := 0;
  multiplier integer := 2;
  i integer;
BEGIN
  -- Limpiar el RUT (remover puntos, guiones y espacios)
  rut_clean := UPPER(REGEXP_REPLACE(rut_input, '[^0-9K]', '', 'g'));
  
  -- Verificar que tenga al menos 2 caracteres
  IF LENGTH(rut_clean) < 2 THEN
    RETURN false;
  END IF;
  
  -- Separar número y dígito verificador
  rut_number := SUBSTRING(rut_clean FROM 1 FOR LENGTH(rut_clean) - 1);
  check_digit := SUBSTRING(rut_clean FROM LENGTH(rut_clean));
  
  -- Verificar que el número sea numérico
  IF rut_number !~ '^[0-9]+$' THEN
    RETURN false;
  END IF;
  
  -- Calcular dígito verificador
  FOR i IN REVERSE LENGTH(rut_number)..1 LOOP
    sum_val := sum_val + (SUBSTRING(rut_number FROM i FOR 1)::integer * multiplier);
    multiplier := multiplier + 1;
    IF multiplier > 7 THEN
      multiplier := 2;
    END IF;
  END LOOP;
  
  calculated_digit := CASE (11 - (sum_val % 11))
    WHEN 10 THEN 'K'
    WHEN 11 THEN '0'
    ELSE (11 - (sum_val % 11))::text
  END;
  
  RETURN check_digit = calculated_digit;
END;
$$;
