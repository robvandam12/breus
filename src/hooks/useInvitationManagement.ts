
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

      // Aplicar filtros adicionales según el tipo de empresa del usuario
      if (profile.role !== 'superuser') {
        if (profile.salmonera_id) {
          console.log('Filtering by salmonera_id:', profile.salmonera_id);
          query = query.eq('empresa_id', profile.salmonera_id).eq('tipo_empresa', 'salmonera');
        } else if (profile.servicio_id) {
          console.log('Filtering by servicio_id:', profile.servicio_id);
          query = query.eq('empresa_id', profile.servicio_id).eq('tipo_empresa', 'contratista');
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching invitations:', error);
        throw error;
      }
      
      console.log('Invitations fetched:', {
        count: data?.length || 0,
        sampleData: data?.[0]
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

      // Generar nuevo token y extender expiración
      const newToken = crypto.randomUUID();
      const newExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      // Actualizar invitación
      const { error: updateError } = await supabase
        .from('usuario_invitaciones')
        .update({
          token: newToken,
          fecha_expiracion: newExpiration,
          estado: 'pendiente',
          updated_at: new Date().toISOString()
        })
        .eq('id', invitationId);

      if (updateError) throw updateError;

      // Reenviar email
      const { error: emailError } = await supabase.functions.invoke('send-user-invitation', {
        body: {
          email: invitation.email,
          rol: invitation.rol,
          invitedBy: `${profile?.nombre} ${profile?.apellido}`,
          token: newToken
        }
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
        // No fallar completamente si el email falla
        toast({
          title: "Advertencia",
          description: "Invitación actualizada pero el email podría no haberse enviado.",
          variant: "destructive"
        });
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
