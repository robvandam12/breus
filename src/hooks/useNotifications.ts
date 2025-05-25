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

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  created_at: string;
  metadata?: any;
  expires_at?: string;
  user_id: string;
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('notification_subscriptions')
        .select('*')
        .order('event_type');

      if (error) throw error;
      
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

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      const validatedData = (data || []).filter(item => 
        ['info', 'warning', 'error', 'success'].includes(item.type)
      ).map(item => ({
        ...item,
        type: item.type as 'info' | 'warning' | 'error' | 'success'
      })) as Notification[];
      
      setNotifications(validatedData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
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

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
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

      setSubscriptions(prev => [...prev, data as NotificationSubscription]);
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
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
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
    fetchNotifications();
  }, []);

  return {
    subscriptions,
    notifications,
    isLoading,
    createNotification,
    markAsRead,
    deleteNotification,
    updateSubscription,
    createSubscription,
    emitSecurityAlert,
    emitValidationWarning,
    emitSuccessNotification,
    fetchSubscriptions,
    refreshSubscriptions: fetchSubscriptions,
    refreshNotifications: fetchNotifications
  };
};
