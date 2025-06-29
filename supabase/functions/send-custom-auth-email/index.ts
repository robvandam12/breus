
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

interface AuthEmailRequest {
  email: string;
  token_hash: string;
  token: string;
  redirect_to: string;
  email_action_type: string;
  site_url: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      email, 
      token_hash, 
      token, 
      redirect_to, 
      email_action_type, 
      site_url 
    }: AuthEmailRequest = await req.json();

    const confirmationUrl = `${site_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;

    const isSignup = email_action_type === 'signup';
    const title = isSignup ? '¡Bienvenido a Breus!' : 'Restablecer tu contraseña';
    const actionText = isSignup ? 'Confirmar mi cuenta' : 'Restablecer contraseña';

    // Crear contenido del email
    const emailContent = `
      ${createSection(title, isSignup ? `
        Gracias por registrarte en nuestra plataforma. Para completar tu registro y acceder a todas las funcionalidades, necesitas confirmar tu dirección de email.
      ` : `
        Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el botón de abajo para crear una nueva contraseña.
      `)}

      ${createButton(actionText, confirmationUrl)}

      ${createInfoCard('Enlace alternativo', `
        Si el botón no funciona, copia y pega este enlace en tu navegador:<br><br>
        <code style="background: #f3f4f6; padding: 8px; border-radius: 4px; font-size: 12px; word-break: break-all;">${confirmationUrl}</code>
      `, 'info')}

      ${createInfoCard('Seguridad', `
        <strong>Este enlace expirará en 24 horas</strong> por motivos de seguridad.
        ${!isSignup ? ' Si no solicitaste este cambio, puedes ignorar este email de forma segura.' : ''}
      `, 'warning')}

      ${isSignup ? createSection('¿Qué puedes hacer con Breus?', `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 20px 0;">
          <div style="text-align: center; padding: 16px;">
            <div style="font-size: 32px; margin-bottom: 8px;">📋</div>
            <h4 style="color: #1f2937; margin: 0 0 8px 0;">Formularios Digitales</h4>
            <p style="color: #6b7280; margin: 0; font-size: 14px;">HPT y Anexo Bravo completamente digitalizados</p>
          </div>
          <div style="text-align: center; padding: 16px;">
            <div style="font-size: 32px; margin-bottom: 8px;">🤿</div>
            <h4 style="color: #1f2937; margin: 0 0 8px 0;">Gestión de Inmersiones</h4>
            <p style="color: #6b7280; margin: 0; font-size: 14px;">Control completo de todas las operaciones</p>
          </div>
          <div style="text-align: center; padding: 16px;">
            <div style="font-size: 32px; margin-bottom: 8px;">📊</div>
            <h4 style="color: #1f2937; margin: 0 0 8px 0;">Reportes Automáticos</h4>
            <p style="color: #6b7280; margin: 0; font-size: 14px;">Analytics y trazabilidad completa</p>
          </div>
        </div>
      `) : ''}

      ${createSection('¿Necesitas ayuda?', `
        Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos en <a href="mailto:soporte@breus.cl" style="color: #3b82f6;">soporte@breus.cl</a>
      `)}
    `;

    const html = createBaseEmailTemplate({
      title: isSignup ? "Confirma tu cuenta en Breus" : "Restablecer contraseña - Breus",
      previewText: isSignup ? "Confirma tu email para completar tu registro en Breus" : "Restablece tu contraseña de Breus",
      children: emailContent
    });

    const emailResponse = await resend.emails.send({
      from: "Breus <noreply@breus.cl>",
      to: [email],
      subject: isSignup ? "Confirma tu cuenta en Breus" : "Restablecer contraseña - Breus",
      html: html,
    });

    console.log("Custom auth email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-custom-auth-email function:", error);
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
