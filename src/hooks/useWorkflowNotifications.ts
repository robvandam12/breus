
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface WorkflowNotification {
  id: string;
  tipo: 'inmersion_completada' | 'bitacora_supervisor_pendiente' | 'bitacora_buzo_pendiente' | 'aprobacion_requerida';
  titulo: string;
  mensaje: string;
  usuario_id: string;
  inmersion_id?: string;
  operacion_id?: string;
  leida: boolean;
  fecha_creacion: string;
  metadata?: any;
}

export const useWorkflowNotifications = (userId?: string) => {
  const queryClient = useQueryClient();

  // Obtener notificaciones del usuario
  const { data: notificaciones = [], isLoading } = useQuery({
    queryKey: ['workflow-notifications', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as WorkflowNotification[];
    },
    enabled: !!userId,
  });

  // Crear notificación de inmersión completada
  const notifyInmersionCompleted = useMutation({
    mutationFn: async ({ 
      inmersionId, 
      operacionId, 
      adminSalmoneraId, 
      adminServicioId,
      supervisorId 
    }: {
      inmersionId: string;
      operacionId: string;
      adminSalmoneraId: string;
      adminServicioId?: string;
      supervisorId: string;
    }) => {
      const notifications = [
        // Notificar a admin salmonera
        {
          user_id: adminSalmoneraId,
          type: 'inmersion_completada',
          title: 'Inmersión Completada',
          message: 'Una inmersión ha sido completada y requiere seguimiento.',
          metadata: { inmersion_id: inmersionId, operacion_id: operacionId }
        },
        // Notificar a supervisor para completar bitácora
        {
          user_id: supervisorId,
          type: 'bitacora_supervisor_pendiente',
          title: 'Bitácora Supervisor Pendiente',
          message: 'Debe completar la bitácora de supervisor para la inmersión.',
          metadata: { inmersion_id: inmersionId, operacion_id: operacionId }
        }
      ];

      // Agregar notificación a admin servicio si existe
      if (adminServicioId) {
        notifications.push({
          user_id: adminServicioId,
          type: 'inmersion_completada',
          title: 'Inmersión Completada',
          message: 'Una inmersión ha sido completada en su operación.',
          metadata: { inmersion_id: inmersionId, operacion_id: operacionId }
        });
      }

      const { data, error } = await supabase
        .from('notifications')
        .insert(notifications);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-notifications'] });
    },
  });

  // Notificar a buzos para completar bitácora
  const notifyBuzosForBitacora = useMutation({
    mutationFn: async ({ 
      inmersionId, 
      buzoIds,
      supervisorBitacoraData 
    }: {
      inmersionId: string;
      buzoIds: string[];
      supervisorBitacoraData: any;
    }) => {
      const notifications = buzoIds.map(buzoId => ({
        user_id: buzoId,
        type: 'bitacora_buzo_pendiente',
        title: 'Bitácora Buzo Pendiente',
        message: 'Debe completar su bitácora de buzo con la información pre-rellenada.',
        metadata: { 
          inmersion_id: inmersionId, 
          supervisor_data: supervisorBitacoraData 
        }
      }));

      const { data, error } = await supabase
        .from('notifications')
        .insert(notifications);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-notifications'] });
    },
  });

  // Solicitar aprobación final
  const requestFinalApproval = useMutation({
    mutationFn: async ({ 
      inmersionId, 
      operacionId,
      adminSalmoneraId, 
      adminServicioId 
    }: {
      inmersionId: string;
      operacionId: string;
      adminSalmoneraId: string;
      adminServicioId?: string;
    }) => {
      const notifications = [
        {
          user_id: adminSalmoneraId,
          type: 'aprobacion_requerida',
          title: 'Aprobación Requerida',
          message: 'Las bitácoras han sido completadas y requieren aprobación final.',
          metadata: { inmersion_id: inmersionId, operacion_id: operacionId }
        }
      ];

      if (adminServicioId) {
        notifications.push({
          user_id: adminServicioId,
          type: 'aprobacion_requerida',
          title: 'Aprobación Requerida',
          message: 'Las bitácoras han sido completadas y requieren aprobación final.',
          metadata: { inmersion_id: inmersionId, operacion_id: operacionId }
        });
      }

      const { data, error } = await supabase
        .from('notifications')
        .insert(notifications);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-notifications'] });
    },
  });

  // Marcar notificación como leída
  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-notifications'] });
    },
  });

  return {
    notificaciones,
    isLoading,
    notifyInmersionCompleted: notifyInmersionCompleted.mutateAsync,
    notifyBuzosForBitacora: notifyBuzosForBitacora.mutateAsync,
    requestFinalApproval: requestFinalApproval.mutateAsync,
    markAsRead: markAsRead.mutateAsync,
  };
};
