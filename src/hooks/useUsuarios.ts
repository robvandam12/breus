
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { Usuario } from "@/types/usuario";

export const useUsuarios = () => {
  const queryClient = useQueryClient();
  
  const { execute: executeUpdate } = useAsyncAction({
    successMessage: "Usuario actualizado exitosamente",
    errorMessage: "Error al actualizar usuario"
  });

  const { execute: executeInvite } = useAsyncAction({
    successMessage: "Usuario invitado exitosamente",
    errorMessage: "Error al invitar usuario"
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

  const inviteUsuario = async (userData: any) => {
    return executeInvite(async () => {
      // Implementar lógica de invitación
      console.log('Inviting user:', userData);
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
