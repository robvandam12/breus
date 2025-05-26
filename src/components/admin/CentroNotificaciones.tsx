
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, CheckCircle, Clock, AlertTriangle, Mail } from 'lucide-react';
import { useWorkflowNotifications } from '@/hooks/useWorkflowNotifications';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export const CentroNotificaciones = () => {
  const { notifications, isLoading, markAsRead, unreadCount } = useWorkflowNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'info':
        return <Mail className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-700">Éxito</Badge>;
      case 'warning':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-700">Alerta</Badge>;
      case 'info':
        return <Badge variant="default" className="bg-blue-100 text-blue-700">Info</Badge>;
      default:
        return <Badge variant="secondary">General</Badge>;
    }
  };

  if (isLoading) {
    return <div className="p-4">Cargando notificaciones...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Centro de Notificaciones</h2>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="rounded-full">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notificaciones Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay notificaciones</p>
              ) : (
                notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border rounded-lg ${!notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{notification.title}</h4>
                            {getNotificationBadge(notification.type)}
                            {!notification.read && (
                              <Badge variant="destructive" className="text-xs">Nueva</Badge>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDistanceToNow(new Date(notification.created_at), { 
                                addSuffix: true, 
                                locale: es 
                              })}
                            </span>
                            {notification.expires_at && (
                              <span className="text-yellow-600">
                                Expira: {formatDistanceToNow(new Date(notification.expires_at), { 
                                  addSuffix: true, 
                                  locale: es 
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Marcar como leída
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
