
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

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

    const emailResponse = await resend.emails.send({
      from: "Breus <noreply@breus.cl>",
      to: [email],
      subject: email_action_type === 'signup' ? "Confirma tu cuenta en Breus" : "Restablecer contraseña - Breus",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Breus - ${email_action_type === 'signup' ? 'Confirmación de Cuenta' : 'Restablecer Contraseña'}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
              <div style="background-color: white; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <div style="background-color: #1e40af; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px;">
                  B
                </div>
              </div>
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Breus</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Plataforma de Gestión de Buceo Profesional</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 20px; font-weight: 600;">
                ${email_action_type === 'signup' ? '¡Bienvenido a Breus!' : 'Restablecer tu contraseña'}
              </h2>
              
              <p style="color: #6b7280; margin: 0 0 24px 0; line-height: 1.6;">
                ${email_action_type === 'signup' 
                  ? 'Gracias por registrarte en nuestra plataforma. Para completar tu registro y acceder a todas las funcionalidades, necesitas confirmar tu dirección de email.'
                  : 'Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el botón de abajo para crear una nueva contraseña.'
                }
              </p>
              
              <!-- Action Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${confirmationUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  ${email_action_type === 'signup' ? 'Confirmar mi cuenta' : 'Restablecer contraseña'}
                </a>
              </div>
              
              <!-- Alternative Link -->
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 24px 0;">
                <p style="color: #6b7280; margin: 0 0 8px 0; font-size: 14px;">
                  Si el botón no funciona, copia y pega este enlace en tu navegador:
                </p>
                <p style="color: #3b82f6; margin: 0; font-size: 12px; word-break: break-all;">
                  ${confirmationUrl}
                </p>
              </div>
              
              <!-- Security Notice -->
              <div style="border-left: 4px solid #fbbf24; padding: 16px; background-color: #fffbeb; margin: 24px 0;">
                <p style="color: #92400e; margin: 0; font-size: 14px;">
                  <strong>Seguridad:</strong> Este enlace expirará en 24 horas por motivos de seguridad.
                  ${email_action_type !== 'signup' ? ' Si no solicitaste este cambio, puedes ignorar este email.' : ''}
                </p>
              </div>
              
              <p style="color: #6b7280; margin: 24px 0 0 0; font-size: 14px;">
                Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0; font-size: 12px;">
                © 2024 Breus. Plataforma de gestión de buceo profesional para la industria salmonicultora.
              </p>
              <p style="color: #9ca3af; margin: 8px 0 0 0; font-size: 11px;">
                Este email fue enviado a ${email}
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
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
