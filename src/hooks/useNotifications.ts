
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Manual types until Supabase regenerates the types
interface NotificationRow {
  id: string;
  user_id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  read: boolean;
  metadata: Record<string, any> | null;
  created_at: string;
  expires_at: string | null;
}

interface NotificationSubscriptionRow {
  id: string;
  user_id: string;
  event_type: string;
  channel: 'app' | 'webhook' | 'email';
  enabled: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  read: boolean;
  user_id: string;
  metadata?: Record<string, any>;
  created_at: string;
  expires_at?: string;
}

export interface NotificationSubscription {
  event_type: string;
  channel: 'app' | 'webhook' | 'email';
  enabled: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<NotificationSubscription[]>([]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const transformedData = (data || []).map((item: any) => ({
        id: item.id,
        type: item.type,
        title: item.title,
        message: item.message,
        read: item.read,
        user_id: item.user_id,
        metadata: item.metadata || {},
        created_at: item.created_at,
        expires_at: item.expires_at
      }));

      setNotifications(transformedData);
      setUnreadCount(transformedData.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las notificaciones",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark notification as read
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
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      const notification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Subscribe to real-time notifications
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Subscribe to new notifications
      const channel = supabase
        .channel(`notifications-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            const newNotification = payload.new as Notification;
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Show toast for new notification
            toast({
              title: newNotification.title,
              description: newNotification.message,
            });
          }
        )
        .subscribe();

      cleanup = () => {
        supabase.removeChannel(channel);
      };
    };

    setupRealtime();
    fetchNotifications();

    return cleanup;
  }, [fetchNotifications]);

  // Fetch notification subscriptions
  const fetchSubscriptions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notification_subscriptions')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const transformedData = (data || []).map((item: any) => ({
        event_type: item.event_type,
        channel: item.channel as 'app' | 'webhook' | 'email',
        enabled: item.enabled
      }));
      
      setSubscriptions(transformedData);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  // Update subscription
  const updateSubscription = async (eventType: string, channel: 'app' | 'webhook' | 'email', enabled: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notification_subscriptions')
        .upsert({
          user_id: user.id,
          event_type: eventType,
          channel,
          enabled
        });

      if (error) throw error;

      setSubscriptions(prev => {
        const existing = prev.find(s => s.event_type === eventType && s.channel === channel);
        if (existing) {
          return prev.map(s => 
            s.event_type === eventType && s.channel === channel 
              ? { ...s, enabled }
              : s
          );
        } else {
          return [...prev, { event_type: eventType, channel, enabled }];
        }
      });

      toast({
        title: "Configuración actualizada",
        description: "Las preferencias de notificación han sido guardadas",
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la configuración",
        variant: "destructive",
      });
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    subscriptions,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchSubscriptions,
    updateSubscription,
  };
};
