
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImmersionCheck {
  inmersion_id: string;
  estimated_end_time: string;
  actual_end_time?: string;
  estado: string;
  supervisor_id?: string;
  codigo: string;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔍 Checking immersion status...');

    // Buscar inmersiones que deberían haber terminado pero aún están activas
    const now = new Date().toISOString();
    const { data: overdueImmersions, error: fetchError } = await supabase
      .from('inmersion')
      .select('inmersion_id, estimated_end_time, actual_end_time, estado, supervisor_id, codigo')
      .eq('estado', 'en_progreso')
      .lt('estimated_end_time', now)
      .is('actual_end_time', null);

    if (fetchError) {
      console.error('❌ Error fetching overdue immersions:', fetchError);
      throw fetchError;
    }

    console.log(`📋 Found ${overdueImmersions?.length || 0} overdue immersions`);

    const results = [];

    for (const immersion of overdueImmersions || []) {
      console.log(`⏰ Processing overdue immersion: ${immersion.codigo}`);

      try {
        // Marcar inmersión como completada automáticamente
        const { error: updateError } = await supabase
          .from('inmersion')
          .update({
            estado: 'completada',
            actual_end_time: now,
            notification_status: {
              supervisor_notified: false,
              team_notified: false,
              completion_checked: true,
              auto_completed: true
            }
          })
          .eq('inmersion_id', immersion.inmersion_id);

        if (updateError) {
          console.error(`❌ Error updating immersion ${immersion.codigo}:`, updateError);
          continue;
        }

        // Crear notificación para el supervisor
        if (immersion.supervisor_id) {
          const { error: notificationError } = await supabase
            .from('notifications')
            .insert({
              user_id: immersion.supervisor_id,
              type: 'immersion_auto_completed',
              title: 'Inmersión Completada Automáticamente',
              message: `La inmersión ${immersion.codigo} ha sido marcada como completada automáticamente al superar el tiempo estimado. Por favor, complete su bitácora de supervisión.`,
              metadata: {
                inmersion_id: immersion.inmersion_id,
                inmersion_code: immersion.codigo,
                priority: 'high',
                link: '/bitacoras/supervisor',
                auto_completed: true
              }
            });

          if (notificationError) {
            console.error(`❌ Error creating notification for ${immersion.codigo}:`, notificationError);
          } else {
            console.log(`✅ Notification sent to supervisor for ${immersion.codigo}`);
          }
        }

        results.push({
          inmersion_id: immersion.inmersion_id,
          codigo: immersion.codigo,
          status: 'auto_completed',
          notification_sent: !!immersion.supervisor_id
        });

      } catch (error) {
        console.error(`❌ Error processing immersion ${immersion.codigo}:`, error);
        results.push({
          inmersion_id: immersion.inmersion_id,
          codigo: immersion.codigo,
          status: 'error',
          error: error.message
        });
      }
    }

    // También verificar inmersiones que han estado completadas por mucho tiempo sin bitácora
    const { data: completedWithoutLogbook, error: logbookError } = await supabase
      .from('inmersion')
      .select(`
        inmersion_id, 
        codigo, 
        supervisor_id, 
        actual_end_time,
        notification_status
      `)
      .eq('estado', 'completada')
      .not('supervisor_id', 'is', null)
      .lt('actual_end_time', new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()); // 2 horas

    if (!logbookError && completedWithoutLogbook) {
      for (const immersion of completedWithoutLogbook) {
        // Verificar si ya existe bitácora de supervisor
        const { data: existingLogbook } = await supabase
          .from('bitacora_supervisor')
          .select('bitacora_id')
          .eq('inmersion_id', immersion.inmersion_id)
          .single();

        // Verificar si ya se envió recordatorio
        const notificationStatus = immersion.notification_status || {};
        
        if (!existingLogbook && !notificationStatus.logbook_reminder_sent) {
          // Crear recordatorio para completar bitácora
          await supabase
            .from('notifications')
            .insert({
              user_id: immersion.supervisor_id,
              type: 'bitacora_reminder',
              title: 'Recordatorio: Bitácora Pendiente',
              message: `Recordatorio: La inmersión ${immersion.codigo} completada hace más de 2 horas requiere su bitácora de supervisión.`,
              metadata: {
                inmersion_id: immersion.inmersion_id,
                inmersion_code: immersion.codigo,
                priority: 'medium',
                link: '/bitacoras/supervisor',
                reminder: true
              }
            });

          // Marcar recordatorio como enviado
          await supabase
            .from('inmersion')
            .update({
              notification_status: {
                ...notificationStatus,
                logbook_reminder_sent: true
              }
            })
            .eq('inmersion_id', immersion.inmersion_id);

          console.log(`📝 Logbook reminder sent for ${immersion.codigo}`);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: results.length,
        results: results,
        timestamp: now
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error('❌ Error in check-immersion-status function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
