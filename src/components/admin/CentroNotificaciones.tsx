
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Check, Trash2, AlertCircle, Info, CheckCircle, XCircle } from "lucide-react";
import { useWorkflowNotifications } from "@/hooks/useWorkflowNotifications";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const CentroNotificaciones = () => {
  const { notifications, isLoading, markAsRead } = useWorkflowNotifications();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      error: "bg-red-100 text-red-700",
      warning: "bg-yellow-100 text-yellow-700", 
      success: "bg-green-100 text-green-700",
      info: "bg-blue-100 text-blue-700"
    };
    return variants[type as keyof typeof variants] || variants.info;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: es });
    } catch {
      return dateString;
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Centro de Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando notificaciones...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Centro de Notificaciones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={filter} onValueChange={(value) => setFilter(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Todas ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">
              No leídas ({notifications.filter(n => !n.read).length})
            </TabsTrigger>
            <TabsTrigger value="read">
              Leídas ({notifications.filter(n => n.read).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-6">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay notificaciones
                </h3>
                <p className="text-gray-500">
                  {filter === 'unread' ? 'No tienes notificaciones sin leer' : 'No hay notificaciones en esta categoría'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getTypeIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{notification.title}</h4>
                            <Badge className={getTypeBadge(notification.type)}>
                              {notification.type}
                            </Badge>
                            {!notification.read && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                Nueva
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(notification.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
