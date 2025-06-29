
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createBaseEmailTemplate } from "../_shared/email-templates/base-template.ts";
import { createButton, createInfoCard, createSection } from "../_shared/email-templates/components.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  template_type: 'welcome' | 'password_reset' | 'contractor_invitation';
  data: Record<string, any>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const sendgridApiKey = Deno.env.get("SENDGRID_API_KEY");
    const fromEmail = Deno.env.get("SENDGRID_FROM_EMAIL");

    if (!sendgridApiKey || !fromEmail) {
      throw new Error("SendGrid configuration missing");
    }

    const { to, template_type, data }: EmailRequest = await req.json();

    let subject = "";
    let emailContent = "";
    let previewText = "";

    switch (template_type) {
      case 'welcome':
        subject = "Bienvenido a Breus - Confirma tu cuenta";
        previewText = `¡Hola ${data.nombre}! Bienvenido a Breus, confirma tu cuenta para comenzar`;
        emailContent = `
          ${createSection(`¡Hola ${data.nombre}!`, `
            Gracias por registrarte en Breus, la plataforma de gestión profesional de buceo para la industria salmonicultora.
          `)}

          ${createSection('Para completar tu registro', `
            Para acceder a todas las funcionalidades de la plataforma, por favor confirma tu dirección de email haciendo clic en el enlace a continuación:
          `)}

          ${createButton('Confirmar Email', data.confirmation_url)}

          ${createInfoCard('Enlace alternativo', `
            Si el botón no funciona, copia y pega este enlace en tu navegador:<br><br>
            <code style="background: #f3f4f6; padding: 8px; border-radius: 4px; font-size: 12px; word-break: break-all;">${data.confirmation_url}</code>
          `, 'info')}

          ${createSection('¿Qué puedes hacer con Breus?', `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 20px 0;">
              <div style="text-align: center; padding: 16px; background: #f8fafc; border-radius: 8px;">
                <div style="font-size: 32px; margin-bottom: 8px;">📋</div>
                <h4 style="color: #1f2937; margin: 0 0 8px 0;">Formularios Digitales</h4>
                <p style="color: #6b7280; margin: 0; font-size: 14px;">Gestión completa de HPT y Anexo Bravo</p>
              </div>
              <div style="text-align: center; padding: 16px; background: #f8fafc; border-radius: 8px;">
                <div style="font-size: 32px; margin-bottom: 8px;">🤿</div>
                <h4 style="color: #1f2937; margin: 0 0 8px 0;">Control de Inmersiones</h4>
                <p style="color: #6b7280; margin: 0; font-size: 14px;">Monitoreo y gestión en tiempo real</p>
              </div>
              <div style="text-align: center; padding: 16px; background: #f8fafc; border-radius: 8px;">
                <div style="font-size: 32px; margin-bottom: 8px;">📊</div>
                <h4 style="color: #1f2937; margin: 0 0 8px 0;">Reportes y Analytics</h4>
                <p style="color: #6b7280; margin: 0; font-size: 14px;">Trazabilidad y cumplimiento normativo</p>
              </div>
            </div>
          `)}

          ${createInfoCard('Información importante', `
            Si no creaste esta cuenta, puedes ignorar este email de forma segura.
          `, 'info')}
        `;
        break;

      case 'password_reset':
        subject = "Breus - Recuperar Contraseña";
        previewText = "Restablece tu contraseña de Breus de forma segura";
        emailContent = `
          ${createSection('Recuperar Contraseña', `
            Recibimos una solicitud para restablecer la contraseña de tu cuenta en Breus.
          `)}

          ${createSection('Restablecer tu contraseña', `
            Haz clic en el enlace a continuación para crear una nueva contraseña segura:
          `)}

          ${createButton('Restablecer Contraseña', data.reset_url)}

          ${createInfoCard('Enlace alternativo', `
            Si el botón no funciona, copia y pega este enlace en tu navegador:<br><br>
            <code style="background: #f3f4f6; padding: 8px; border-radius: 4px; font-size: 12px; word-break: break-all;">${data.reset_url}</code>
          `, 'info')}

          ${createInfoCard('Seguridad', `
            <strong>Este enlace expira en 1 hora</strong> por motivos de seguridad. Si no solicitaste este cambio, puedes ignorar este email de forma segura.
          `, 'warning')}
        `;
        break;

      case 'contractor_invitation':
        subject = "Invitación a Breus - Empresa de Servicios";
        previewText = `${data.admin_nombre}, has sido invitado a unirte a Breus como administrador de ${data.empresa_nombre}`;
        emailContent = `
          ${createSection(`¡Hola ${data.admin_nombre}!`, `
            Has sido invitado a unirte a Breus como administrador de <strong>${data.empresa_nombre}</strong>.
          `)}

          ${createSection('Breus - Tu solución integral', `
            Breus es la plataforma líder en gestión profesional de buceo para la industria salmonicultora, que te permitirá digitalizar y optimizar todos tus procesos de buceo.
          `)}

          ${createButton('Aceptar Invitación', data.invitation_url)}

          ${createSection('Beneficios de Breus', `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin: 20px 0;">
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <h4 style="color: #1e40af; margin: 0 0 8px 0;">📋 Formularios HPT y Anexo Bravo digitales</h4>
                <p style="color: #6b7280; margin: 0; font-size: 14px;">Eliminación completa del papel</p>
              </div>
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
                <h4 style="color: #059669; margin: 0 0 8px 0;">🤿 Gestión completa de inmersiones y bitácoras</h4>
                <p style="color: #6b7280; margin: 0; font-size: 14px;">Control total en tiempo real</p>
              </div>
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <h4 style="color: #d97706; margin: 0 0 8px 0;">📊 Trazabilidad y cumplimiento normativo</h4>
                <p style="color: #6b7280; margin: 0; font-size: 14px;">Garantiza el cumplimiento total</p>
              </div>
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #8b5cf6;">
                <h4 style="color: #7c3aed; margin: 0 0 8px 0;">📈 Reportes automáticos y dashboard en tiempo real</h4>
                <p style="color: #6b7280; margin: 0; font-size: 14px;">Analytics avanzados</p>
              </div>
            </div>
          `)}

          ${createInfoCard('Información importante', `
            Esta invitación expira en <strong>7 días</strong>. Si tienes alguna pregunta, contacta con el equipo de Breus.
          `, 'warning')}
        `;
        break;
    }

    const html = createBaseEmailTemplate({
      title: subject,
      previewText: previewText,
      children: emailContent
    });

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }],
            subject: subject,
          },
        ],
        from: { email: fromEmail, name: 'Breus' },
        content: [
          {
            type: 'text/html',
            value: html,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`SendGrid error: ${error}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
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
