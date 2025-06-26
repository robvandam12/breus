
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, CheckCheck, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEnhancedNotifications } from '@/hooks/useEnhancedNotifications';
import { cn } from '@/lib/utils';

export const EnhancedNotificationButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const {
    notifications,
    unreadCount,
    priorityNotifications,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useEnhancedNotifications();

  const handleNotificationClick = async (notification: any) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    
    if (notification.metadata?.link) {
      navigate(notification.metadata.link);
      setIsOpen(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'inmersion_assignment':
        return '🎯';
      case 'bitacora_supervisor_pending':
        return '📋';
      case 'bitacora_buzo_ready':
        return '🤿';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: string, priority?: string) => {
    if (priority === 'high') return 'border-red-200 bg-red-50';
    
    switch (type) {
      case 'inmersion_assignment':
        return 'border-blue-200 bg-blue-50';
      case 'bitacora_supervisor_pending':
        return 'border-amber-200 bg-amber-50';
      case 'bitacora_buzo_ready':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notificaciones</CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    <CheckCheck className="w-4 h-4 mr-1" />
                    Marcar todas
                  </Button>
                )}
                <Badge variant="outline" className="text-xs">
                  {notifications.length}
                </Badge>
              </div>
            </div>
            {priorityNotifications.length > 0 && (
              <div className="text-sm text-amber-600">
                {priorityNotifications.length} notificaciones de alta prioridad
              </div>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">
                  Cargando notificaciones...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No hay notificaciones
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors",
                        !notification.read && "bg-blue-50 border-blue-100",
                        getNotificationColor(notification.type, notification.metadata?.priority)
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                            <h4 className="text-sm font-semibold truncate">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.created_at)}
                            </span>
                            <div className="flex items-center gap-1">
                              {notification.metadata?.priority === 'high' && (
                                <Badge variant="destructive" className="text-xs px-1 py-0">
                                  Alto
                                </Badge>
                              )}
                              {notification.metadata?.link && (
                                <ExternalLink className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="h-6 w-6 p-0"
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            {notifications.length > 0 && (
              <div className="p-4 border-t border-gray-100">
                <Button variant="ghost" className="w-full text-sm" onClick={() => navigate('/configuracion')}>
                  Configurar notificaciones
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};
