
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, TestTube, Webhook } from "lucide-react";
import { useWebhooks } from "@/hooks/useWebhooks";

export const WebhookManagement = () => {
  const { webhooks, isLoading, createWebhook, deleteWebhook, testWebhook } = useWebhooks();
  const [showForm, setShowForm] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    secret_token: '',
    events: ['HPT_DONE', 'ANEXO_DONE', 'IMM_CREATED'],
    active: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createWebhook(newWebhook);
      setNewWebhook({
        name: '',
        url: '',
        secret_token: '',
        events: ['HPT_DONE', 'ANEXO_DONE', 'IMM_CREATED'],
        active: true
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating webhook:', error);
    }
  };

  if (isLoading) {
    return <div>Cargando webhooks...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook className="w-5 h-5" />
          Configuración de Webhooks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Gestiona los endpoints que reciben notificaciones del sistema
          </p>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Webhook
          </Button>
        </div>

        {showForm && (
          <Card className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="webhook-name">Nombre</Label>
                  <Input
                    id="webhook-name"
                    value={newWebhook.name}
                    onChange={(e) => setNewWebhook({...newWebhook, name: e.target.value})}
                    placeholder="Nombre del webhook"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="webhook-url">URL</Label>
                  <Input
                    id="webhook-url"
                    type="url"
                    value={newWebhook.url}
                    onChange={(e) => setNewWebhook({...newWebhook, url: e.target.value})}
                    placeholder="https://mi-app.com/webhook"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="webhook-token">Token Secreto</Label>
                <Input
                  id="webhook-token"
                  value={newWebhook.secret_token}
                  onChange={(e) => setNewWebhook({...newWebhook, secret_token: e.target.value})}
                  placeholder="Token para firmar las peticiones"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Crear Webhook</Button>
              </div>
            </form>
          </Card>
        )}

        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <Card key={webhook.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{webhook.name}</h4>
                    <Badge variant={webhook.active ? "default" : "secondary"}>
                      {webhook.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{webhook.url}</p>
                  <div className="text-xs text-gray-400 mt-2">
                    Éxitos: {webhook.success_count} | Errores: {webhook.error_count}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => testWebhook(webhook.id)}
                  >
                    <TestTube className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => deleteWebhook(webhook.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {webhooks.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No hay webhooks configurados
          </div>
        )}
      </CardContent>
    </Card>
  );
};
