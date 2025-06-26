
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { useAuth } from "@/hooks/useAuth";
import { Usuario } from "@/types/usuario";
import { toast } from "@/hooks/use-toast";

export interface InviteUserOptions {
  email: string;
  rol: string;
  nombre?: string;
  apellido?: string;
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
    const { email, rol, nombre = '', apellido = '', overwriteExisting = false, cancelPrevious = false } = options;
    
    return executeInvite(async () => {
      console.log('Inviting user with options:', options);
      console.log('Current profile:', profile);
      
      // Determinar empresa_id y tipo_empresa basado en el perfil del usuario que invita
      let empresa_id = null;
      let tipo_empresa = null;
      
      if (profile?.salmonera_id) {
        empresa_id = profile.salmonera_id;
        tipo_empresa = 'salmonera';
      } else if (profile?.servicio_id) {
        empresa_id = profile.servicio_id;
        tipo_empresa = 'contratista';
      }
      
      if (!empresa_id) {
        throw new Error('No se pudo determinar la empresa del invitador');
      }
      
      console.log('Empresa info for invitation:', { empresa_id, tipo_empresa });
      
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
      
      // Preparar datos de invitación con información completa de la empresa
      const invitationData = {
        email: email.toLowerCase(),
        nombre: nombre,
        apellido: apellido,
        rol: rol,
        token: token,
        invitado_por: profile?.id,
        empresa_id: empresa_id,
        tipo_empresa: tipo_empresa,
        fecha_expiracion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        estado: 'pendiente'
      };
      
      console.log('Creating invitation with data:', invitationData);
      
      // Guardar invitación en la base de datos
      const { error: dbError } = await supabase
        .from('usuario_invitaciones')
        .insert([invitationData]);

      if (dbError) {
        console.error('Error saving invitation to DB:', dbError);
        throw dbError;
      }

      // Enviar email de invitación
      const { error: emailError } = await supabase.functions.invoke('send-user-invitation', {
        body: {
          email: email,
          rol: rol,
          invitedBy: `${profile?.nombre} ${profile?.apellido}`,
          empresaTipo: tipo_empresa,
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
      } else {
        console.log('Invitation email sent successfully');
      }
      
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      queryClient.invalidateQueries({ queryKey: ['users-by-company'] });
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
