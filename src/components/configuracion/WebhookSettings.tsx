
import { useState } from 'react';
import { Plus, Edit, Trash2, TestTube, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useWebhooks } from '@/hooks/useWebhooks';
import { WebhookForm } from './WebhookForm';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const WebhookSettings = () => {
  const [selectedWebhook, setSelectedWebhook] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { webhooks, isLoading, deleteWebhook, testWebhook, isTesting } = useWebhooks();

  const handleEdit = (webhook: any) => {
    setSelectedWebhook(webhook);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este webhook?')) {
      await deleteWebhook(id);
    }
  };

  const handleTest = async (id: string) => {
    await testWebhook(id);
  };

  if (isLoading) {
    return <div>Cargando webhooks...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Webhooks Configurados</h3>
          <p className="text-sm text-gray-500">
            Gestiona los endpoints para recibir notificaciones automáticas
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedWebhook(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedWebhook ? 'Editar Webhook' : 'Crear Nuevo Webhook'}
              </DialogTitle>
            </DialogHeader>
            <WebhookForm
              webhook={selectedWebhook}
              onSuccess={() => {
                setIsFormOpen(false);
                setSelectedWebhook(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {webhooks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <ExternalLink className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No hay webhooks configurados</h3>
              <p className="text-gray-500 mb-4">
                Crea tu primer webhook para recibir notificaciones automáticas
              </p>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Webhook
              </Button>
            </CardContent>
          </Card>
        ) : (
          webhooks.map((webhook) => (
            <Card key={webhook.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{webhook.name}</CardTitle>
                    <Badge variant={webhook.active ? "default" : "secondary"}>
                      {webhook.active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTest(webhook.id)}
                      disabled={isTesting}
                    >
                      <TestTube className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(webhook)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(webhook.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">URL</p>
                    <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                      {webhook.url}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Eventos</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {webhook.events.map((event: string) => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Éxitos</p>
                      <p className="font-semibold text-green-600">
                        {webhook.success_count}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Errores</p>
                      <p className="font-semibold text-red-600">
                        {webhook.error_count}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Último uso</p>
                      <p className="font-semibold">
                        {webhook.last_triggered 
                          ? format(new Date(webhook.last_triggered), 'dd/MM HH:mm', { locale: es })
                          : 'Nunca'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
