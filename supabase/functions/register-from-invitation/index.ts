
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RegisterFromInvitationRequest {
  token: string;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Crear cliente de Supabase con permisos de administrador
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { token, email, password, nombre, apellido }: RegisterFromInvitationRequest = await req.json();

    console.log('Registrando usuario desde invitación:', { email, token });

    // Verificar que la invitación es válida
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from('usuario_invitaciones')
      .select('*')
      .eq('token', token)
      .eq('email', email.toLowerCase())
      .eq('estado', 'pendiente')
      .gt('fecha_expiracion', new Date().toISOString())
      .single();

    if (invitationError || !invitation) {
      console.error('Invitación no válida:', invitationError);
      throw new Error('Invitación no válida o expirada');
    }

    console.log('Invitación válida encontrada:', invitation);

    // Crear usuario en auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase(),
      password: password,
      email_confirm: true, // Confirmar email automáticamente
      user_metadata: {
        nombre: nombre,
        apellido: apellido,
        invited_via_token: token
      }
    });

    if (authError) {
      console.error('Error creando usuario en auth:', authError);
      throw authError;
    }

    console.log('Usuario creado en auth:', authData.user?.id);

    // Crear perfil en tabla usuario con empresa asociada
    const userProfileData = {
      usuario_id: authData.user!.id,
      email: email.toLowerCase(),
      nombre: nombre,
      apellido: apellido,
      rol: invitation.rol,
      perfil_completado: true,
      salmonera_id: invitation.tipo_empresa === 'salmonera' ? invitation.empresa_id : null,
      servicio_id: invitation.tipo_empresa === 'contratista' ? invitation.empresa_id : null
    };

    console.log('Creando perfil con datos:', userProfileData);

    const { error: profileError } = await supabaseAdmin
      .from('usuario')
      .insert([userProfileData]);

    if (profileError) {
      console.error('Error creando perfil:', profileError);
      // Si falla la creación del perfil, eliminar el usuario de auth
      await supabaseAdmin.auth.admin.deleteUser(authData.user!.id);
      throw profileError;
    }

    // Marcar invitación como aceptada
    const { error: updateInvitationError } = await supabaseAdmin
      .from('usuario_invitaciones')
      .update({ 
        estado: 'aceptada',
        updated_at: new Date().toISOString()
      })
      .eq('id', invitation.id);

    if (updateInvitationError) {
      console.error('Error actualizando invitación:', updateInvitationError);
    }

    console.log('Usuario registrado exitosamente desde invitación');

    return new Response(JSON.stringify({
      success: true,
      message: 'Usuario registrado exitosamente',
      user_id: authData.user?.id,
      empresa_asociada: {
        tipo: invitation.tipo_empresa,
        id: invitation.empresa_id
      }
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error en register-from-invitation:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Error interno del servidor'
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
