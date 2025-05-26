
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Check, Trash2, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNotifications, type Notification } from '@/hooks/useNotifications';

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const { markAsRead, deleteNotification } = useNotifications();

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getColorClass = () => {
    switch (notification.type) {
      case 'success':
        return 'border-l-green-500 bg-green-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'error':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: es });
    } catch {
      return dateString;
    }
  };

  return (
    <Card className={`border-l-4 ${getColorClass()} ${!notification.read ? 'font-medium' : 'opacity-75'}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1">
            {getIcon()}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {notification.title}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {notification.message}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDate(notification.created_at)}
              </p>
            </div>
          </div>
          
          <div className="flex gap-1">
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAsRead(notification.id)}
                className="h-6 w-6 p-0"
              >
                <Check className="w-3 h-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteNotification(notification.id)}
              className="h-6 w-6 p-0"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
