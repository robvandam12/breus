
import { useEffect } from 'react';
import { ArrowLeft, Bell, Mail, Webhook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationSettingsProps {
  onClose: () => void;
}

const eventTypes = [
  { id: 'HPT_DONE', name: 'HPT Firmado', description: 'Cuando se firma un HPT' },
  { id: 'ANEXO_DONE', name: 'Anexo Bravo Firmado', description: 'Cuando se firma un Anexo Bravo' },
  { id: 'IMM_CREATED', name: 'Inmersión Creada', description: 'Cuando se crea una nueva inmersión' },
  { id: 'IMM_COMPLETED', name: 'Inmersión Completada', description: 'Cuando se completa una inmersión' },
  { id: 'BITACORA_READY', name: 'Bitácora Lista', description: 'Cuando una bitácora está lista para firma' },
  { id: 'PERMIT_EXPIRING', name: 'Permiso por Vencer', description: 'Cuando un permiso está por vencer' },
];

const channels = [
  { id: 'app' as const, name: 'Aplicación', icon: Bell, description: 'Notificaciones dentro de la app' },
  { id: 'email' as const, name: 'Email', icon: Mail, description: 'Notificaciones por correo electrónico' },
  { id: 'webhook' as const, name: 'Webhook', icon: Webhook, description: 'Notificaciones vía webhook' },
];

export const NotificationSettings = ({ onClose }: NotificationSettingsProps) => {
  const { subscriptions, fetchSubscriptions, updateSubscription, createSubscription } = useNotifications();

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const isSubscribed = (eventType: string, channel: string) => {
    return subscriptions.find(
      s => s.event_type === eventType && s.channel === channel
    )?.enabled || false;
  };

  const handleSubscriptionChange = async (eventType: string, channel: 'app' | 'email' | 'webhook', enabled: boolean) => {
    const existingSubscription = subscriptions.find(
      s => s.event_type === eventType && s.channel === channel
    );

    if (existingSubscription) {
      await updateSubscription(existingSubscription.id, enabled);
    } else if (enabled) {
      await createSubscription(eventType, channel);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h3 className="font-semibold">Configuración de Notificaciones</h3>
      </div>

      <div className="space-y-6">
        {eventTypes.map((eventType) => (
          <div key={eventType.id} className="space-y-3">
            <div>
              <h4 className="font-medium text-sm">{eventType.name}</h4>
              <p className="text-xs text-gray-500">{eventType.description}</p>
            </div>

            <div className="space-y-2 pl-4">
              {channels.map((channel) => {
                const IconComponent = channel.icon;
                return (
                  <div key={channel.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-gray-500" />
                      <Label htmlFor={`${eventType.id}-${channel.id}`} className="text-sm">
                        {channel.name}
                      </Label>
                    </div>
                    <Switch
                      id={`${eventType.id}-${channel.id}`}
                      checked={isSubscribed(eventType.id, channel.id)}
                      onCheckedChange={(checked) => 
                        handleSubscriptionChange(eventType.id, channel.id, checked)
                      }
                    />
                  </div>
                );
              })}
            </div>
            
            <Separator />
          </div>
        ))}
      </div>
    </div>
  );
};
