
import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { toast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useBuzoNotifications = () => {
  const { profile, user } = useAuth();

  useEffect(() => {
    if (!user || profile?.role !== 'buzo') return;

    // Suscribirse a notificaciones en tiempo real
    const channel = supabase
      .channel('buzo_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const notification = payload.new;
          handleNewNotification(notification);
        }
      )
      .subscribe();

    // Verificar notificaciones pendientes al cargar
    checkPendingNotifications();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, profile]);

  const handleNewNotification = (notification: any) => {
    const { type, title, message, metadata } = notification;

    // Configurar el toast según el tipo de notificación
    const toastConfig = {
      title: title || 'Nueva notificación',
      description: message,
    };

    switch (type) {
      case 'operation_assignment':
        toast({
          ...toastConfig,
          title: '🎯 Nueva Asignación',
        });
        break;
      
      case 'bitacora_available':
        toast({
          ...toastConfig,
          title: '📝 Bitácora Disponible',
        });
        break;
      
      case 'operation_reminder':
        toast({
          ...toastConfig,
          title: '⏰ Recordatorio de Operación',
        });
        break;
      
      case 'company_assignment':
        toast({
          ...toastConfig,
          title: '🏢 Asignado a Empresa',
        });
        break;
      
      default:
        toast(toastConfig);
    }
  };

  const checkPendingNotifications = async () => {
    if (!user) return;

    try {
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('read', false)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Últimas 24 horas
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Mostrar notificaciones urgentes
      const urgentNotifications = notifications?.filter(n => 
        n.metadata && 
        typeof n.metadata === 'object' && 
        'notification_type' in n.metadata &&
        n.metadata.notification_type === 'urgent'
      ) || [];

      urgentNotifications.slice(0, 3).forEach((notification, index) => {
        setTimeout(() => {
          handleNewNotification(notification);
        }, index * 1000);
      });

    } catch (error) {
      console.error('Error checking pending notifications:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return {
    markAsRead,
    checkPendingNotifications
  };
};
