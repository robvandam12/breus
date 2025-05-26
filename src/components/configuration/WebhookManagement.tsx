
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Edit } from "lucide-react";

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  lastTriggered?: string;
}

export function WebhookManagement() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: '1',
      name: 'Sistema Principal',
      url: 'https://api.empresa.com/webhooks/breus',
      events: ['HPT_DONE', 'ANEXO_DONE', 'IMM_CREATED'],
      active: true,
      lastTriggered: '2024-01-15 10:30:00'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    events: [] as string[],
    active: true
  });

  const availableEvents = [
    'HPT_DONE',
    'ANEXO_DONE', 
    'IMM_CREATED',
    'BITACORA_COMPLETED',
    'OPERATION_STARTED'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newWebhook: Webhook = {
      id: Date.now().toString(),
      ...formData
    };
    setWebhooks([...webhooks, newWebhook]);
    setFormData({ name: '', url: '', events: [], active: true });
    setShowForm(false);
  };

  const toggleWebhook = (id: string) => {
    setWebhooks(webhooks.map(w => 
      w.id === id ? { ...w, active: !w.active } : w
    ));
  };

  const deleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter(w => w.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestión de Webhooks</CardTitle>
          <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Webhook
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Nombre del webhook"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    placeholder="https://api.ejemplo.com/webhook"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Eventos a suscribir</Label>
                <div className="flex flex-wrap gap-2">
                  {availableEvents.map(event => (
                    <Badge
                      key={event}
                      variant={formData.events.includes(event) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        const events = formData.events.includes(event)
                          ? formData.events.filter(e => e !== event)
                          : [...formData.events, event];
                        setFormData({...formData, events});
                      }}
                    >
                      {event}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({...formData, active: checked})}
                />
                <Label>Activo</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Guardar</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {webhooks.map(webhook => (
              <div key={webhook.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{webhook.name}</h3>
                    <Badge variant={webhook.active ? "default" : "secondary"}>
                      {webhook.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{webhook.url}</p>
                  <div className="flex flex-wrap gap-1">
                    {webhook.events.map(event => (
                      <Badge key={event} variant="outline" className="text-xs">
                        {event}
                      </Badge>
                    ))}
                  </div>
                  {webhook.lastTriggered && (
                    <p className="text-xs text-gray-500 mt-2">
                      Último trigger: {webhook.lastTriggered}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={webhook.active}
                    onCheckedChange={() => toggleWebhook(webhook.id)}
                  />
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => deleteWebhook(webhook.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
