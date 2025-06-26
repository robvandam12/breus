
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface ImmersionToCheck {
  inmersion_id: string;
  codigo: string;
  estimated_end_time: string;
  estado: string;
  supervisor_id?: string;
  notification_status?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔍 Iniciando verificación de estado de inmersiones...');

    // Buscar inmersiones que deberían haber terminado pero siguen activas
    const { data: immersions, error: fetchError } = await supabase
      .from('inmersion')
      .select(`
        inmersion_id,
        codigo,
        estimated_end_time,
        estado,
        supervisor_id,
        notification_status
      `)
      .eq('estado', 'en_curso')
      .lt('estimated_end_time', new Date().toISOString())
      .limit(50);

    if (fetchError) {
      throw fetchError;
    }

    console.log(`📊 Encontradas ${immersions?.length || 0} inmersiones vencidas`);

    const results = [];

    for (const immersion of immersions || []) {
      try {
        // Marcar como completada automáticamente
        const { error: updateError } = await supabase
          .from('inmersion')
          .update({
            estado: 'completada',
            actual_end_time: new Date().toISOString(),
          })
          .eq('inmersion_id', immersion.inmersion_id);

        if (updateError) {
          console.error(`❌ Error actualizando inmersión ${immersion.codigo}:`, updateError);
          continue;
        }

        console.log(`✅ Inmersión ${immersion.codigo} marcada como completada automáticamente`);

        // Si hay supervisor_id, crear notificación directamente
        if (immersion.supervisor_id) {
          const { error: notificationError } = await supabase
            .rpc('create_workflow_notification', {
              p_user_id: immersion.supervisor_id,
              p_type: 'bitacora_supervisor_pending',
              p_title: 'Bitácora de Supervisor Pendiente - Inmersión Finalizada',
              p_message: `La inmersión ${immersion.codigo} ha finalizado automáticamente. Por favor, complete su bitácora de supervisión.`,
              p_metadata: {
                inmersion_id: immersion.inmersion_id,
                inmersion_code: immersion.codigo,
                priority: 'high',
                link: '/bitacoras/supervisor',
                auto_completed: true
              }
            });

          if (notificationError) {
            console.error(`❌ Error creando notificación para ${immersion.codigo}:`, notificationError);
          } else {
            console.log(`📩 Notificación enviada al supervisor para ${immersion.codigo}`);
          }
        }

        results.push({
          inmersion_id: immersion.inmersion_id,
          codigo: immersion.codigo,
          action: 'auto_completed',
          notification_sent: !!immersion.supervisor_id
        });

      } catch (error) {
        console.error(`❌ Error procesando inmersión ${immersion.codigo}:`, error);
        results.push({
          inmersion_id: immersion.inmersion_id,
          codigo: immersion.codigo,
          action: 'error',
          error: error.message
        });
      }
    }

    // También verificar inmersiones que están por vencer (próximos 30 minutos)
    const upcomingEndTime = new Date();
    upcomingEndTime.setMinutes(upcomingEndTime.getMinutes() + 30);

    const { data: upcomingImmersions, error: upcomingError } = await supabase
      .from('inmersion')
      .select(`
        inmersion_id,
        codigo,
        estimated_end_time,
        supervisor_id,
        notification_status
      `)
      .eq('estado', 'en_curso')
      .gte('estimated_end_time', new Date().toISOString())
      .lt('estimated_end_time', upcomingEndTime.toISOString())
      .is('notification_status->upcoming_end_notified', null);

    if (!upcomingError && upcomingImmersions) {
      console.log(`⏰ Encontradas ${upcomingImmersions.length} inmersiones próximas a finalizar`);

      for (const immersion of upcomingImmersions) {
        if (immersion.supervisor_id) {
          const { error: reminderError } = await supabase
            .rpc('create_workflow_notification', {
              p_user_id: immersion.supervisor_id,
              p_type: 'immersion_ending_soon',
              p_title: 'Inmersión Próxima a Finalizar',
              p_message: `La inmersión ${immersion.codigo} está programada para finalizar en los próximos 30 minutos.`,
              p_metadata: {
                inmersion_id: immersion.inmersion_id,
                inmersion_code: immersion.codigo,
                link: '/inmersiones',
                reminder_type: 'ending_soon'
              }
            });

          if (!reminderError) {
            // Marcar que se envió el recordatorio
            await supabase
              .from('inmersion')
              .update({
                notification_status: {
                  ...immersion.notification_status,
                  upcoming_end_notified: true
                }
              })
              .eq('inmersion_id', immersion.inmersion_id);

            console.log(`⏰ Recordatorio enviado para inmersión ${immersion.codigo}`);
          }
        }
      }
    }

    console.log(`✅ Verificación completada. Procesadas ${results.length} inmersiones`);

    return new Response(
      JSON.stringify({
        success: true,
        processed: results.length,
        results,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('❌ Error en verificación de inmersiones:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});
