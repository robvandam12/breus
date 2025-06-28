
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { useAuth } from "@/hooks/useAuth";
import { Usuario } from "@/types/usuario";
import { toast } from "@/hooks/use-toast";
import { parseCompanySelection } from "@/components/common/CompanySelector";

export interface InviteUserOptions {
  email: string;
  rol: string;
  nombre?: string;
  apellido?: string;
  empresa_selection: string; // Formato: "salmonera_id" o "contratista_id"
  overwriteExisting?: boolean;
  cancelPrevious?: boolean;
}

export const useUsuarios = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  
  const { execute: executeUpdate } = useAsyncAction({
    successMessage: "Usuario actualizado exitosamente",
    errorMessage: "Error al actualizar usuario"
  });

  const { execute: executeInvite } = useAsyncAction({
    successMessage: "Invitación enviada exitosamente",
    errorMessage: "Error al enviar invitación"
  });

  const { data: usuarios = [], isLoading, error } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usuario')
        .select(`
          *,
          salmonera:salmoneras(nombre, rut)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(user => ({
        ...user,
        contratista: user.servicio_id ? { nombre: 'Contratista', rut: '' } : null
      })) as Usuario[];
    },
  });

  const updateUsuario = async (id: string, userData: any) => {
    return executeUpdate(async () => {
      const { error } = await supabase
        .from('usuario')
        .update(userData)
        .eq('usuario_id', id);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    });
  };

  const inviteUsuario = async (options: InviteUserOptions) => {
    const { email, rol, nombre = '', apellido = '', empresa_selection, overwriteExisting = false, cancelPrevious = false } = options;
    
    return executeInvite(async () => {
      console.log('Inviting user with options:', options);
      console.log('Current profile:', profile);
      
      // Parsear selección de empresa
      const companyInfo = parseCompanySelection(empresa_selection);
      if (!companyInfo) {
        throw new Error('Debe seleccionar una empresa válida');
      }
      
      console.log('Company info for invitation:', companyInfo);
      
      // Si se debe cancelar invitaciones previas, hacerlo primero
      if (cancelPrevious) {
        const { error: cancelError } = await supabase
          .from('usuario_invitaciones')
          .update({ 
            estado: 'cancelada',
            updated_at: new Date().toISOString()
          })
          .eq('email', email.toLowerCase())
          .eq('estado', 'pendiente')
          .eq('invitado_por', profile?.id);

        if (cancelError) {
          console.warn('Error canceling previous invitations:', cancelError);
        } else {
          console.log('Previous invitations canceled for email:', email);
        }
      }

      // Enviar invitación usando la edge function
      const { error: emailError } = await supabase.functions.invoke('send-user-invitation', {
        body: {
          email: email,
          nombre: nombre,
          apellido: apellido,
          rol: rol,
          empresa_id: companyInfo.id,
          tipo_empresa: companyInfo.tipo,
          invitado_por: profile?.id
        }
      });

      if (emailError) {
        console.error('Error sending invitation:', emailError);
        throw emailError;
      }

      console.log('Invitation sent successfully');
      
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      queryClient.invalidateQueries({ queryKey: ['users-by-company'] });
    });
  };

  const deleteUsuario = async (id: string) => {
    console.log('useUsuarios: deleteUsuario called with ID:', id);
    
    try {
      // Llamar a la Edge Function para eliminar el usuario
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { userId: id }
      });

      if (error) {
        console.error('useUsuarios: Error calling delete-user function:', error);
        throw new Error(`Error eliminando usuario: ${error.message}`);
      }

      if (!data?.success) {
        console.error('useUsuarios: Delete function returned failure:', data);
        throw new Error(data?.error || 'Error eliminando usuario');
      }

      console.log('useUsuarios: User deleted successfully via Edge Function');
      
      // Invalidar queries para refrescar los datos
      await queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      await queryClient.invalidateQueries({ queryKey: ['users-by-company'] });
      
      console.log('useUsuarios: Queries invalidated');

      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado exitosamente.",
      });

    } catch (error: any) {
      console.error('useUsuarios: deleteUsuario error:', error);
      toast({
        title: "Error",
        description: `Error al eliminar usuario: ${error.message}`,
        variant: "destructive",
      });
      throw error; // Re-throw para que el componente pueda manejarlo
    }
  };

  return {
    usuarios,
    isLoading,
    error,
    updateUsuario,
    inviteUsuario,
    deleteUsuario
  };
};
