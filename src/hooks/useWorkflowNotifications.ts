
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface WorkflowNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  metadata?: any;
  expires_at?: string;
  created_at: string;
}

export const useWorkflowNotifications = () => {
  const queryClient = useQueryClient();

  // Fetch notificaciones
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['workflow-notifications'],
    queryFn: async () => {
      console.log('Fetching workflow notifications...');
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        throw error;
      }

      return (data || []).map((item: any): WorkflowNotification => ({
        id: item.id,
        user_id: item.user_id,
        title: item.title,
        message: item.message,
        type: item.type,
        read: item.read,
        metadata: item.metadata,
        expires_at: item.expires_at,
        created_at: item.created_at
      }));
    },
  });

  // Create notification
  const createNotificationMutation = useMutation({
    mutationFn: async (data: Omit<WorkflowNotification, 'id' | 'created_at' | 'read'>) => {
      console.log('Creating notification:', data);
      
      const { data: result, error } = await supabase
        .from('notifications')
        .insert([{
          ...data,
          read: false
        }])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-notifications'] });
      toast({
        title: "Notificación creada",
        description: "La notificación ha sido enviada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating notification:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la notificación.",
        variant: "destructive",
      });
    },
  });

  // Mark as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      console.log('Marking notification as read:', notificationId);
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-notifications'] });
    },
    onError: (error) => {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "No se pudo marcar la notificación como leída.",
        variant: "destructive",
      });
    },
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    isLoading,
    createNotification: createNotificationMutation.mutateAsync,
    markAsRead: markAsReadMutation.mutateAsync,
    unreadCount
  };
};
