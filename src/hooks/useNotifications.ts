
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface NotificationSubscription {
  id: string;
  event_type: string;
  channel: 'app' | 'email' | 'webhook';
  enabled: boolean;
  user_id: string;
  created_at: string;
}

interface CreateNotificationData {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  metadata?: any;
  expires_at?: string;
}

export const useNotifications = () => {
  const [subscriptions, setSubscriptions] = useState<NotificationSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('notification_subscriptions')
        .select('*')
        .order('event_type');

      if (error) throw error;
      
      // Validar que los datos coincidan con nuestros tipos
      const validatedData = (data || []).filter(item => 
        ['app', 'email', 'webhook'].includes(item.channel)
      ) as NotificationSubscription[];
      
      setSubscriptions(validatedData);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNotification = async (notificationData: CreateNotificationData) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          ...notificationData,
          user_id: user.user.id,
          read: false
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  };

  const updateSubscription = async (subscriptionId: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('notification_subscriptions')
        .update({ enabled })
        .eq('id', subscriptionId);

      if (error) throw error;

      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId ? { ...sub, enabled } : sub
        )
      );

      toast({
        title: "Configuración actualizada",
        description: `Notificación ${enabled ? 'activada' : 'desactivada'}`
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la configuración",
        variant: "destructive"
      });
    }
  };

  const createSubscription = async (eventType: string, channel: 'app' | 'email' | 'webhook') => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('notification_subscriptions')
        .insert([{
          event_type: eventType,
          channel,
          enabled: true,
          user_id: user.user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setSubscriptions(prev => [...prev, data]);
      toast({
        title: "Suscripción creada",
        description: "Nueva configuración de notificación agregada"
      });
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la suscripción",
        variant: "destructive"
      });
    }
  };

  // Emitir notificación para eventos críticos
  const emitSecurityAlert = async (operationId: string, alertType: string, message: string) => {
    await createNotification({
      title: `Alerta de Seguridad: ${alertType}`,
      message: `Operación ${operationId}: ${message}`,
      type: 'error',
      metadata: { operationId, alertType },
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
    });
  };

  const emitValidationWarning = async (operationId: string, missingDocuments: string[]) => {
    await createNotification({
      title: 'Documentos Pendientes',
      message: `Operación ${operationId} requiere: ${missingDocuments.join(', ')}`,
      type: 'warning',
      metadata: { operationId, missingDocuments }
    });
  };

  const emitSuccessNotification = async (title: string, message: string, metadata?: any) => {
    await createNotification({
      title,
      message,
      type: 'success',
      metadata
    });
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return {
    subscriptions,
    isLoading,
    createNotification,
    updateSubscription,
    createSubscription,
    emitSecurityAlert,
    emitValidationWarning,
    emitSuccessNotification,
    refreshSubscriptions: fetchSubscriptions
  };
};
