
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, Webhook } from "lucide-react";

const eventTypes = [
  { id: 'HPT_DONE', name: 'HPT Firmado', description: 'Cuando se firma un HPT' },
  { id: 'ANEXO_DONE', name: 'Anexo Bravo Firmado', description: 'Cuando se firma un Anexo Bravo' },
  { id: 'IMM_CREATED', name: 'Inmersión Creada', description: 'Cuando se crea una nueva inmersión' },
  { id: 'IMM_COMPLETED', name: 'Inmersión Completada', description: 'Cuando se completa una inmersión' },
  { id: 'BITACORA_READY', name: 'Bitácora Lista', description: 'Cuando una bitácora está lista para firma' },
];

const channels = [
  { id: 'app', name: 'Aplicación', icon: Bell, description: 'Notificaciones dentro de la app' },
  { id: 'email', name: 'Email', icon: Mail, description: 'Notificaciones por correo electrónico' },
  { id: 'webhook', name: 'Webhook', icon: Webhook, description: 'Notificaciones vía webhook' },
];

export const NotificationSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Configuración de Notificaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-gray-500">
          Configura qué notificaciones quieres recibir y por qué canales
        </p>

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
                        defaultChecked={channel.id === 'app'}
                      />
                    </div>
                  );
                })}
              </div>
              
              <div className="border-t pt-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
