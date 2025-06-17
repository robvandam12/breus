
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Webhook, 
  Plus, 
  Edit, 
  Trash2, 
  TestTube,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Activity
} from "lucide-react";

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  secret?: string;
  lastTriggered?: string;
  status: 'success' | 'error' | 'pending';
}

export const WebhookSettings = () => {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    {
      id: '1',
      name: 'Notificaciones Slack',
      url: 'https://hooks.slack.com/services/...',
      events: ['bitacora_created', 'operacion_completed'],
      active: true,
      lastTriggered: '2024-06-17 14:30:25',
      status: 'success'
    },
    {
      id: '2',
      name: 'Sistema ERP',
      url: 'https://api.empresa.com/webhooks/breus',
      events: ['inmersion_completed', 'alert_created'],
      active: false,
      lastTriggered: '2024-06-15 09:15:00',
      status: 'error'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookConfig | null>(null);

  const availableEvents = [
    { id: 'operacion_created', name: 'Operación Creada', description: 'Se crea una nueva operación' },
    { id: 'operacion_completed', name: 'Operación Completada', description: 'Se completa una operación' },
    { id: 'bitacora_created', name: 'Bitácora Creada', description: 'Se crea una nueva bitácora' },
    { id: 'bitacora_signed', name: 'Bitácora Firmada', description: 'Se firma una bitácora digitalmente' },
    { id: 'inmersion_completed', name: 'Inmersión Completada', description: 'Se completa una inmersión' },
    { id: 'alert_created', name: 'Alerta Creada', description: 'Se genera una nueva alerta de seguridad' },
    { id: 'hpt_approved', name: 'HPT Aprobado', description: 'Se aprueba un HPT' },
    { id: 'anexo_bravo_signed', name: 'Anexo Bravo Firmado', description: 'Se firma un Anexo Bravo' }
  ];

  const getStatusIcon = (status: WebhookConfig['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: WebhookConfig['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTest = async (webhookId: string) => {
    // Simular test de webhook
    console.log(`Testing webhook ${webhookId}`);
    // Aquí iría la lógica real de testing
  };

  const handleDelete = (webhookId: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== webhookId));
  };

  const handleToggleActive = (webhookId: string) => {
    setWebhooks(prev => prev.map(w => 
      w.id === webhookId ? { ...w, active: !w.active } : w
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Configuración de Webhooks</h2>
          <p className="text-gray-600">Gestiona las integraciones automáticas con sistemas externos</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Webhook
        </Button>
      </div>

      {/* Lista de Webhooks */}
      <div className="grid gap-4">
        {webhooks.map((webhook) => (
          <Card key={webhook.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Webhook className="w-5 h-5 text-blue-600" />
                  <div>
                    <CardTitle className="text-lg">{webhook.name}</CardTitle>
                    <p className="text-sm text-gray-600">{webhook.url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={webhook.active}
                    onCheckedChange={() => handleToggleActive(webhook.id)}
                  />
                  <Badge className={getStatusBadge(webhook.status)}>
                    {webhook.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Eventos */}
                <div>
                  <Label className="text-sm font-medium">Eventos suscritos</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {webhook.events.map(event => (
                      <Badge key={event} variant="outline" className="text-xs">
                        {availableEvents.find(e => e.id === event)?.name || event}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Estado y última activación */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(webhook.status)}
                    <span>Estado: {webhook.status}</span>
                  </div>
                  {webhook.lastTriggered && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span>Último: {webhook.lastTriggered}</span>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" onClick={() => handleTest(webhook.id)}>
                    <TestTube className="w-4 h-4 mr-2" />
                    Probar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditingWebhook(webhook)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(webhook.id)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Formulario de Creación/Edición */}
      {(showForm || editingWebhook) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingWebhook ? 'Editar Webhook' : 'Nuevo Webhook'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-name">Nombre</Label>
                <Input
                  id="webhook-name"
                  placeholder="Nombre descriptivo del webhook"
                  defaultValue={editingWebhook?.name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhook-url">URL de Destino</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://api.ejemplo.com/webhook"
                  defaultValue={editingWebhook?.url}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Eventos</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableEvents.map(event => (
                  <div key={event.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={event.id}
                      defaultChecked={editingWebhook?.events.includes(event.id)}
                    />
                    <Label htmlFor={event.id} className="text-sm">
                      {event.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook-secret">Secret (Opcional)</Label>
              <Input
                id="webhook-secret"
                type="password"
                placeholder="Clave secreta para verificar la autenticidad"
                defaultValue={editingWebhook?.secret}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="webhook-active"
                defaultChecked={editingWebhook?.active ?? true}
              />
              <Label htmlFor="webhook-active">Activar webhook</Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button>
                {editingWebhook ? 'Actualizar' : 'Crear'} Webhook
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingWebhook(null);
                }}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Logs de Webhooks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Registro de Actividad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { webhook: 'Notificaciones Slack', event: 'bitacora_created', status: 'success', time: '14:30:25', response: '200 OK' },
              { webhook: 'Sistema ERP', event: 'inmersion_completed', status: 'error', time: '14:25:12', response: '500 Internal Server Error' },
              { webhook: 'Notificaciones Slack', event: 'operacion_completed', status: 'success', time: '13:45:00', response: '200 OK' }
            ].map((log, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(log.status as WebhookConfig['status'])}
                  <div>
                    <p className="font-medium text-sm">{log.webhook}</p>
                    <p className="text-xs text-gray-600">{log.event}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs">{log.time}</p>
                  <p className="text-xs text-gray-500">{log.response}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
