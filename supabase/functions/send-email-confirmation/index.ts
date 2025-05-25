
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    let html = "";

    switch (template_type) {
      case 'welcome':
        subject = "Bienvenido a Breus - Confirma tu cuenta";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">¡Bienvenido a Breus!</h1>
            </div>
            <div style="padding: 40px 20px; background: #ffffff;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Hola ${data.nombre},</h2>
              <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                Gracias por registrarte en Breus, la plataforma de gestión profesional de buceo para la industria salmonicultora.
              </p>
              <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
                Para completar tu registro y acceder a todas las funcionalidades, por favor confirma tu dirección de email haciendo clic en el enlace a continuación:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.confirmation_url}" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Confirmar Email
                </a>
              </div>
              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                Si no creaste esta cuenta, puedes ignorar este email de forma segura.
              </p>
            </div>
            <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
              © 2024 Breus. Todos los derechos reservados.
            </div>
          </div>
        `;
        break;

      case 'password_reset':
        subject = "Breus - Recuperar Contraseña";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Recuperar Contraseña</h1>
            </div>
            <div style="padding: 40px 20px; background: #ffffff;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Hola,</h2>
              <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta en Breus.
              </p>
              <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
                Haz clic en el enlace a continuación para crear una nueva contraseña:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.reset_url}" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Restablecer Contraseña
                </a>
              </div>
              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                Este enlace expira en 1 hora. Si no solicitaste este cambio, puedes ignorar este email de forma segura.
              </p>
            </div>
            <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
              © 2024 Breus. Todos los derechos reservados.
            </div>
          </div>
        `;
        break;

      case 'contractor_invitation':
        subject = "Invitación a Breus - Empresa de Servicios";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Invitación a Breus</h1>
            </div>
            <div style="padding: 40px 20px; background: #ffffff;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Hola ${data.admin_nombre},</h2>
              <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                Has sido invitado a unirte a Breus como administrador de <strong>${data.empresa_nombre}</strong>.
              </p>
              <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
                Breus es la plataforma líder en gestión profesional de buceo para la industria salmonicultora, que te permitirá digitalizar y optimizar todos tus procesos de buceo.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.invitation_url}" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Aceptar Invitación
                </a>
              </div>
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #374151; margin-top: 0;">Beneficios de Breus:</h3>
                <ul style="color: #4b5563; line-height: 1.6;">
                  <li>Formularios HPT y Anexo Bravo digitales</li>
                  <li>Gestión completa de inmersiones y bitácoras</li>
                  <li>Trazabilidad y cumplimiento normativo</li>
                  <li>Reportes automáticos y dashboard en tiempo real</li>
                </ul>
              </div>
              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                Esta invitación expira en 7 días. Si tienes alguna pregunta, contacta con el equipo de Breus.
              </p>
            </div>
            <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
              © 2024 Breus. Todos los derechos reservados.
            </div>
          </div>
        `;
        break;
    }

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
