
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export interface Invitation {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
  token: string;
  invitado_por: string;
  empresa_id?: string;
  tipo_empresa?: string;
  estado: 'pendiente' | 'aceptada' | 'expirada' | 'cancelada';
  fecha_expiracion: string;
  fecha_invitacion?: string;
  created_at: string;
  updated_at: string;
}

export const useInvitationManagement = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  
  const { execute: executeCancel } = useAsyncAction({
    successMessage: "Invitación cancelada exitosamente",
    errorMessage: "Error al cancelar invitación"
  });

  const { execute: executeResend } = useAsyncAction({
    successMessage: "Invitación reenviada exitosamente", 
    errorMessage: "Error al reenviar invitación"
  });

  // Obtener invitaciones
  const { data: invitations = [], isLoading, error } = useQuery({
    queryKey: ['invitations', profile?.id, profile?.salmonera_id, profile?.servicio_id],
    queryFn: async () => {
      if (!profile?.id) {
        console.log('No profile ID available');
        return [];
      }
      
      console.log('Fetching invitations for user:', {
        userId: profile.id,
        role: profile.role,
        salmoneraId: profile.salmonera_id,
        servicioId: profile.servicio_id
      });
      
      let query = supabase
        .from('usuario_invitaciones')
        .select('*')
        .eq('invitado_por', profile.id)
        .order('created_at', { ascending: false });

      // Para usuarios con rol específico, no aplicar filtros adicionales por empresa
      // ya que queremos ver TODAS las invitaciones que han enviado
      if (profile.role === 'superuser') {
        console.log('Superuser: fetching all invitations');
        // Superuser ve todas sus invitaciones sin filtros adicionales
      } else if (profile.role === 'admin_salmonera' && profile.salmonera_id) {
        console.log('Admin salmonera: fetching invitations for salmonera_id:', profile.salmonera_id);
        // Filtrar por invitaciones que pertenezcan a su salmonera O que no tengan empresa_id asignado (legacy)
        query = query.or(`empresa_id.eq.${profile.salmonera_id},empresa_id.is.null`);
      } else if (profile.role === 'admin_servicio' && profile.servicio_id) {
        console.log('Admin servicio: fetching invitations for servicio_id:', profile.servicio_id);
        // Filtrar por invitaciones que pertenezcan a su servicio O que no tengan empresa_id asignado (legacy)
        query = query.or(`empresa_id.eq.${profile.servicio_id},empresa_id.is.null`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching invitations:', error);
        throw error;
      }
      
      console.log('Invitations fetched:', {
        count: data?.length || 0,
        sampleData: data?.[0],
        allData: data
      });
      
      return (data || []) as Invitation[];
    },
    enabled: !!profile?.id,
  });

  // Cancelar invitación
  const cancelInvitation = async (invitationId: string) => {
    return executeCancel(async () => {
      console.log('Canceling invitation:', invitationId);
      
      const { error } = await supabase
        .from('usuario_invitaciones')
        .update({ 
          estado: 'cancelada',
          updated_at: new Date().toISOString()
        })
        .eq('id', invitationId)
        .eq('invitado_por', profile?.id); // Seguridad adicional

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['users-by-company'] });
    });
  };

  // Reenviar invitación
  const resendInvitation = async (invitationId: string) => {
    return executeResend(async () => {
      console.log('Resending invitation:', invitationId);
      
      // Obtener datos de la invitación
      const { data: invitation, error: fetchError } = await supabase
        .from('usuario_invitaciones')
        .select('*')
        .eq('id', invitationId)
        .eq('invitado_por', profile?.id)
        .single();

      if (fetchError || !invitation) {
        throw new Error('Invitación no encontrada');
      }

      // Enviar usando la edge function actualizada
      const { error: emailError } = await supabase.functions.invoke('send-user-invitation', {
        body: {
          email: invitation.email,
          nombre: invitation.nombre || '',
          apellido: invitation.apellido || '',
          rol: invitation.rol,
          empresa_id: invitation.empresa_id,
          tipo_empresa: invitation.tipo_empresa,
          invitado_por: profile?.id
        }
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
        throw emailError;
      }

      // Actualizar fecha de reenvío
      const { error: updateError } = await supabase
        .from('usuario_invitaciones')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('id', invitationId);

      if (updateError) {
        console.warn('Error updating invitation timestamp:', updateError);
      }
      
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    });
  };

  // Obtener estadísticas
  const getInvitationStats = () => {
    const total = invitations.length;
    const pending = invitations.filter(inv => inv.estado === 'pendiente').length;
    const accepted = invitations.filter(inv => inv.estado === 'aceptada').length;
    const expired = invitations.filter(inv => {
      const now = new Date();
      const expiration = new Date(inv.fecha_expiracion);
      return inv.estado === 'pendiente' && expiration < now;
    }).length;
    const canceled = invitations.filter(inv => inv.estado === 'cancelada').length;

    return { total, pending, accepted, expired, canceled };
  };

  return {
    invitations,
    isLoading,
    error,
    cancelInvitation,
    resendInvitation,
    getInvitationStats
  };
};
