
-- Insertar reglas de seguridad adicionales para velocidad de ascenso y tiempo de fondo
INSERT INTO public.security_alert_rules (name, description, type, config, priority, message_template)
VALUES
('Velocidad de Ascenso Excedida', 'Alerta cuando la velocidad de ascenso es demasiado rápida, superando el límite configurado.', 'ASCENT_RATE', '{"max_ascent_rate_m_per_min": 10}', 'critical', '¡Alerta de Ascenso Rápido! La inmersión {inmersion_code} registra una velocidad de ascenso de {ascent_rate}m/min, superando el límite de {max_ascent_rate}m/min.'),
('Tiempo de Fondo Excedido', 'Alerta cuando el tiempo de fondo real supera el tiempo de fondo planificado en la inmersión.', 'BOTTOM_TIME', '{}', 'warning', '¡Alerta de Tiempo de Fondo! La inmersión {inmersion_code} ha superado el tiempo de fondo planificado de {planned_bottom_time} min. Tiempo actual: {current_bottom_time} min.');
