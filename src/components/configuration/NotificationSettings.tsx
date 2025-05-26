
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NotificationSetting {
  eventType: string;
  label: string;
  description: string;
  channels: {
    app: boolean;
    email: boolean;
    webhook: boolean;
  };
}

export function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      eventType: 'HPT_DONE',
      label: 'HPT Firmado',
      description: 'Cuando se completa y firma un HPT',
      channels: { app: true, email: true, webhook: true }
    },
    {
      eventType: 'ANEXO_DONE', 
      label: 'Anexo Bravo Firmado',
      description: 'Cuando se completa y firma un Anexo Bravo',
      channels: { app: true, email: true, webhook: true }
    },
    {
      eventType: 'IMM_CREATED',
      label: 'Nueva Inmersión',
      description: 'Cuando se registra una nueva inmersión',
      channels: { app: true, email: false, webhook: true }
    },
    {
      eventType: 'BITACORA_COMPLETED',
      label: 'Bitácora Completada',
      description: 'Cuando se completa una bitácora',
      channels: { app: true, email: false, webhook: false }
    },
    {
      eventType: 'CERTIFICATE_EXPIRING',
      label: 'Certificación por Vencer',
      description: 'Cuando una certificación está próxima a vencer',
      channels: { app: true, email: true, webhook: false }
    }
  ]);

  const updateChannel = (eventType: string, channel: keyof NotificationSetting['channels'], value: boolean) => {
    setSettings(settings.map(setting => 
      setting.eventType === eventType 
        ? { ...setting, channels: { ...setting.channels, [channel]: value } }
        : setting
    ));
  };

  const handleSave = () => {
    // Here you would save to backend
    console.log('Saving notification settings:', settings);
    // Add toast notification
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Notificaciones</CardTitle>
          <p className="text-sm text-gray-600">
            Configura cómo y cuándo recibir notificaciones para cada tipo de evento.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 pb-4 border-b">
              <div className="col-span-6">
                <Label className="font-medium">Evento</Label>
              </div>
              <div className="col-span-2 text-center">
                <Label className="font-medium">App</Label>
              </div>
              <div className="col-span-2 text-center">
                <Label className="font-medium">Email</Label>
              </div>
              <div className="col-span-2 text-center">
                <Label className="font-medium">Webhook</Label>
              </div>
            </div>

            {/* Settings */}
            {settings.map(setting => (
              <div key={setting.eventType} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-100">
                <div className="col-span-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label className="font-medium">{setting.label}</Label>
                      <Badge variant="outline" className="text-xs">
                        {setting.eventType}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  </div>
                </div>
                
                <div className="col-span-2 flex justify-center">
                  <Switch
                    checked={setting.channels.app}
                    onCheckedChange={(checked) => updateChannel(setting.eventType, 'app', checked)}
                  />
                </div>
                
                <div className="col-span-2 flex justify-center">
                  <Switch
                    checked={setting.channels.email}
                    onCheckedChange={(checked) => updateChannel(setting.eventType, 'email', checked)}
                  />
                </div>
                
                <div className="col-span-2 flex justify-center">
                  <Switch
                    checked={setting.channels.webhook}
                    onCheckedChange={(checked) => updateChannel(setting.eventType, 'webhook', checked)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <Button onClick={handleSave}>
              Guardar Configuración
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Additional Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración Global</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Notificaciones Push</Label>
              <p className="text-sm text-gray-600">Recibir notificaciones push en el navegador</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Resumen Diario</Label>
              <p className="text-sm text-gray-600">Recibir un resumen diario por email</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Notificaciones de Mantenimiento</Label>
              <p className="text-sm text-gray-600">Alertas sobre mantenimiento del sistema</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
