
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info,
  Shield,
  Clock,
  User,
  Settings,
  CheckCheck,
} from "lucide-react";
import { useNotificationSystem } from "@/hooks/useNotificationSystem";
import { cn } from "@/lib/utils";

interface NotificationCenterProps {
  trigger?: React.ReactNode;
}

export const NotificationCenter = ({ trigger }: NotificationCenterProps) => {
  const {
    notifications,
    securityAlerts,
    unreadCount,
    criticalAlertsCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    acknowledgeAlert,
    isMarkingAsRead,
    isAcknowledging,
  } = useNotificationSystem();

  const [activeTab, setActiveTab] = useState("notifications");

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getAlertPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const handleNotificationClick = async (notificationId: string, isRead: boolean, link?: string) => {
    if (!isRead) {
      await markAsRead(notificationId);
    }
    
    if (link) {
      window.location.href = link;
    }
  };

  const handleAlertAcknowledge = async (alertId: string) => {
    await acknowledgeAlert(alertId);
  };

  const defaultTrigger = (
    <Button variant="ghost" size="sm" className="relative">
      <Bell className="w-4 h-4" />
      {(unreadCount > 0 || criticalAlertsCount > 0) && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
        >
          {Math.min(unreadCount + criticalAlertsCount, 99)}
        </Badge>
      )}
    </Button>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || defaultTrigger}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[500px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Centro de Notificaciones
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notifications" className="relative">
                Notificaciones
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="alerts" className="relative">
                Alertas
                {criticalAlertsCount > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                    {criticalAlertsCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notifications" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Notificaciones Recientes</h3>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAllAsRead()}
                    disabled={isMarkingAsRead}
                  >
                    <CheckCheck className="w-4 h-4 mr-1" />
                    Marcar todas como leídas
                  </Button>
                )}
              </div>

              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No hay notificaciones</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <Card
                        key={notification.id}
                        className={cn(
                          "cursor-pointer transition-colors hover:bg-gray-50",
                          !notification.read && "border-l-4 border-l-blue-500 bg-blue-50/30"
                        )}
                        onClick={() => handleNotificationClick(
                          notification.id,
                          notification.read,
                          notification.metadata?.link
                        )}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium truncate">
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                {new Date(notification.created_at).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Alertas de Seguridad</h3>
                <Badge variant="outline" className="text-xs">
                  {securityAlerts.filter(a => !a.acknowledged).length} pendientes
                </Badge>
              </div>

              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {securityAlerts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No hay alertas de seguridad</p>
                    </div>
                  ) : (
                    securityAlerts.map((alert) => (
                      <Card
                        key={alert.id}
                        className={cn(
                          "transition-colors",
                          !alert.acknowledged && "border-l-4 border-l-red-500"
                        )}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Shield className={cn(
                              "w-5 h-5 flex-shrink-0",
                              alert.priority === 'critical' ? "text-red-500" :
                              alert.priority === 'high' ? "text-orange-500" :
                              alert.priority === 'medium' ? "text-yellow-500" :
                              "text-blue-500"
                            )} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <Badge className={getAlertPriorityColor(alert.priority)}>
                                  {alert.priority.toUpperCase()}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {alert.type}
                                </span>
                              </div>
                              
                              <div className="text-sm mb-2">
                                <strong>Inmersión:</strong> {(alert.inmersion as any)?.codigo}
                              </div>
                              
                              {alert.details && (
                                <div className="text-sm text-gray-600 mb-2">
                                  {Object.entries(alert.details).map(([key, value]) => (
                                    <div key={key}>
                                      <strong>{key}:</strong> {String(value)}
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  {new Date(alert.created_at).toLocaleString()}
                                </div>
                                
                                {!alert.acknowledged ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleAlertAcknowledge(alert.id)}
                                    disabled={isAcknowledging}
                                  >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Reconocer
                                  </Button>
                                ) : (
                                  <div className="flex items-center gap-1 text-xs text-green-600">
                                    <CheckCircle className="w-3 h-3" />
                                    Reconocida
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};
