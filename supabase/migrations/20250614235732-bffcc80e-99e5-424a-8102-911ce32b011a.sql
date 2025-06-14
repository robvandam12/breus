
CREATE OR REPLACE FUNCTION get_security_alert_stats(
    p_start_date TIMESTAMPTZ,
    p_end_date TIMESTAMPTZ
)
RETURNS JSONB AS $$
DECLARE
    total_alerts BIGINT;
    alerts_by_priority JSONB;
    alerts_by_type JSONB;
    avg_ack_time_seconds NUMERIC;
    unacknowledged_alerts BIGINT;
BEGIN
    -- Total de alertas en el rango de fechas
    SELECT COUNT(*)
    INTO total_alerts
    FROM public.security_alerts
    WHERE created_at >= p_start_date AND created_at <= p_end_date;

    -- Alertas por prioridad
    SELECT jsonb_object_agg(priority, count)
    INTO alerts_by_priority
    FROM (
        SELECT priority, COUNT(*) as count
        FROM public.security_alerts
        WHERE created_at >= p_start_date AND created_at <= p_end_date
        GROUP BY priority
    ) as priority_counts;

    -- Alertas por tipo
    SELECT jsonb_object_agg(type, count)
    INTO alerts_by_type
    FROM (
        SELECT type, COUNT(*) as count
        FROM public.security_alerts
        WHERE created_at >= p_start_date AND created_at <= p_end_date
        GROUP BY type
    ) as type_counts;
    
    -- Tiempo promedio de reconocimiento en segundos
    SELECT AVG(EXTRACT(EPOCH FROM (acknowledged_at - created_at)))
    INTO avg_ack_time_seconds
    FROM public.security_alerts
    WHERE acknowledged = true 
      AND acknowledged_at IS NOT NULL
      AND created_at >= p_start_date AND created_at <= p_end_date;

    -- Alertas sin reconocer actualmente en el rango de fechas
    SELECT COUNT(*)
    INTO unacknowledged_alerts
    FROM public.security_alerts
    WHERE acknowledged = false
      AND created_at >= p_start_date AND created_at <= p_end_date;

    RETURN jsonb_build_object(
        'total_alerts', COALESCE(total_alerts, 0),
        'alerts_by_priority', COALESCE(alerts_by_priority, '{}'::jsonb),
        'alerts_by_type', COALESCE(alerts_by_type, '{}'::jsonb),
        'avg_acknowledgement_time_seconds', ROUND(COALESCE(avg_ack_time_seconds, 0)),
        'unacknowledged_alerts', COALESCE(unacknowledged_alerts, 0)
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
