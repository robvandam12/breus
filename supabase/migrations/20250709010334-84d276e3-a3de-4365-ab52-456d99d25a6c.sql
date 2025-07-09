-- Corregir función get_immersion_stats que usa tabla 'sitios' en lugar de 'centros'
CREATE OR REPLACE FUNCTION public.get_immersion_stats(p_start_date timestamp with time zone, p_end_date timestamp with time zone)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
DECLARE
    -- Main stats
    total_inmersions BIGINT;
    total_dive_time_seconds NUMERIC;
    avg_dive_time_seconds NUMERIC;
    avg_max_depth NUMERIC;

    -- Chart data
    inmersions_by_day JSONB;
    inmersions_by_site JSONB;
    inmersions_by_diver JSONB;
    inmersions_by_work_type JSONB;
BEGIN
    -- Main KPIs for completed immersions with valid times
    SELECT
        COUNT(*),
        COALESCE(SUM(EXTRACT(EPOCH FROM (hora_fin - hora_inicio))), 0),
        COALESCE(AVG(EXTRACT(EPOCH FROM (hora_fin - hora_inicio))), 0),
        COALESCE(AVG(profundidad_max), 0)
    INTO
        total_inmersions,
        total_dive_time_seconds,
        avg_dive_time_seconds,
        avg_max_depth
    FROM public.inmersion
    WHERE fecha_inmersion >= p_start_date::date AND fecha_inmersion <= p_end_date::date
      AND estado = 'completada' AND hora_inicio IS NOT NULL AND hora_fin IS NOT NULL;

    -- Inmersiones por día
    SELECT jsonb_agg(daily_counts)
    INTO inmersions_by_day
    FROM (
        SELECT
            fecha_inmersion::text as date,
            COUNT(*) as count
        FROM public.inmersion
        WHERE fecha_inmersion >= p_start_date::date AND fecha_inmersion <= p_end_date::date
          AND estado = 'completada'
        GROUP BY fecha_inmersion
        ORDER BY fecha_inmersion
    ) as daily_counts;

    -- Inmersiones por centro (antes sitio)
    SELECT jsonb_agg(site_counts)
    INTO inmersions_by_site
    FROM (
        SELECT
            c.nombre as site,
            COUNT(i.inmersion_id) as count
        FROM public.inmersion i
        JOIN public.operacion o ON i.operacion_id = o.id
        JOIN public.centros c ON o.centro_id = c.id
        WHERE i.fecha_inmersion >= p_start_date::date AND i.fecha_inmersion <= p_end_date::date
          AND i.estado = 'completada'
        GROUP BY c.nombre
        ORDER BY count DESC
    ) as site_counts;

    -- Inmersiones por buzo principal (Top 10)
    SELECT jsonb_agg(diver_counts)
    INTO inmersions_by_diver
    FROM (
        SELECT
            buzo_principal as diver,
            COUNT(*) as count
        FROM public.inmersion
        WHERE fecha_inmersion >= p_start_date::date AND fecha_inmersion <= p_end_date::date
          AND estado = 'completada' AND buzo_principal IS NOT NULL AND buzo_principal <> ''
        GROUP BY buzo_principal
        ORDER BY count DESC
        LIMIT 10
    ) as diver_counts;

    -- Inmersiones por tipo de trabajo (objetivo)
    SELECT jsonb_object_agg(type, count)
    INTO inmersions_by_work_type
    FROM (
        SELECT
            COALESCE(objetivo, 'No especificado') as type,
            COUNT(*) as count
        FROM public.inmersion
        WHERE fecha_inmersion >= p_start_date::date AND fecha_inmersion <= p_end_date::date
          AND estado = 'completada'
        GROUP BY objetivo
    ) as work_type_counts;

    RETURN jsonb_build_object(
        'total_inmersions', COALESCE(total_inmersions, 0),
        'total_dive_time_seconds', ROUND(COALESCE(total_dive_time_seconds, 0)),
        'avg_dive_time_seconds', ROUND(COALESCE(avg_dive_time_seconds, 0)),
        'avg_max_depth', ROUND(COALESCE(avg_max_depth, 0), 2),
        'inmersions_by_day', COALESCE(inmersions_by_day, '[]'::jsonb),
        'inmersions_by_site', COALESCE(inmersions_by_site, '[]'::jsonb),
        'inmersions_by_diver', COALESCE(inmersions_by_diver, '[]'::jsonb),
        'inmersions_by_work_type', COALESCE(inmersions_by_work_type, '{}'::jsonb)
    );
END;
$function$;