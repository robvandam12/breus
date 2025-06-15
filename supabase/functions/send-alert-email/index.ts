
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Resend } from 'npm:resend';

const resend = new Resend(Deno.env.get('RESEND_API_KEY')!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AlertPayload {
    recipients: string[];
    alert: {
        id: string;
        type: string;
        priority: string;
        details: any;
        inmersion_code: string;
        escalation_level: number;
    };
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { recipients, alert }: AlertPayload = await req.json();

        if (!recipients || recipients.length === 0) {
             return new Response(JSON.stringify({ message: 'No recipients provided.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            });
        }
        
        const subject = `🚨 Alerta Escalada (Nivel ${alert.escalation_level}): ${alert.type.replace(/_/g, ' ')} - Inmersión ${alert.inmersion_code}`;
        const html = `
            <div style="font-family: sans-serif; padding: 20px; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: auto; background-color: white; padding: 20px; border-radius: 8px;">
                    <h1 style="color: #c0392b;">Alerta de Seguridad Escalada</h1>
                    <p>Se ha escalado una alerta de seguridad que requiere su atención inmediata.</p>
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding-bottom: 10px;"><strong>ID Alerta:</strong> ${alert.id}</li>
                        <li style="padding-bottom: 10px;"><strong>Tipo:</strong> ${alert.type.replace(/_/g, ' ')}</li>
                        <li style="padding-bottom: 10px;"><strong>Prioridad:</strong> ${alert.priority}</li>
                        <li style="padding-bottom: 10px;"><strong>Código Inmersión:</strong> ${alert.inmersion_code}</li>
                        <li style="padding-bottom: 10px;"><strong>Nuevo Nivel de Escalamiento:</strong> ${alert.escalation_level}</li>
                        <li style="padding-bottom: 10px;"><strong>Detalles:</strong> <pre style="background-color: #eee; padding: 10px; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word;">${JSON.stringify(alert.details, null, 2)}</pre></li>
                    </ul>
                    <p>Por favor, ingrese a la plataforma para revisar y reconocer la alerta.</p>
                    <p>Atentamente,<br/>El equipo de Breus</p>
                </div>
            </div>
        `;

        const { data, error } = await resend.emails.send({
            from: 'Alertas Breus <onboarding@resend.dev>', // Asegúrate que tu dominio esté verificado en Resend
            to: recipients,
            subject: subject,
            html: html,
        });

        if (error) {
            console.error('Resend API Error:', error);
            throw new Error(error.message);
        }

        return new Response(JSON.stringify({ message: "Email sent successfully", data }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error) {
        console.error('Error in send-alert-email function:', error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        });
    }
});
