
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface UserInvitationRequest {
  email: string;
  rol: string;
  invitedBy: string;
  token: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, rol, invitedBy, token }: UserInvitationRequest = await req.json();

    const invitationUrl = `${req.headers.get('origin')}/auth/register?token=${token}`;

    const getRoleDisplayName = (role: string) => {
      switch (role) {
        case 'admin_salmonera':
          return 'Administrador de Salmonera';
        case 'admin_servicio':
          return 'Administrador de Servicio';
        case 'supervisor':
          return 'Supervisor';
        case 'buzo':
          return 'Buzo';
        default:
          return role;
      }
    };

    const emailResponse = await resend.emails.send({
      from: "Breus Platform <invitaciones@breus.cl>",
      to: [email],
      subject: `Invitación para unirte a Breus como ${getRoleDisplayName(rol)}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 16px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Breus</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Plataforma de Gestión de Buceo Profesional</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">¡Hola!</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              <strong>${invitedBy}</strong> te ha invitado a unirte a la plataforma Breus con el rol de <strong>${getRoleDisplayName(rol)}</strong>.
            </p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
              Breus te permitirá gestionar de forma digital todos los aspectos de las operaciones de buceo profesional, incluyendo:
            </p>
            <ul style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0; padding-left: 20px;">
              <li>Gestión de inmersiones y bitácoras</li>
              <li>Formularios HPT y Anexo Bravo</li>
              <li>Control de cumplimiento normativo</li>
              <li>Reportes y trazabilidad completa</li>
              <li>Seguimiento de personal de buceo</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${invitationUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      text-decoration: none; 
                      padding: 16px 32px; 
                      border-radius: 12px; 
                      font-weight: 600; 
                      font-size: 16px; 
                      display: inline-block;
                      box-shadow: 0 4px 14px 0 rgba(102, 126, 234, 0.39);">
              Crear mi cuenta en Breus
            </a>
          </div>
          
          <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <p style="color: #92400e; font-size: 14px; margin: 0; font-weight: 500;">
              ⚠️ Esta invitación es válida por 7 días. Si no puedes acceder al enlace, copia y pega la siguiente URL en tu navegador:
            </p>
            <p style="color: #92400e; font-size: 12px; margin: 10px 0 0 0; word-break: break-all;">
              ${invitationUrl}
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Este correo fue enviado por Breus Platform<br>
              Si tienes problemas, contacta a soporte@breus.cl
            </p>
          </div>
        </div>
      `,
    });

    console.log("User invitation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-user-invitation function:", error);
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
