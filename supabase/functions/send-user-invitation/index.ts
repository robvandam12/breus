
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  email: string;
  nombre?: string;
  apellido?: string;
  rol: string;
  empresa_id: string;
  tipo_empresa: 'salmonera' | 'contratista';
  invitado_por: string;
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

    const { email, nombre, apellido, rol, empresa_id, tipo_empresa, invitado_por }: InvitationRequest = await req.json();

    console.log('Sending invitation to:', email, 'Role:', rol, 'Invited by:', invitado_por);

    // Generar token único
    const token = crypto.randomUUID();
    const fechaExpiracion = new Date();
    fechaExpiracion.setDate(fechaExpiracion.getDate() + 7); // Expira en 7 días

    // Crear invitación en la base de datos
    const { data: invitation, error: dbError } = await supabaseAdmin
      .from('usuario_invitaciones')
      .insert([{
        email: email.toLowerCase(),
        nombre,
        apellido,
        rol,
        empresa_id,
        tipo_empresa,
        token,
        invitado_por,
        fecha_expiracion: fechaExpiracion.toISOString(),
        estado: 'pendiente'
      }])
      .select()
      .single();

    if (dbError) {
      console.error('Error creating invitation:', dbError);
      throw dbError;
    }

    // Crear el enlace de invitación (corregido)
    const invitationUrl = `${Deno.env.get("SUPABASE_URL")?.replace('.supabase.co', '.lovable.app') || 'https://preview--breus-91.lovable.app'}/register-invitation?token=${token}`;

    // Enviar email usando Supabase
    const emailData = {
      to: [email],
      subject: 'Invitación a Breus - Sistema de Gestión de Buceo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Invitación a Breus</h2>
          <p>Hola ${nombre || 'Usuario'},</p>
          <p>Has sido invitado/a por <strong>${invitado_por}</strong> a unirte a Breus como <strong>${rol.replace('_', ' ').toUpperCase()}</strong>.</p>
          <p>Para completar tu registro, haz clic en el siguiente enlace:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${invitationUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Completar Registro
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Este enlace expirará en 7 días. Si no puedes hacer clic en el enlace, copia y pega la siguiente URL en tu navegador:
          </p>
          <p style="color: #666; font-size: 14px; word-break: break-all;">
            ${invitationUrl}
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Si no esperabas esta invitación, puedes ignorar este email.
          </p>
        </div>
      `
    };

    // Enviar email
    const { data, error } = await supabaseAdmin.functions.invoke('resend', {
      body: emailData
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    console.log('User invitation email sent successfully:', { data, error });

    return new Response(JSON.stringify({
      success: true,
      message: 'Invitación enviada exitosamente',
      invitation_id: invitation.id,
      expires_at: fechaExpiracion.toISOString()
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error en send-user-invitation:", error);
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
