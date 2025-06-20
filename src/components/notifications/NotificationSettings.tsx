
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Shield, 
  Calendar, 
  Users,
  FileText,
  Zap,
} from "lucide-react";
import { useNotificationSystem } from "@/hooks/useNotificationSystem";
import { toast } from "@/hooks/use-toast";

export const NotificationSettings = () => {
  const { subscriptions, updateSubscription } = useNotificationSystem();

  const eventTypes = [
    {
      id: 'inmersion_created',
      name: 'Nueva Inmersión',
      description: 'Cuando se crea una nueva inmersión',
      icon: <Calendar className="w-4 h-4" />,
      category: 'Operaciones',
    },
    {
      id: 'inmersion_completed',
      name: 'Inmersión Completada',
      description: 'Cuando se completa una inmersión',
      icon: <Calendar className="w-4 h-4" />,
      category: 'Operaciones',
    },
    {
      id: 'security_alert',
      name: 'Alertas de Seguridad',
      description: 'Alertas críticas de seguridad durante inmersiones',
      icon: <Shield className="w-4 h-4" />,
      category: 'Seguridad',
    },
    {
      id: 'depth_exceeded',
      name: 'Profundidad Excedida',
      description: 'Cuando se excede la profundidad máxima planificada',
      icon: <Shield className="w-4 h-4" />,
      category: 'Seguridad',
    },
    {
      id: 'hpt_signed',
      name: 'HPT Firmado',
      description: 'Cuando se firma un HPT',
      icon: <FileText className="w-4 h-4" />,
      category: 'Documentos',
    },
    {
      id: 'anexo_signed',
      name: 'Anexo Bravo Firmado',
      description: 'Cuando se firma un Anexo Bravo',
      icon: <FileText className="w-4 h-4" />,
      category: 'Documentos',
    },
    {
      id: 'team_assigned',
      name: 'Equipo Asignado',
      description: 'Cuando eres asignado a un equipo de buceo',
      icon: <Users className="w-4 h-4" />,
      category: 'Equipos',
    },
    {
      id: 'operation_started',
      name: 'Operación Iniciada',
      description: 'Cuando se inicia una nueva operación',
      icon: <Zap className="w-4 h-4" />,
      category: 'Operaciones',
    },
  ];

  const channels = [
    {
      id: 'push',
      name: 'Notificaciones Push',
      description: 'Notificaciones en tiempo real en el navegador',
      icon: <Bell className="w-4 h-4" />,
    },
    {
      id: 'email',
      name: 'Correo Electrónico',
      description: 'Notificaciones por email',
      icon: <Mail className="w-4 h-4" />,
    },
    {
      id: 'sms',
      name: 'SMS',
      description: 'Notificaciones por mensaje de texto',
      icon: <MessageSquare className="w-4 h-4" />,
    },
  ];

  const getSubscriptionStatus = (eventType: string, channel: string) => {
    const subscription = subscriptions.find(s => 
      s.event_type === eventType && s.channel === channel
    );
    return subscription?.enabled ?? false;
  };

  const handleToggle = async (eventType: string, channel: string, enabled: boolean) => {
    try {
      await updateSubscription({ eventType, channel, enabled });
      toast({
        title: "Configuración actualizada",
        description: `Notificaciones ${enabled ? 'activadas' : 'desactivadas'} para ${eventType}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la configuración",
        variant: "destructive",
      });
    }
  };

  const categorizedEvents = eventTypes.reduce((acc, event) => {
    if (!acc[event.category]) {
      acc[event.category] = [];
    }
    acc[event.category].push(event);
    return acc;
  }, {} as Record<string, typeof eventTypes>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Configuración de Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-6">
            Configura cómo y cuándo deseas recibir notificaciones sobre eventos importantes 
            en el sistema de gestión de buceo.
          </p>

          <div className="space-y-8">
            {Object.entries(categorizedEvents).map(([category, events]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold">{category}</h3>
                  <Badge variant="outline">{events.length} eventos</Badge>
                </div>

                <div className="space-y-4">
                  {events.map((event) => (
                    <Card key={event.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3 mb-4">
                          {event.icon}
                          <div className="flex-1">
                            <h4 className="font-medium">{event.name}</h4>
                            <p className="text-sm text-gray-600">{event.description}</p>
                          </div>
                        </div>

                        <Separator className="mb-4" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {channels.map((channel) => (
                            <div key={channel.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-2">
                                {channel.icon}
                                <div>
                                  <Label className="text-sm font-medium">
                                    {channel.name}
                                  </Label>
                                  <p className="text-xs text-gray-500">
                                    {channel.description}
                                  </p>
                                </div>
                              </div>
                              <Switch
                                checked={getSubscriptionStatus(event.id, channel.id)}
                                onCheckedChange={(checked) => 
                                  handleToggle(event.id, channel.id, checked)
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Configuración Rápida</h4>
            <p className="text-sm text-blue-700 mb-3">
              Puedes activar o desactivar todas las notificaciones de una vez.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  eventTypes.forEach(event => {
                    channels.forEach(channel => {
                      handleToggle(event.id, channel.id, true);
                    });
                  });
                }}
              >
                Activar Todas
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  eventTypes.forEach(event => {
                    channels.forEach(channel => {
                      handleToggle(event.id, channel.id, false);
                    });
                  });
                }}
              >
                Desactivar Todas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
