
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

interface NotificationRequest {
  type: 'inmersion_created' | 'inmersion_completed' | 'bitacora_supervisor_completed' | 'check_overdue';
  inmersion_id?: string;
  bitacora_id?: string;
  manual_trigger?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, inmersion_id, bitacora_id, manual_trigger }: NotificationRequest = await req.json();
    
    console.log(`📩 Procesando notificación tipo: ${type}`);

    let result = {};

    switch (type) {
      case 'inmersion_created':
        result = await handleInmersionCreated(inmersion_id!);
        break;
        
      case 'inmersion_completed':
        result = await handleInmersionCompleted(inmersion_id!);
        break;
        
      case 'bitacora_supervisor_completed':
        result = await handleBitacoraSupervisorCompleted(bitacora_id!);
        break;
        
      case 'check_overdue':
        result = await handleCheckOverdue();
        break;
        
      default:
        throw new Error(`Tipo de notificación no soportado: ${type}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        type,
        result,
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
    console.error('❌ Error procesando notificación:', error);
    
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

async function handleInmersionCreated(inmersionId: string) {
  console.log(`🎯 Procesando creación de inmersión: ${inmersionId}`);
  
  // Obtener datos de la inmersión
  const { data: inmersion, error } = await supabase
    .from('inmersion')
    .select(`
      inmersion_id,
      codigo,
      fecha_inmersion,
      supervisor,
      supervisor_id
    `)
    .eq('inmersion_id', inmersionId)
    .single();

  if (error || !inmersion) {
    throw new Error(`No se encontró la inmersión: ${inmersionId}`);
  }

  // Si ya tiene supervisor_id, usar ese. Si no, buscar por nombre
  let supervisorUserId = inmersion.supervisor_id;
  
  if (!supervisorUserId && inmersion.supervisor) {
    const { data: supervisor } = await supabase
      .from('usuario')
      .select('usuario_id')
      .eq('nombre', inmersion.supervisor)
      .single();
    
    supervisorUserId = supervisor?.usuario_id;
  }

  if (supervisorUserId) {
    const { error: notificationError } = await supabase
      .rpc('create_workflow_notification', {
        p_user_id: supervisorUserId,
        p_type: 'inmersion_assignment',
        p_title: 'Nueva Inmersión Asignada',
        p_message: `Se le ha asignado como supervisor de la inmersión ${inmersion.codigo} programada para ${inmersion.fecha_inmersion}`,
        p_metadata: {
          inmersion_id: inmersionId,
          inmersion_code: inmersion.codigo,
          date: inmersion.fecha_inmersion,
          link: '/inmersiones'
        }
      });

    if (notificationError) {
      console.error('Error creando notificación:', notificationError);
      throw notificationError;
    }

    console.log(`✅ Notificación enviada al supervisor para inmersión ${inmersion.codigo}`);
    return { supervisor_notified: true, supervisor_id: supervisorUserId };
  }

  console.log(`⚠️ No se encontró supervisor para inmersión ${inmersion.codigo}`);
  return { supervisor_notified: false };
}

async function handleInmersionCompleted(inmersionId: string) {
  console.log(`🏁 Procesando finalización de inmersión: ${inmersionId}`);
  
  // Verificar si ya existe bitácora de supervisor
  const { data: existingBitacora } = await supabase
    .from('bitacora_supervisor')
    .select('bitacora_id')
    .eq('inmersion_id', inmersionId)
    .single();

  if (existingBitacora) {
    console.log(`ℹ️ Ya existe bitácora de supervisor para inmersión ${inmersionId}`);
    return { bitacora_exists: true };
  }

  // Obtener datos de la inmersión
  const { data: inmersion, error } = await supabase
    .from('inmersion')
    .select(`
      inmersion_id,
      codigo,
      supervisor_id,
      supervisor
    `)
    .eq('inmersion_id', inmersionId)
    .single();

  if (error || !inmersion) {
    throw new Error(`No se encontró la inmersión: ${inmersionId}`);
  }

  let supervisorUserId = inmersion.supervisor_id;
  
  if (!supervisorUserId && inmersion.supervisor) {
    const { data: supervisor } = await supabase
      .from('usuario')
      .select('usuario_id')
      .eq('nombre', inmersion.supervisor)
      .single();
    
    supervisorUserId = supervisor?.usuario_id;
  }

  if (supervisorUserId) {
    const { error: notificationError } = await supabase
      .rpc('create_workflow_notification', {
        p_user_id: supervisorUserId,
        p_type: 'bitacora_supervisor_pending',
        p_title: 'Bitácora de Supervisor Pendiente',
        p_message: `La inmersión ${inmersion.codigo} ha finalizado. Por favor, complete su bitácora de supervisión.`,
        p_metadata: {
          inmersion_id: inmersionId,
          inmersion_code: inmersion.codigo,
          priority: 'high',
          link: '/bitacoras/supervisor'
        }
      });

    if (notificationError) {
      throw notificationError;
    }

    console.log(`✅ Notificación de bitácora pendiente enviada para inmersión ${inmersion.codigo}`);
    return { supervisor_notified: true };
  }

  return { supervisor_notified: false };
}

async function handleBitacoraSupervisorCompleted(bitacoraId: string) {
  console.log(`📝 Procesando finalización de bitácora supervisor: ${bitacoraId}`);
  
  // Obtener datos de la bitácora
  const { data: bitacora, error } = await supabase
    .from('bitacora_supervisor')
    .select(`
      bitacora_id,
      inmersion_id,
      codigo
    `)
    .eq('bitacora_id', bitacoraId)
    .single();

  if (error || !bitacora) {
    throw new Error(`No se encontró la bitácora: ${bitacoraId}`);
  }

  // Obtener miembros del equipo (excluir emergencia)
  const { data: teamMembers, error: teamError } = await supabase
    .from('inmersion_team_members')
    .select(`
      user_id,
      role,
      usuario:user_id (
        nombre,
        apellido
      )
    `)
    .eq('inmersion_id', bitacora.inmersion_id)
    .eq('is_emergency', false)
    .in('role', ['buzo_principal', 'buzo_asistente']);

  if (teamError) {
    throw teamError;
  }

  const notificationsCreated = [];

  // Crear notificaciones para cada miembro del equipo
  for (const member of teamMembers || []) {
    const { error: notificationError } = await supabase
      .rpc('create_workflow_notification', {
        p_user_id: member.user_id,
        p_type: 'bitacora_buzo_ready',
        p_title: 'Complete su Bitácora de Buzo',
        p_message: `El supervisor ha completado la bitácora para la inmersión ${bitacora.codigo}. Ahora puede completar su bitácora individual.`,
        p_metadata: {
          inmersion_id: bitacora.inmersion_id,
          inmersion_code: bitacora.codigo,
          role: member.role,
          link: '/bitacoras/buzo'
        }
      });

    if (!notificationError) {
      notificationsCreated.push({
        user_id: member.user_id,
        role: member.role,
        name: `${member.usuario?.nombre} ${member.usuario?.apellido}`
      });
    }
  }

  console.log(`✅ ${notificationsCreated.length} notificaciones enviadas al equipo para bitácora ${bitacora.codigo}`);
  return { 
    team_notified: true, 
    notifications_count: notificationsCreated.length,
    notifications: notificationsCreated 
  };
}

async function handleCheckOverdue() {
  console.log(`🕐 Verificando inmersiones vencidas...`);
  
  // Esta función se encarga de verificar inmersiones que deberían haber terminado
  // pero siguen en estado 'en_curso'
  const { data: overdueImmersions, error } = await supabase
    .from('inmersion')
    .select(`
      inmersion_id,
      codigo,
      estimated_end_time,
      supervisor_id,
      supervisor
    `)
    .eq('estado', 'en_curso')
    .lt('estimated_end_time', new Date().toISOString());

  if (error) {
    throw error;
  }

  const processedImmersions = [];

  for (const immersion of overdueImmersions || []) {
    // Marcar como completada automáticamente
    const { error: updateError } = await supabase
      .from('inmersion')
      .update({
        estado: 'completada',
        actual_end_time: new Date().toISOString()
      })
      .eq('inmersion_id', immersion.inmersion_id);

    if (!updateError) {
      // Notificar supervisor para completar bitácora
      await handleInmersionCompleted(immersion.inmersion_id);
      processedImmersions.push(immersion.codigo);
    }
  }

  console.log(`✅ Procesadas ${processedImmersions.length} inmersiones vencidas`);
  return { 
    overdue_processed: processedImmersions.length,
    immersions: processedImmersions 
  };
}
