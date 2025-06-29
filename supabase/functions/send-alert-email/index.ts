
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Resend } from 'npm:resend';
import { createBaseEmailTemplate } from "../_shared/email-templates/base-template.ts";
import { createButton, createInfoCard, createSection, createTable } from "../_shared/email-templates/components.ts";

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

const getPriorityConfig = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'critical':
    case 'critica':
      return {
        color: '#dc2626',
        icon: '🚨',
        label: 'CRÍTICA',
        variant: 'danger' as const
      };
    case 'high':
    case 'alta':
      return {
        color: '#ea580c',
        icon: '⚠️',
        label: 'ALTA',
        variant: 'warning' as const
      };
    case 'medium':
    case 'media':
      return {
        color: '#ca8a04',
        icon: '⚡',
        label: 'MEDIA',
        variant: 'warning' as const
      };
    default:
      return {
        color: '#2563eb',
        icon: '💡',
        label: 'BAJA',
        variant: 'info' as const
      };
  }
};

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
        
        const priorityConfig = getPriorityConfig(alert.priority);
        const alertTypeName = alert.type.replace(/_/g, ' ').toUpperCase();
        
        // Crear tabla con detalles de la alerta
        const alertDetails = [];
        if (alert.details) {
          for (const [key, value] of Object.entries(alert.details)) {
            alertDetails.push([
              key.replace(/_/g, ' ').toUpperCase(),
              String(value)
            ]);
          }
        }

        // Crear contenido del email
        const emailContent = `
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-flex; align-items: center; gap: 12px; background: ${priorityConfig.color}15; padding: 16px 24px; border-radius: 8px; border: 2px solid ${priorityConfig.color};">
              <span style="font-size: 24px;">${priorityConfig.icon}</span>
              <div>
                <h2 style="color: ${priorityConfig.color}; margin: 0; font-size: 18px; font-weight: 700;">
                  ALERTA ${priorityConfig.label} ESCALADA
                </h2>
                <p style="color: ${priorityConfig.color}; margin: 4px 0 0 0; font-size: 14px;">
                  Nivel de Escalamiento: ${alert.escalation_level}
                </p>
              </div>
            </div>
          </div>

          ${createInfoCard('Información de la Alerta', `
            <strong>ID de Alerta:</strong> ${alert.id}<br>
            <strong>Tipo:</strong> ${alertTypeName}<br>
            <strong>Prioridad:</strong> ${priorityConfig.label}<br>
            <strong>Código de Inmersión:</strong> ${alert.inmersion_code}<br>
            <strong>Nivel de Escalamiento:</strong> ${alert.escalation_level}
          `, priorityConfig.variant)}

          ${createSection('⚠️ Acción Requerida', `
            <p style="font-size: 16px; font-weight: 600; color: #dc2626;">
              Se ha escalado una alerta de seguridad que requiere su atención <strong>inmediata</strong>.
            </p>
            <p>Esta alerta ha sido escalada al nivel ${alert.escalation_level} debido a que no ha sido reconocida en el tiempo establecido. Es crucial que revise y tome las medidas necesarias de inmediato.</p>
          `)}

          ${alertDetails.length > 0 ? createTable(['Detalle', 'Valor'], alertDetails) : ''}

          ${createButton('Revisar Alerta en el Sistema', `${req.headers.get('origin') || 'https://breus.cl'}/alertas?alert_id=${alert.id}`, 'danger')}

          ${createSection('🔄 Próximos Pasos', `
            <ol style="margin: 16px 0; padding-left: 20px; color: #4b5563;">
              <li><strong>Acceda al sistema</strong> haciendo clic en el botón superior</li>
              <li><strong>Revise los detalles</strong> de la alerta y la inmersión asociada</li>
              <li><strong>Tome las medidas correctivas</strong> necesarias</li>
              <li><strong>Reconozca la alerta</strong> una vez resuelto el problema</li>
            </ol>
          `)}

          ${createInfoCard('Importante', `
            Si esta alerta no es reconocida y resuelta en el tiempo establecido, será escalada automáticamente al siguiente nivel de autoridad.
          `, 'warning')}
        `;

        const html = createBaseEmailTemplate({
          title: `🚨 Alerta Escalada (Nivel ${alert.escalation_level}): ${alertTypeName} - Inmersión ${alert.inmersion_code}`,
          previewText: `Alerta de seguridad escalada nivel ${alert.escalation_level} requiere atención inmediata`,
          children: emailContent
        });

        const { data, error } = await resend.emails.send({
            from: 'Alertas Breus <alertas@breus.cl>',
            to: recipients,
            subject: `🚨 Alerta Escalada (Nivel ${alert.escalation_level}): ${alertTypeName} - Inmersión ${alert.inmersion_code}`,
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
