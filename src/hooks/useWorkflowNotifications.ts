
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface WorkflowNotification {
  id: string;
  tipo: string;
  titulo: string;
  mensaje: string;
  usuario_id: string;
  read: boolean;
  created_at: string;
  expires_at: string;
  metadata?: any;
}

export const useWorkflowNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['workflow-notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      return (data || []).map(item => ({
        id: item.id,
        tipo: item.type,
        titulo: item.title,
        mensaje: item.message,
        usuario_id: item.user_id,
        read: item.read,
        created_at: item.created_at,
        expires_at: item.expires_at,
        metadata: item.metadata
      })) as WorkflowNotification[];
    },
    enabled: !!user?.id,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-notifications'] });
    },
  });

  const createNotification = useMutation({
    mutationFn: async (notification: Omit<WorkflowNotification, 'id' | 'created_at'>) => {
      const { error } = await supabase
        .from('notifications')
        .insert([{
          type: notification.tipo,
          title: notification.titulo,
          message: notification.mensaje,
          user_id: notification.usuario_id,
          read: notification.read,
          expires_at: notification.expires_at,
          metadata: notification.metadata
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-notifications'] });
    },
  });

  return {
    notifications,
    isLoading,
    markAsRead: markAsReadMutation.mutate,
    createNotification: createNotification.mutate,
    unreadCount: notifications.filter(n => !n.read).length,
  };
};
