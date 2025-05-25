
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ContractorInvitation {
  id: string;
  salmonera_id: string;
  empresa_nombre: string;
  empresa_rut: string;
  admin_email: string;
  admin_nombre: string;
  status: 'pending' | 'accepted' | 'rejected';
  invited_at: string;
  responded_at?: string;
  token: string;
}

export interface InviteContractorData {
  empresa_nombre: string;
  empresa_rut: string;
  admin_email: string;
  admin_nombre: string;
  direccion: string;
  telefono?: string;
  especialidades?: string[];
}

export const useInvitations = () => {
  const queryClient = useQueryClient();

  // Fetch pending invitations using direct table query
  const { data: invitations = [], isLoading } = useQuery({
    queryKey: ['contractor-invitations'],
    queryFn: async () => {
      console.log('Fetching contractor invitations...');
      
      // Direct query to contractor_invitations table with proper type casting
      const { data, error } = await supabase
        .from('contractor_invitations' as any)
        .select('*')
        .order('invited_at', { ascending: false }) as any;
        
      if (error) {
        console.error('Error fetching invitations:', error);
        return [];
      }

      return (data || []) as unknown as ContractorInvitation[];
    },
  });

  // Invite contractor mutation
  const inviteContractorMutation = useMutation({
    mutationFn: async (invitationData: InviteContractorData) => {
      console.log('Inviting contractor:', invitationData);
      
      // Generate invitation token
      const token = crypto.randomUUID();
      
      // Create contractor invitation record using direct query
      const { data: invitation, error: inviteError } = await supabase
        .from('contractor_invitations' as any)
        .insert([{
          empresa_nombre: invitationData.empresa_nombre,
          empresa_rut: invitationData.empresa_rut,
          admin_email: invitationData.admin_email,
          admin_nombre: invitationData.admin_nombre,
          token,
          status: 'pending'
        }])
        .select()
        .single() as any;

      if (inviteError) {
        console.error('Error creating invitation:', inviteError);
        throw inviteError;
      }

      // Create preliminary contractor record
      const { data: contractor, error: contractorError } = await supabase
        .from('contratistas')
        .insert([{
          nombre: invitationData.empresa_nombre,
          rut: invitationData.empresa_rut,
          direccion: invitationData.direccion,
          telefono: invitationData.telefono,
          email: invitationData.admin_email,
          especialidades: invitationData.especialidades,
          estado: 'pendiente_activacion'
        }])
        .select()
        .single();

      if (contractorError) {
        console.error('Error creating contractor:', contractorError);
        throw contractorError;
      }

      // Send invitation email (through edge function)
      const { error: emailError } = await supabase.functions.invoke('send-contractor-invitation', {
        body: {
          email: invitationData.admin_email,
          admin_nombre: invitationData.admin_nombre,
          empresa_nombre: invitationData.empresa_nombre,
          token
        }
      });

      if (emailError) {
        console.error('Error sending invitation email:', emailError);
        // Don't throw here, invitation is created even if email fails
      }

      return { invitation, contractor };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractor-invitations'] });
      queryClient.invalidateQueries({ queryKey: ['contratistas'] });
      toast({
        title: "Invitación enviada",
        description: "Se ha enviado la invitación al administrador de la empresa de servicio.",
      });
    },
    onError: (error) => {
      console.error('Error inviting contractor:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la invitación. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  // Accept invitation mutation
  const acceptInvitationMutation = useMutation({
    mutationFn: async ({ token, userData }: { token: string; userData: any }) => {
      console.log('Accepting invitation with token:', token);
      
      // Find invitation using direct query with proper type casting
      const { data: invitationData, error: findError } = await supabase
        .from('contractor_invitations' as any)
        .select('*')
        .eq('token', token)
        .eq('status', 'pending')
        .single() as any;

      if (findError || !invitationData) {
        throw new Error('Invitación no válida o ya procesada');
      }

      const invitation = invitationData as unknown as ContractorInvitation;

      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: invitation.admin_email,
        password: userData.password,
        options: {
          data: {
            nombre: userData.nombre,
            apellido: userData.apellido,
            role: 'admin_servicio'
          }
        }
      });

      if (authError) {
        console.error('Error creating user:', authError);
        throw authError;
      }

      // Update invitation status using direct query
      const { error: updateError } = await supabase
        .from('contractor_invitations' as any)
        .update({ 
          status: 'accepted',
          responded_at: new Date().toISOString()
        })
        .eq('id', invitation.id) as any;

      if (updateError) {
        console.error('Error updating invitation:', updateError);
        throw updateError;
      }

      // Activate contractor
      const { error: activateError } = await supabase
        .from('contratistas')
        .update({ estado: 'activo' })
        .eq('rut', invitation.empresa_rut);

      if (activateError) {
        console.error('Error activating contractor:', activateError);
        throw activateError;
      }

      return authData;
    },
    onSuccess: () => {
      toast({
        title: "Cuenta creada exitosamente",
        description: "Bienvenido a Breus. Tu empresa ha sido activada.",
      });
    },
    onError: (error: any) => {
      console.error('Error accepting invitation:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo procesar la invitación.",
        variant: "destructive",
      });
    },
  });

  return {
    invitations,
    isLoading,
    inviteContractor: inviteContractorMutation.mutateAsync,
    acceptInvitation: acceptInvitationMutation.mutateAsync,
    isInviting: inviteContractorMutation.isPending,
    isAccepting: acceptInvitationMutation.isPending,
  };
};
