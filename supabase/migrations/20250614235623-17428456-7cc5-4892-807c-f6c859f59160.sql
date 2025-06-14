
-- Habilitar las extensiones necesarias si aún no lo están
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Asegurar que el rol postgres (usado por pg_cron) pueda usar pg_net para hacer llamadas HTTP
GRANT USAGE ON SCHEMA net TO postgres;

-- Programar el cron job para ejecutar la función de escalamiento de alertas cada 5 minutos
SELECT cron.schedule(
    'escalate-alerts-job', -- Nombre único para el trabajo cron
    '*/5 * * * *',        -- Expresión cron: "cada 5 minutos"
    $$
    SELECT net.http_post(
        url := 'https://mwxytzuootrrudjfwsif.supabase.co/functions/v1/alert-escalation',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13eHl0enVvb3RycnVkamZ3c2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMjQwMjksImV4cCI6MjA2MzcwMDAyOX0.aoo3xSplHnVC_gkLjxlbgFECX31VEA1JoQrzpBm3FNE"}'::jsonb,
        body := '{}'::jsonb
    ) AS request_id;
    $$
);
