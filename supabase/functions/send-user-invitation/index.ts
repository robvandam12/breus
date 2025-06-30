
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

    const { email, nombre = '', apellido = '', rol, empresa_id, tipo_empresa, invitado_por }: InvitationRequest = await req.json();

    console.log('Sending invitation to:', email, 'Role:', rol, 'Invited by:', invitado_por);

    // Obtener información del usuario que invita
    const { data: inviterUser, error: inviterError } = await supabaseAdmin
      .from('usuario')
      .select('nombre, apellido')
      .eq('usuario_id', invitado_por)
      .single();

    if (inviterError) {
      console.error('Error fetching inviter user:', inviterError);
    }

    const inviterName = inviterUser 
      ? `${inviterUser.nombre} ${inviterUser.apellido}`.trim()
      : 'Sistema';

    // Obtener nombre de la empresa
    const empresaTable = tipo_empresa === 'salmonera' ? 'salmoneras' : 'contratistas';
    const { data: empresaData } = await supabaseAdmin
      .from(empresaTable)
      .select('nombre')
      .eq('id', empresa_id)
      .single();

    const empresaNombre = empresaData?.nombre || 'Empresa';

    // Generar token único
    const token = crypto.randomUUID();
    const fechaExpiracion = new Date();
    fechaExpiracion.setDate(fechaExpiracion.getDate() + 7);

    // Crear invitación en la base de datos
    const { data: invitation, error: dbError } = await supabaseAdmin
      .from('usuario_invitaciones')
      .insert([{
        email: email.toLowerCase(),
        nombre: nombre || '',
        apellido: apellido || '',
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
      throw new Error(`Error creando invitación: ${dbError.message}`);
    }

    // Crear el enlace de invitación usando la URL correcta
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || '';
    const baseUrl = supabaseUrl.replace('.supabase.co', '.lovable.app') || 'https://preview--breus-91.lovable.app';
    const invitationUrl = `${baseUrl}/register-invitation?token=${token}`;

    // Mapear roles a nombres amigables
    const roleNames: Record<string, string> = {
      'admin_salmonera': 'Administrador de Salmonera',
      'admin_servicio': 'Administrador de Servicio',
      'supervisor': 'Supervisor',
      'buzo': 'Buzo'
    };

    const roleName = roleNames[rol] || rol;
    const tipoEmpresaName = tipo_empresa === 'salmonera' ? 'Salmonera' : 'Empresa de Servicio';

    // Verificar si hay API key de Resend configurada
    const resendKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendKey) {
      console.log('RESEND_API_KEY not configured, invitation created but email not sent');
      
      return new Response(JSON.stringify({
        success: false,
        message: 'Invitación creada pero no se pudo enviar el email: RESEND_API_KEY no configurada',
        invitation_id: invitation.id,
        expires_at: fechaExpiracion.toISOString(),
        invitation_url: invitationUrl,
        error: 'RESEND_API_KEY no configurada'
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    // Crear contenido del email usando estructura simple
    const emailHtml = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h1 style="color: #2563eb;">¡Hola ${nombre || 'Usuario'}!</h1>
        <p>Has sido invitado/a por <strong>${inviterName}</strong> a unirte a Breus como <strong>${roleName}</strong> en <strong>${empresaNombre}</strong>.</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e40af;">Información de la invitación</h3>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Rol:</strong> ${roleName}</p>
          <p><strong>Empresa:</strong> ${empresaNombre} (${tipoEmpresaName})</p>
          <p><strong>Invitado por:</strong> ${inviterName}</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${invitationUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Completar mi Registro
          </a>
        </div>

        <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;">
            Esta invitación expirará el <strong>${fechaExpiracion.toLocaleDateString('es-ES')}</strong>.
          </p>
        </div>

        <p style="color: #6b7280; font-size: 14px;">
          Si tienes alguna pregunta, contacta a <a href="mailto:soporte@breus.cl">soporte@breus.cl</a>
        </p>
      </div>
    `;

    // Intentar enviar email usando Resend
    try {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Breus <onboarding@resend.dev>',
          to: [email],
          subject: `Invitación a Breus - ${roleName} en ${empresaNombre}`,
          html: emailHtml,
        }),
      });

      if (!resendResponse.ok) {
        const errorData = await resendResponse.text();
        console.error('Resend API error:', errorData);
        
        // Marcar invitación como fallida
        await supabaseAdmin
          .from('usuario_invitaciones')
          .update({ 
            estado: 'error_envio',
            updated_at: new Date().toISOString()
          })
          .eq('id', invitation.id);
        
        return new Response(JSON.stringify({
          success: false,
          message: 'Error enviando invitación por email',
          invitation_id: invitation.id,
          expires_at: fechaExpiracion.toISOString(),
          email_error: errorData,
          invitation_url: invitationUrl,
          error: `Error de Resend: ${errorData}`
        }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      }

      const emailResult = await resendResponse.json();
      console.log('Email sent successfully via Resend:', emailResult);

      return new Response(JSON.stringify({
        success: true,
        message: 'Invitación enviada exitosamente',
        invitation_id: invitation.id,
        expires_at: fechaExpiracion.toISOString(),
        email_id: emailResult.id
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });

    } catch (emailError: any) {
      console.error('Error sending email:', emailError);
      
      // Marcar invitación como fallida
      await supabaseAdmin
        .from('usuario_invitaciones')
        .update({ 
          estado: 'error_envio',
          updated_at: new Date().toISOString()
        })
        .eq('id', invitation.id);
      
      return new Response(JSON.stringify({
        success: false,
        message: 'Error enviando invitación por email',
        invitation_id: invitation.id,
        expires_at: fechaExpiracion.toISOString(),
        email_error: emailError.message,
        invitation_url: invitationUrl,
        error: `Error enviando email: ${emailError.message}`
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

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
