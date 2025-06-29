
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
import { createBaseEmailTemplate } from "../_shared/email-templates/base-template.ts";
import { createButton, createInfoCard, createSection } from "../_shared/email-templates/components.ts";

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
      throw dbError;
    }

    // Crear el enlace de invitación
    const baseUrl = Deno.env.get("SUPABASE_URL")?.replace('.supabase.co', '.lovable.app') || 'https://preview--breus-91.lovable.app';
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

    // Crear contenido del email
    const emailContent = `
      ${createSection('¡Hola ' + (nombre || 'Usuario') + '!', `
        Has sido invitado/a por <strong>${inviterName}</strong> a unirte a Breus como <strong>${roleName}</strong> en <strong>${empresaNombre}</strong>.
      `)}

      ${createInfoCard('Información de la invitación', `
        <strong>Email:</strong> ${email}<br>
        <strong>Rol:</strong> ${roleName}<br>
        <strong>Empresa:</strong> ${empresaNombre} (${tipoEmpresaName})<br>
        <strong>Invitado por:</strong> ${inviterName}
      `, 'info')}

      ${createSection('¿Qué es Breus?', `
        <p>Breus es la plataforma líder en gestión profesional de buceo para la industria salmonicultora. Con Breus podrás:</p>
        <ul style="margin: 16px 0; padding-left: 20px; color: #4b5563;">
          <li>Gestionar formularios HPT y Anexo Bravo digitalmente</li>
          <li>Controlar inmersiones y bitácoras en tiempo real</li>
          <li>Mantener trazabilidad completa de operaciones</li>
          <li>Generar reportes automáticos y analíticas</li>
          <li>Garantizar cumplimiento normativo</li>
        </ul>
      `)}

      ${createButton('Completar mi Registro', invitationUrl)}

      ${createInfoCard('Información importante', `
        Esta invitación expirará el <strong>${fechaExpiracion.toLocaleDateString('es-ES')}</strong>. 
        Si no puedes hacer clic en el botón, copia y pega el siguiente enlace en tu navegador:<br><br>
        <code style="background: #f3f4f6; padding: 8px; border-radius: 4px; font-size: 12px; word-break: break-all;">${invitationUrl}</code>
      `, 'warning')}

      ${createSection('¿Necesitas ayuda?', `
        Si tienes alguna pregunta sobre esta invitación o necesitas asistencia, no dudes en contactarnos en <a href="mailto:soporte@breus.cl" style="color: #3b82f6;">soporte@breus.cl</a>
      `)}
    `;

    const html = createBaseEmailTemplate({
      title: 'Invitación a Breus - Sistema de Gestión de Buceo',
      previewText: `${inviterName} te ha invitado a unirte a Breus como ${roleName}`,
      children: emailContent
    });

    // Enviar email usando Resend
    const emailData = {
      to: [email],
      subject: `Invitación a Breus - ${roleName} en ${empresaNombre}`,
      html: html
    };

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
