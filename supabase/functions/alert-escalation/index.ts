
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EscalationLevelConfig {
    after_minutes: number;
    notify_roles: string[];
    channels: string[];
}

interface SecurityAlertRule {
    id: string;
    escalation_policy: { levels: EscalationLevelConfig[] };
    type: string;
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }
    
    try {
        const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        const { data: activeAlerts, error: fetchError } = await supabaseAdmin
            .from('security_alerts')
            .select(`
                id, type, priority, escalation_level, created_at, last_escalated_at, details, inmersion_id,
                inmersion:inmersion_id (codigo, operacion_id),
                rule:rule_id (*)
            `)
            .eq('acknowledged', false)
            .in('priority', ['critical', 'emergency']);

        if (fetchError) throw fetchError;
        
        if (!activeAlerts || activeAlerts.length === 0) {
            return new Response(JSON.stringify({ message: 'No active critical alerts to check.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }
        
        const { data: templateRulesData, error: rulesError } = await supabaseAdmin
            .from('security_alert_rules')
            .select('*')
            .eq('is_template', true)
            .eq('enabled', true);
            
        if (rulesError) throw rulesError;
        const templateRules = new Map(templateRulesData.map(r => [r.type, r]));

        const notificationsToInsert = [];
        const alertsToUpdate = [];

        for (const alert of activeAlerts) {
            const rule: SecurityAlertRule | undefined = alert.rule || templateRules.get(alert.type);

            if (!rule || !rule.escalation_policy?.levels) {
                console.log(`No valid escalation rule for alert ${alert.id} of type ${alert.type}.`);
                continue;
            }

            const currentEscalationLevel = alert.escalation_level;
            const policyLevels = rule.escalation_policy.levels;
            
            if (currentEscalationLevel >= policyLevels.length) {
                continue;
            }

            const escalationConfig = policyLevels[currentEscalationLevel];
            const lastEventTimestamp = alert.last_escalated_at || alert.created_at;
            const minutesSinceLastEvent = (new Date().getTime() - new Date(lastEventTimestamp).getTime()) / (1000 * 60);

            if (minutesSinceLastEvent >= escalationConfig.after_minutes) {
                const newEscalationLevel = currentEscalationLevel + 1;
                
                alertsToUpdate.push({
                    id: alert.id,
                    escalation_level: newEscalationLevel,
                    last_escalated_at: new Date().toISOString()
                });
                
                const { data: usersToNotify, error: userError } = await supabaseAdmin
                    .from('usuario')
                    .select('usuario_id')
                    .in('rol', escalationConfig.notify_roles);
                
                if (userError) {
                    console.error(`Error fetching users for roles ${escalationConfig.notify_roles}:`, userError);
                    continue;
                }

                if (usersToNotify && usersToNotify.length > 0) {
                    const inmersionCode = alert.inmersion?.codigo || alert.details?.inmersion_code || 'N/A';
                    const title = `🚨 Alerta Escalada (Nivel ${newEscalationLevel}) - Inmersión ${inmersionCode}`;
                    const message = `La alerta de tipo "${alert.type}" no ha sido reconocida y necesita atención inmediata.`;

                    for (const user of usersToNotify) {
                        notificationsToInsert.push({
                            user_id: user.usuario_id,
                            type: 'emergency',
                            title,
                            message,
                            metadata: {
                                security_alert_id: alert.id,
                                inmersion_id: alert.inmersion_id,
                                operacion_id: alert.inmersion?.operacion_id,
                                link: '/dashboard', 
                            }
                        });
                    }
                }
            }
        }

        if (alertsToUpdate.length > 0) {
            const { error: updateError } = await supabaseAdmin.from('security_alerts').upsert(alertsToUpdate);
            if (updateError) throw updateError;
        }

        if (notificationsToInsert.length > 0) {
            const { error: insertError } = await supabaseAdmin.from('notifications').insert(notificationsToInsert);
            if (insertError) throw insertError;
        }
        
        const successMessage = `Proceso completado. Se escalaron ${alertsToUpdate.length} alertas y se crearon ${notificationsToInsert.length} notificaciones.`;
        console.log(successMessage);

        return new Response(JSON.stringify({ message: successMessage }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error) {
        console.error('Error in alert escalation function:', error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        });
    }
});
