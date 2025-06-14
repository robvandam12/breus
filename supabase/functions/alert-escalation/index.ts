
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Las alertas se escalarán si no se reconocen después de este intervalo
const ESCALATION_INTERVAL_MINUTES = 15;

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }
    
    try {
        const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        const escalationThreshold = new Date(Date.now() - ESCALATION_INTERVAL_MINUTES * 60 * 1000).toISOString();

        // 1. Buscar alertas críticas/de emergencia no reconocidas que necesiten escalamiento
        const { data: alertsToEscalate, error: fetchError } = await supabaseAdmin
            .from('security_alerts')
            .select(`
                id, 
                escalation_level, 
                created_at, 
                last_escalated_at, 
                details,
                inmersion_id,
                inmersion:inmersion_id (codigo, operacion_id)
            `)
            .eq('acknowledged', false)
            .in('priority', ['critical', 'emergency'])
            .lte('created_at', escalationThreshold)
            .filter('last_escalated_at', 'is', null)
            .or(`last_escalated_at.lte.${escalationThreshold}`, { referencedTable: 'security_alerts' });

        if (fetchError) {
            console.error('Error al buscar alertas para escalar:', fetchError);
            throw fetchError;
        }

        if (!alertsToEscalate || alertsToEscalate.length === 0) {
            return new Response(JSON.stringify({ message: 'No hay alertas para escalar.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            });
        }
        
        console.log(`Se encontraron ${alertsToEscalate.length} alertas para escalar.`);

        // 2. Encontrar administradores para notificar
        const { data: admins, error: adminError } = await supabaseAdmin
            .from('usuario')
            .select('usuario_id')
            .in('rol', ['admin_servicio', 'superuser']);

        if (adminError) {
            console.error('Error al buscar administradores:', adminError);
            throw adminError;
        }
        
        const notificationsToInsert = [];
        const alertsToUpdate = [];

        for (const alert of alertsToEscalate) {
            const newEscalationLevel = alert.escalation_level + 1;
            
            alertsToUpdate.push({
                id: alert.id,
                escalation_level: newEscalationLevel,
                last_escalated_at: new Date().toISOString()
            });

            const inmersionCode = alert.inmersion?.codigo || alert.details?.inmersion_code || 'N/A';
            const title = `🚨 Alerta Escalada (Nivel ${newEscalationLevel}) - Inmersión ${inmersionCode}`;
            const message = `La alerta de seguridad crítica no ha sido reconocida y necesita atención inmediata.`;

            if (admins && admins.length > 0) {
                for (const admin of admins) {
                    notificationsToInsert.push({
                        user_id: admin.usuario_id,
                        type: 'emergency',
                        title: title,
                        message: message,
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

        // 3. Realizar actualizaciones e inserciones por lotes
        if (alertsToUpdate.length > 0) {
            const { error: updateError } = await supabaseAdmin.from('security_alerts').upsert(alertsToUpdate);
            if (updateError) throw updateError;
        }

        if (notificationsToInsert.length > 0) {
            const { error: insertError } = await supabaseAdmin.from('notifications').insert(notificationsToInsert);
            if (insertError) throw insertError;
        }
        
        const successMessage = `Se escalaron ${alertsToUpdate.length} alertas y se crearon ${notificationsToInsert.length} notificaciones.`;
        console.log(successMessage);

        return new Response(JSON.stringify({ message: successMessage }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error) {
        console.error('Error en la función de escalamiento de alertas:', error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        });
    }
});
