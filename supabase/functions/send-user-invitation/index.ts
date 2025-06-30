
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
  empresa_id: string;
  tipo_empresa: 'salmonera' | 'contratista';
  invitado_por: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('send-user-invitation function called');
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verificar variables de entorno
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!resendApiKey) {
      console.error('RESEND_API_KEY not found');
      throw new Error('Configuración de email no disponible');
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase credentials not found');
      throw new Error('Configuración de base de datos no disponible');
    }

    const requestData: InvitationRequest = await req.json();
    console.log('Invitation request data:', { 
      email: requestData.email, 
      rol: requestData.rol,
      tipo_empresa: requestData.tipo_empresa 
    });

    // Validar datos requeridos
    if (!requestData.email || !requestData.rol || !requestData.empresa_id) {
      throw new Error('Datos de invitación incompletos');
    }

    // Inicializar Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generar token único
    const token = crypto.randomUUID();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // 7 días de validez

    console.log('Creating invitation record...');

    // Crear registro de invitación
    const { data: invitationData, error: invitationError } = await supabase
      .from('usuario_invitaciones')
      .insert({
        email: requestData.email.toLowerCase(),
        nombre: requestData.nombre || '',
        apellido: requestData.apellido || '',
        rol: requestData.rol,
        token: token,
        invitado_por: requestData.invitado_por,
        empresa_id: requestData.empresa_id,
        tipo_empresa: requestData.tipo_empresa,
        estado: 'pendiente',
        fecha_expiracion: expirationDate.toISOString(),
        fecha_invitacion: new Date().toISOString()
      })
      .select()
      .single();

    if (invitationError) {
      console.error('Error creating invitation:', invitationError);
      throw new Error(`Error al crear invitación: ${invitationError.message}`);
    }

    console.log('Invitation record created successfully');

    // Inicializar Resend
    const resend = new Resend(resendApiKey);

    // Construir URL de invitación
    const baseUrl = req.headers.get('origin') || 'https://mwxytzuootrrudjfwsif.supabase.co';
    const invitationUrl = `${baseUrl}/register-from-invitation?token=${token}`;

    console.log('Sending email invitation...');

    // Enviar email
    const emailResponse = await resend.emails.send({
      from: "Breus <onboarding@resend.dev>",
      to: [requestData.email],
      subject: "Invitación a Breus - Sistema de Gestión de Buceo",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">¡Bienvenido a Breus!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Sistema de Gestión de Buceo Profesional</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Hola ${requestData.nombre || 'Usuario'},</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Has sido invitado a unirte a <strong>Breus</strong>, el sistema de gestión de operaciones de buceo más avanzado.
            </p>
            
            <div style="background: white; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <h3 style="margin: 0 0 10px 0; color: #333;">Detalles de tu invitación:</h3>
              <p style="margin: 5px 0; color: #666;"><strong>Email:</strong> ${requestData.email}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Rol:</strong> ${getRoleDisplayName(requestData.rol)}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Empresa:</strong> ${requestData.tipo_empresa === 'salmonera' ? 'Salmonera' : 'Empresa de Servicio'}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${invitationUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-size: 16px; 
                        font-weight: bold; 
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                Completar Registro
              </a>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>⏰ Importante:</strong> Esta invitación expira el ${expirationDate.toLocaleDateString('es-ES')}. 
                Por favor, completa tu registro antes de esa fecha.
              </p>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              <p style="color: #999; font-size: 12px; text-align: center;">
                Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:<br>
                <span style="color: #667eea; word-break: break-all;">${invitationUrl}</span>
              </p>
              
              <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
                Si no esperabas esta invitación, puedes ignorar este correo de forma segura.
              </p>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0; font-size: 14px;">
              © 2024 Breus - Sistema de Gestión de Buceo
            </p>
          </div>
        </div>
      `,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Invitación enviada exitosamente',
        invitation_id: invitationData.id,
        email_id: emailResponse.data?.id
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error in send-user-invitation function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Error interno del servidor',
        details: error.details || null
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

function getRoleDisplayName(role: string): string {
  const roleMap: Record<string, string> = {
    admin_salmonera: 'Administrador de Salmonera',
    admin_servicio: 'Administrador de Servicio',
    supervisor: 'Supervisor',
    buzo: 'Buzo',
    superuser: 'Super Usuario'
  };
  return roleMap[role] || role;
}

serve(handler);
