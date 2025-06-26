
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConfirmUserRequest {
  user_id: string;
  email: string;
  token: string;
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

    const { user_id, email, token }: ConfirmUserRequest = await req.json();

    console.log('Confirmando usuario invitado:', { user_id, email });

    // Verificar que la invitación es válida
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from('usuario_invitaciones')
      .select('*')
      .eq('token', token)
      .eq('email', email)
      .eq('estado', 'pendiente')
      .gt('fecha_expiracion', new Date().toISOString())
      .single();

    if (invitationError || !invitation) {
      console.error('Invitación no válida:', invitationError);
      throw new Error('Invitación no válida o expirada');
    }

    // Confirmar el email del usuario automáticamente
    const { data: userData, error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
      user_id,
      {
        email_confirm: true,
        user_metadata: {
          confirmed_via_invitation: true,
          invitation_token: token
        }
      }
    );

    if (confirmError) {
      console.error('Error confirmando usuario:', confirmError);
      throw confirmError;
    }

    console.log('Usuario confirmado exitosamente:', userData.user?.id);

    return new Response(JSON.stringify({
      success: true,
      message: 'Usuario confirmado exitosamente',
      user_id: userData.user?.id
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error en confirm-invitation-user:", error);
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
