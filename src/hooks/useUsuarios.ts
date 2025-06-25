
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { useAuth } from "@/hooks/useAuth";
import { Usuario } from "@/types/usuario";
import { toast } from "@/hooks/use-toast";

export interface InviteUserOptions {
  email: string;
  rol: string;
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

  const { execute: executeDelete } = useAsyncAction({
    successMessage: "Usuario eliminado exitosamente",
    errorMessage: "Error al eliminar usuario"
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
    const { email, rol, overwriteExisting = false, cancelPrevious = false } = options;
    
    return executeInvite(async () => {
      console.log('Inviting user with options:', options);
      
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

      // Generar token único para la invitación
      const token = crypto.randomUUID();
      
      // Guardar invitación en la base de datos
      const { error: dbError } = await supabase
        .from('usuario_invitaciones')
        .insert([{
          email: email.toLowerCase(),
          rol: rol,
          token: token,
          invitado_por: profile?.id,
          fecha_expiracion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          estado: 'pendiente',
          nombre: '',
          apellido: ''
        }]);

      if (dbError) throw dbError;

      // Enviar email de invitación
      const { error: emailError } = await supabase.functions.invoke('send-user-invitation', {
        body: {
          email: email,
          rol: rol,
          invitedBy: `${profile?.nombre} ${profile?.apellido}`,
          token: token
        }
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
        toast({
          title: "Advertencia",
          description: "Invitación creada pero el email no se pudo enviar. Verifique la configuración de Resend.",
          variant: "destructive"
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    });
  };

  const deleteUsuario = async (id: string) => {
    return executeDelete(async () => {
      const { error } = await supabase
        .from('usuario')
        .delete()
        .eq('usuario_id', id);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    });
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
