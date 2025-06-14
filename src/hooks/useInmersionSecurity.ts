
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Inmersion } from "@/types/inmersion";

interface SecurityAlertRule {
  id: string;
  type: 'DEPTH_LIMIT' | 'ASCENT_RATE' | 'BOTTOM_TIME';
  config: any;
  priority: string;
  enabled: boolean;
}

export const useInmersionSecurity = () => {
  const checkForSecurityBreaches = async (id: string, data: Partial<Inmersion>) => {
    const { data: currentInmersion, error: fetchError } = await supabase
      .from('inmersion')
      .select('depth_history, profundidad_max, supervisor_id, codigo, operacion_id, planned_bottom_time, fecha_inmersion, hora_inicio, estado')
      .eq('inmersion_id', id)
      .single();

    if (fetchError) throw fetchError;
    
    if (!currentInmersion) return;

    const { data: rules, error: rulesError } = await supabase
      .from('security_alert_rules')
      .select('*')
      .in('type', ['DEPTH_LIMIT', 'ASCENT_RATE', 'BOTTOM_TIME'])
      .eq('enabled', true);

    if (rulesError) {
      console.error('Error fetching security rules:', rulesError);
      return;
    }
    
    if (!rules || rules.length === 0) return;
    
    const alertsToInsert = [];
    const currentHistory = (currentInmersion.depth_history || []) as Array<{ depth: number; timestamp: string }>;

    const { data: existingAlerts } = await supabase
      .from('security_alerts')
      .select('type')
      .eq('inmersion_id', id)
      .eq('acknowledged', false);
    const existingAlertTypes = existingAlerts?.map(a => a.type) || [];

    // 1. DEPTH_LIMIT
    const depthRule = rules.find(r => r.type === 'DEPTH_LIMIT');
    if (depthRule && data.current_depth! > currentInmersion.profundidad_max && !existingAlertTypes.includes('DEPTH_LIMIT')) {
      alertsToInsert.push({
        inmersion_id: id, rule_id: depthRule.id, type: 'DEPTH_LIMIT', priority: depthRule.priority,
        details: { current_depth: data.current_depth, max_depth: currentInmersion.profundidad_max, inmersion_code: currentInmersion.codigo }
      });
    }

    // 2. ASCENT_RATE
    const ascentRule = rules.find(r => r.type === 'ASCENT_RATE');
    if (ascentRule && currentHistory.length > 0) {
      const lastHistoryEntry = currentHistory[currentHistory.length - 1];
      if (data.current_depth! < lastHistoryEntry.depth) {
        const depthChange = lastHistoryEntry.depth - data.current_depth!;
        const timeChangeMs = new Date().getTime() - new Date(lastHistoryEntry.timestamp).getTime();
        if (timeChangeMs > 1000) {
          const timeChangeMin = timeChangeMs / (1000 * 60);
          const ascentRate = depthChange / timeChangeMin;
          const maxAscentRate = (ascentRule.config as any)?.max_ascent_rate_m_per_min || 10;
          if (ascentRate > maxAscentRate) {
             alertsToInsert.push({
                inmersion_id: id, rule_id: ascentRule.id, type: 'ASCENT_RATE', priority: ascentRule.priority,
                details: { ascent_rate: ascentRate.toFixed(2), max_ascent_rate: maxAscentRate, inmersion_code: currentInmersion.codigo }
             });
          }
        }
      }
    }

    // 3. BOTTOM_TIME
    const bottomTimeRule = rules.find(r => r.type === 'BOTTOM_TIME');
    if (bottomTimeRule && currentInmersion.planned_bottom_time && currentInmersion.estado === 'en_progreso' && !existingAlertTypes.includes('BOTTOM_TIME')) {
        const startTime = new Date(`${currentInmersion.fecha_inmersion}T${currentInmersion.hora_inicio}`);
        const currentBottomTime = (new Date().getTime() - startTime.getTime()) / (1000 * 60);
        if (currentBottomTime > currentInmersion.planned_bottom_time) {
            alertsToInsert.push({
                inmersion_id: id, rule_id: bottomTimeRule.id, type: 'BOTTOM_TIME', priority: bottomTimeRule.priority,
                details: { current_bottom_time: currentBottomTime.toFixed(2), planned_bottom_time: currentInmersion.planned_bottom_time, inmersion_code: currentInmersion.codigo }
            });
        }
    }
    
    if (alertsToInsert.length > 0) {
      const { error: alertError } = await supabase.from('security_alerts').insert(alertsToInsert);
      if (alertError) {
        console.error('Error creating security alert(s):', alertError);
        toast({ title: "Error al crear alerta(s)", description: "No se pudo registrar la(s) alerta(s) de seguridad.", variant: "destructive" });
      } else {
         toast({ title: `¡${alertsToInsert.length} Alerta(s) de Seguridad Registrada(s)!`, description: "Se ha notificado al supervisor.", variant: "destructive" });
      }
    }
  };

  return { checkForSecurityBreaches };
};
