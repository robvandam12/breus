
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export const useOperationNotifications = () => {
  useEffect(() => {
    const handleOperationNotification = (event: CustomEvent) => {
      const { type, message, title } = event.detail;
      
      toast({
        title: title || 'Notificación de Operación',
        description: message || 'Se ha actualizado el estado de la operación',
      });
    };

    window.addEventListener('operationNotification', handleOperationNotification as EventListener);

    return () => {
      window.removeEventListener('operationNotification', handleOperationNotification as EventListener);
    };
  }, []);
};
