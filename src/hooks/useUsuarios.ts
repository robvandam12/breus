
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { useAuth } from "@/hooks/useAuth";
import { Usuario } from "@/types/usuario";

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
      
      // Transform data to match Usuario interface
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

  const inviteUsuario = async (userData: { email: string; rol: string }) => {
    return executeInvite(async () => {
      console.log('Inviting user:', userData);
      
      // Generar token único para la invitación
      const token = crypto.randomUUID();
      
      // Guardar invitación en la base de datos usando la tabla real
      const { error: dbError } = await supabase
        .from('usuario_invitaciones')
        .insert([{
          email: userData.email,
          rol: userData.rol,
          token: token,
          invitado_por: profile?.usuario_id,
          fecha_expiracion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          estado: 'pendiente'
        }]);

      if (dbError) throw dbError;

      // Enviar email de invitación
      const { error: emailError } = await supabase.functions.invoke('send-user-invitation', {
        body: {
          email: userData.email,
          rol: userData.rol,
          invitedBy: `${profile?.nombre} ${profile?.apellido}`,
          token: token
        }
      });

      if (emailError) throw emailError;
      
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
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
