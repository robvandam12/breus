
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWebhooks, type Webhook } from '@/hooks/useWebhooks';

interface WebhookFormProps {
  webhook?: Webhook | null;
  onSuccess: () => void;
}

const availableEvents = [
  { id: 'HPT_DONE', name: 'HPT Firmado' },
  { id: 'ANEXO_DONE', name: 'Anexo Bravo Firmado' },
  { id: 'IMM_CREATED', name: 'Inmersión Creada' },
  { id: 'IMM_COMPLETED', name: 'Inmersión Completada' },
  { id: 'BITACORA_READY', name: 'Bitácora Lista' },
  { id: 'PERMIT_EXPIRING', name: 'Permiso por Vencer' },
];

export const WebhookForm = ({ webhook, onSuccess }: WebhookFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    secret_token: '',
    events: [] as string[],
    active: true,
  });

  const { createWebhook, updateWebhook, isCreating, isUpdating } = useWebhooks();

  useEffect(() => {
    if (webhook) {
      setFormData({
        name: webhook.name,
        url: webhook.url,
        secret_token: webhook.secret_token,
        events: webhook.events,
        active: webhook.active,
      });
    } else {
      // Generate a random secret token for new webhooks
      setFormData(prev => ({
        ...prev,
        secret_token: `wh_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
      }));
    }
  }, [webhook]);

  const handleEventChange = (eventId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      events: checked 
        ? [...prev.events, eventId]
        : prev.events.filter(e => e !== eventId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (webhook) {
        await updateWebhook({ id: webhook.id, data: formData });
      } else {
        await createWebhook(formData);
      }
      onSuccess();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nombre del Webhook</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Mi Webhook"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="url">URL de Destino</Label>
          <Input
            id="url"
            type="url"
            value={formData.url}
            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
            placeholder="https://mi-servidor.com/webhook"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="secret_token">Token Secreto</Label>
          <Input
            id="secret_token"
            value={formData.secret_token}
            onChange={(e) => setFormData(prev => ({ ...prev, secret_token: e.target.value }))}
            placeholder="Token para validar la firma"
            required
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Este token se usa para firmar las peticiones y validar su autenticidad
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="active"
            checked={formData.active}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
            disabled={isLoading}
          />
          <Label htmlFor="active">Webhook activo</Label>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Eventos a Suscribir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {availableEvents.map((event) => (
              <div key={event.id} className="flex items-center space-x-2">
                <Checkbox
                  id={event.id}
                  checked={formData.events.includes(event.id)}
                  onCheckedChange={(checked) => handleEventChange(event.id, checked as boolean)}
                  disabled={isLoading}
                />
                <Label htmlFor={event.id}>{event.name}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onSuccess} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading || formData.events.length === 0}>
          {isLoading 
            ? (webhook ? 'Actualizando...' : 'Creando...') 
            : (webhook ? 'Actualizar' : 'Crear')
          } Webhook
        </Button>
      </div>
    </form>
  );
};
