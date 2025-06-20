
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface Notification {
  id: string;
  user_id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  read: boolean;
  metadata?: Record<string, any>;
  expires_at?: string;
  created_at: string;
}

interface NotificationSubscription {
  id: string;
  user_id: string;
  event_type: string;
  channel: 'push' | 'email' | 'sms';
  enabled: boolean;
}

interface SecurityAlert {
  id: string;
  inmersion_id: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
  acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
  created_at: string;
}

export const useNotificationSystem = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // Obtener notificaciones del usuario
  const { data: notifications = [], isLoading: isLoadingNotifications } = useQuery({
    queryKey: ['notifications', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!profile?.id,
  });

  // Obtener suscripciones de notificaciones
  const { data: subscriptions = [], isLoading: isLoadingSubscriptions } = useQuery({
    queryKey: ['notification-subscriptions', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data, error } = await supabase
        .from('notification_subscriptions')
        .select('*')
        .eq('user_id', profile.id);

      if (error) throw error;
      return data as NotificationSubscription[];
    },
    enabled: !!profile?.id,
  });

  // Obtener alertas de seguridad
  const { data: securityAlerts = [], isLoading: isLoadingAlerts } = useQuery({
    queryKey: ['security-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_alerts')
        .select(`
          *,
          inmersion:inmersion_id (
            codigo,
            buzo_principal,
            operacion:operacion_id (
              nombre,
              codigo
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as (SecurityAlert & { inmersion: any })[];
    },
    enabled: !!profile?.id,
  });

  // Marcar notificación como leída
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Marcar todas las notificaciones como leídas
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!profile?.id) return;
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', profile.id)
        .eq('read', false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Notificaciones marcadas",
        description: "Todas las notificaciones han sido marcadas como leídas",
      });
    },
  });

  // Reconocer alerta de seguridad
  const acknowledgeAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from('security_alerts')
        .update({
          acknowledged: true,
          acknowledged_by: profile?.id,
          acknowledged_at: new Date().toISOString(),
        })
        .eq('id', alertId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-alerts'] });
      toast({
        title: "Alerta reconocida",
        description: "La alerta de seguridad ha sido reconocida",
      });
    },
  });

  // Actualizar suscripción de notificaciones
  const updateSubscriptionMutation = useMutation({
    mutationFn: async ({ 
      eventType, 
      channel, 
      enabled 
    }: { 
      eventType: string; 
      channel: string; 
      enabled: boolean; 
    }) => {
      if (!profile?.id) return;

      const { error } = await supabase
        .from('notification_subscriptions')
        .upsert({
          user_id: profile.id,
          event_type: eventType,
          channel,
          enabled,
        }, {
          onConflict: 'user_id,event_type,channel'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-subscriptions'] });
    },
  });

  // Crear notificación personalizada
  const createNotificationMutation = useMutation({
    mutationFn: async ({
      userId,
      type,
      title,
      message,
      metadata
    }: {
      userId: string;
      type: string;
      title: string;
      message: string;
      metadata?: Record<string, any>;
    }) => {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          metadata: metadata || {},
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Real-time subscription para notificaciones
  useEffect(() => {
    if (!profile?.id) return;

    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${profile.id}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          
          // Mostrar toast para notificaciones importantes
          if (newNotification.type === 'error' || newNotification.type === 'warning') {
            toast({
              title: newNotification.title,
              description: newNotification.message,
              variant: newNotification.type === 'error' ? "destructive" : "default",
            });
          }

          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'security_alerts',
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['security-alerts'] });
          
          // Notificación crítica para alertas de seguridad
          const alert = payload.new as SecurityAlert;
          if (alert.priority === 'critical' || alert.priority === 'high') {
            toast({
              title: "🚨 Alerta de Seguridad",
              description: `Nueva alerta de tipo ${alert.type}`,
              variant: "destructive",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, queryClient]);

  // Contadores
  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalAlertsCount = securityAlerts.filter(a => !a.acknowledged && (a.priority === 'critical' || a.priority === 'high')).length;

  return {
    notifications,
    subscriptions,
    securityAlerts,
    unreadCount,
    criticalAlertsCount,
    isLoading: isLoadingNotifications || isLoadingSubscriptions || isLoadingAlerts,
    markAsRead: markAsReadMutation.mutateAsync,
    markAllAsRead: markAllAsReadMutation.mutateAsync,
    acknowledgeAlert: acknowledgeAlertMutation.mutateAsync,
    updateSubscription: updateSubscriptionMutation.mutateAsync,
    createNotification: createNotificationMutation.mutateAsync,
    isMarkingAsRead: markAsReadMutation.isPending,
    isAcknowledging: acknowledgeAlertMutation.isPending,
  };
};
