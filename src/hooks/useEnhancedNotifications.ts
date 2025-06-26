
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface EnhancedNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  metadata?: {
    inmersion_id?: string;
    inmersion_code?: string;
    priority?: string;
    link?: string;
    role?: string;
  };
  expires_at?: string;
  created_at: string;
}

export const useEnhancedNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Obtener notificaciones del usuario
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['enhanced-notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as EnhancedNotification[];
    },
    enabled: !!user?.id,
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
      queryClient.invalidateQueries({ queryKey: ['enhanced-notifications'] });
    },
  });

  // Marcar todas como leídas
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) return;
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-notifications'] });
      toast({
        title: "Notificaciones marcadas",
        description: "Todas las notificaciones han sido marcadas como leídas",
      });
    },
  });

  // Eliminar notificación
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-notifications'] });
    },
  });

  // Suscripción en tiempo real
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('user-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as EnhancedNotification;
          
          // Actualizar cache
          queryClient.setQueryData(
            ['enhanced-notifications', user.id],
            (old: EnhancedNotification[] = []) => [newNotification, ...old]
          );
          
          // Mostrar toast para notificaciones de alta prioridad
          if (newNotification.metadata?.priority === 'high' || 
              ['inmersion_assignment', 'bitacora_supervisor_pending', 'bitacora_buzo_ready'].includes(newNotification.type)) {
            toast({
              title: newNotification.title,
              description: newNotification.message,
              duration: 5000,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const priorityNotifications = notifications.filter(n => 
    n.metadata?.priority === 'high' && !n.read
  );

  return {
    notifications,
    unreadCount,
    priorityNotifications,
    isLoading,
    markAsRead: markAsReadMutation.mutateAsync,
    markAllAsRead: markAllAsReadMutation.mutateAsync,
    deleteNotification: deleteNotificationMutation.mutateAsync,
  };
};
