
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createBaseEmailTemplate } from "../_shared/email-templates/base-template.ts";
import { createButton, createInfoCard, createSection } from "../_shared/email-templates/components.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  email: string;
  admin_nombre: string;
  empresa_nombre: string;
  token: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, admin_nombre, empresa_nombre, token }: InvitationRequest = await req.json();

    const invitationUrl = `${req.headers.get('origin')}/auth/accept-invitation?token=${token}`;

    // Crear contenido del email
    const emailContent = `
      ${createSection(`¡Hola ${admin_nombre}!`, `
        Has sido invitado a ser el administrador de <strong>${empresa_nombre}</strong> en la plataforma Breus.
      `)}

      ${createInfoCard('Información de la invitación', `
        <strong>Empresa:</strong> ${empresa_nombre}<br>
        <strong>Rol:</strong> Administrador Principal<br>
        <strong>Email:</strong> ${email}
      `, 'info')}

      ${createSection('Beneficios de Breus', `
        <p>Breus te permitirá gestionar de forma digital todos los aspectos de las operaciones de buceo profesional de tu empresa:</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin: 20px 0;">
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <h4 style="color: #1e40af; margin: 0 0 8px 0; font-size: 16px;">📋 Documentación Digital</h4>
            <p style="color: #6b7280; margin: 0; font-size: 14px;">Formularios HPT y Anexo Bravo completamente digitalizados</p>
          </div>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
            <h4 style="color: #059669; margin: 0 0 8px 0; font-size: 16px;">🤿 Gestión de Inmersiones</h4>
            <p style="color: #6b7280; margin: 0; font-size: 14px;">Control completo de inmersiones y bitácoras</p>
          </div>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <h4 style="color: #d97706; margin: 0 0 8px 0; font-size: 16px;">📊 Reportes y Analytics</h4>
            <p style="color: #6b7280; margin: 0; font-size: 14px;">Trazabilidad completa y reportes automáticos</p>
          </div>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #8b5cf6;">
            <h4 style="color: #7c3aed; margin: 0 0 8px 0; font-size: 16px;">✅ Cumplimiento Normativo</h4>
            <p style="color: #6b7280; margin: 0; font-size: 14px;">Garantiza el cumplimiento de todas las regulaciones</p>
          </div>
        </div>
      `)}

      ${createButton('Crear mi cuenta en Breus', invitationUrl)}

      ${createInfoCard('Información importante', `
        Esta invitación es válida por <strong>7 días</strong>. Si no puedes acceder al enlace del botón, copia y pega la siguiente URL en tu navegador:<br><br>
        <code style="background: #f3f4f6; padding: 8px; border-radius: 4px; font-size: 12px; word-break: break-all;">${invitationUrl}</code>
      `, 'warning')}

      ${createSection('¿Necesitas ayuda?', `
        Si tienes alguna pregunta sobre esta invitación o necesitas asistencia técnica, nuestro equipo está aquí para ayudarte en <a href="mailto:soporte@breus.cl" style="color: #3b82f6;">soporte@breus.cl</a>
      `)}
    `;

    const html = createBaseEmailTemplate({
      title: `Invitación para administrar ${empresa_nombre} en Breus`,
      previewText: `Únete a Breus como administrador de ${empresa_nombre} y digitaliza tus operaciones de buceo`,
      children: emailContent
    });

    const emailResponse = await resend.emails.send({
      from: "Breus Platform <invitaciones@breus.cl>",
      to: [email],
      subject: `Invitación para administrar ${empresa_nombre} en Breus`,
      html: html,
    });

    console.log("Invitation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contractor-invitation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
