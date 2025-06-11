
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface BuzoNotification {
  id: string;
  type: 'operacion_asignada' | 'bitacora_pendiente' | 'operacion_proximidad' | 'empresa_asignada';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  created_at: string;
}

export const useBuzoNotifications = () => {
  const { user, profile } = useAuth();
  const [notifications, setNotifications] = useState<BuzoNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const createNotification = async (notification: Omit<BuzoNotification, 'id' | 'read' | 'created_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          user_id: user.id,
          title: notification.title,
          message: notification.message,
          type: 'info',
          metadata: {
            notification_type: notification.type,
            data: notification.data
          }
        }])
        .select()
        .single();

      if (error) throw error;

      // Mostrar toast para notificaciones importantes
      if (notification.type === 'bitacora_pendiente' || notification.type === 'operacion_proximidad') {
        toast(notification.title, {
          description: notification.message,
        });
      }

      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
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

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const buzoNotifications: BuzoNotification[] = (data || []).map(item => {
        const metadata = typeof item.metadata === 'object' && item.metadata !== null ? item.metadata as any : {};
        return {
          id: item.id,
          type: metadata.notification_type || 'operacion_asignada',
          title: item.title,
          message: item.message,
          data: metadata.data,
          read: item.read,
          created_at: item.created_at
        };
      });

      setNotifications(buzoNotifications);
      setUnreadCount(buzoNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Función para emitir notificaciones específicas de buzo
  const emitOperacionAsignada = async (operacionId: string, operacionNombre: string) => {
    await createNotification({
      type: 'operacion_asignada',
      title: 'Nueva Operación Asignada',
      message: `Has sido asignado a la operación: ${operacionNombre}`,
      data: { operacionId }
    });
  };

  const emitBitacoraPendiente = async (inmersionId: string, operacionNombre: string) => {
    await createNotification({
      type: 'bitacora_pendiente',
      title: 'Bitácora Lista para Completar',
      message: `El supervisor ha completado su bitácora para la operación ${operacionNombre}. Ahora puedes crear tu bitácora.`,
      data: { inmersionId }
    });
  };

  const emitOperacionProximidad = async (operacionId: string, operacionNombre: string, dias: number) => {
    const mensaje = dias === 0 
      ? `La operación ${operacionNombre} es HOY` 
      : `La operación ${operacionNombre} es en ${dias} día${dias > 1 ? 's' : ''}`;

    await createNotification({
      type: 'operacion_proximidad',
      title: 'Operación Próxima',
      message: mensaje,
      data: { operacionId, dias }
    });
  };

  const emitEmpresaAsignada = async (empresaNombre: string, tipoEmpresa: 'salmonera' | 'servicio') => {
    await createNotification({
      type: 'empresa_asignada',
      title: 'Asignado a Empresa',
      message: `Has sido asignado a ${tipoEmpresa === 'salmonera' ? 'la salmonera' : 'el servicio'}: ${empresaNombre}`,
      data: { empresaNombre, tipoEmpresa }
    });
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('buzo-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    fetchNotifications,
    emitOperacionAsignada,
    emitBitacoraPendiente,
    emitOperacionProximidad,
    emitEmpresaAsignada
  };
};
