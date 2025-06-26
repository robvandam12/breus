
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  type: 'inmersion_created' | 'inmersion_completed' | 'bitacora_supervisor_completed';
  inmersion_id: string;
  user_id?: string;
  metadata?: Record<string, any>;
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
    const { type, inmersion_id, user_id, metadata }: NotificationRequest = await req.json();

    console.log(`📧 Processing notification: ${type} for immersion ${inmersion_id}`);

    // Obtener datos de la inmersión
    const { data: immersion, error: immersionError } = await supabase
      .from('inmersion')
      .select(`
        inmersion_id,
        codigo,
        fecha_inmersion,
        supervisor,
        supervisor_id,
        buzo_principal,
        buzo_principal_id,
        estado,
        notification_status
      `)
      .eq('inmersion_id', inmersion_id)
      .single();

    if (immersionError || !immersion) {
      throw new Error(`Immersion not found: ${inmersionError?.message}`);
    }

    let notificationsSent = 0;

    switch (type) {
      case 'inmersion_created':
        // Notificar al supervisor
        if (immersion.supervisor_id) {
          const { error } = await supabase
            .from('notifications')
            .insert({
              user_id: immersion.supervisor_id,
              type: 'inmersion_assignment',
              title: 'Nueva Inmersión Asignada',
              message: `Se te ha asignado como supervisor de la inmersión ${immersion.codigo} programada para ${immersion.fecha_inmersion}`,
              metadata: {
                inmersion_id: immersion.inmersion_id,
                inmersion_code: immersion.codigo,
                date: immersion.fecha_inmersion,
                link: '/inmersiones',
                ...metadata
              }
            });

          if (!error) {
            notificationsSent++;
            console.log(`✅ Supervisor notification sent for ${immersion.codigo}`);
          }
        }
        break;

      case 'inmersion_completed':
        // Notificar al supervisor para completar bitácora
        if (immersion.supervisor_id) {
          // Verificar si ya existe bitácora
          const { data: existingLogbook } = await supabase
            .from('bitacora_supervisor')
            .select('bitacora_id')
            .eq('inmersion_id', inmersion_id)
            .single();

          if (!existingLogbook) {
            const { error } = await supabase
              .from('notifications')
              .insert({
                user_id: immersion.supervisor_id,
                type: 'bitacora_supervisor_pending',
                title: 'Bitácora de Supervisor Pendiente',
                message: `La inmersión ${immersion.codigo} ha finalizado. Por favor, complete su bitácora de supervisión.`,
                metadata: {
                  inmersion_id: immersion.inmersion_id,
                  inmersion_code: immersion.codigo,
                  priority: 'high',
                  link: '/bitacoras/supervisor',
                  ...metadata
                }
              });

            if (!error) {
              notificationsSent++;
              console.log(`✅ Supervisor logbook notification sent for ${immersion.codigo}`);
            }
          }
        }
        break;

      case 'bitacora_supervisor_completed':
        // Notificar a todos los buzos del equipo
        const { data: teamMembers, error: teamError } = await supabase
          .from('inmersion_team_members')
          .select(`
            user_id,
            role,
            is_emergency,
            usuario:user_id (
              nombre,
              apellido
            )
          `)
          .eq('inmersion_id', inmersion_id)
          .eq('is_emergency', false)
          .in('role', ['buzo_principal', 'buzo_asistente']);

        if (!teamError && teamMembers) {
          for (const member of teamMembers) {
            const { error } = await supabase
              .from('notifications')
              .insert({
                user_id: member.user_id,
                type: 'bitacora_buzo_ready',
                title: 'Complete su Bitácora de Buzo',
                message: `El supervisor ha completado la bitácora para la inmersión ${immersion.codigo}. Ahora puede completar su bitácora individual.`,
                metadata: {
                  inmersion_id: inmersion.inmersion_id,
                  inmersion_code: inmersion.codigo,
                  role: member.role,
                  link: '/bitacoras/buzo',
                  ...metadata
                }
              });

            if (!error) {
              notificationsSent++;
              console.log(`✅ Diver notification sent to ${member.usuario?.nombre} for ${immersion.codigo}`);
            }
          }

          // Marcar equipo como notificado
          await supabase
            .from('inmersion')
            .update({
              notification_status: {
                ...immersion.notification_status,
                team_notified: true,
                team_notification_sent_at: new Date().toISOString()
              }
            })
            .eq('inmersion_id', inmersion_id);
        }
        break;

      default:
        throw new Error(`Unknown notification type: ${type}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        notifications_sent: notificationsSent,
        inmersion_code: immersion.codigo,
        type: type
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
    console.error('❌ Error in send-immersion-notifications function:', error);
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
