
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useUsuarios = () => {
  const queryClient = useQueryClient();

  const { data: usuarios = [], isLoading, error } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usuario')
        .select(`
          *,
          salmonera:salmonera_id(nombre, rut),
          servicio:servicio_id(nombre, rut)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching usuarios:', error);
        throw error;
      }
      
      return data.map(usuario => ({
        ...usuario,
        empresa_nombre: usuario.salmonera?.nombre || usuario.servicio?.nombre || 'Sin empresa',
        empresa_tipo: usuario.salmonera ? 'salmonera' : usuario.servicio ? 'contratista' : 'sin_empresa'
      }));
    },
  });

  const updateUsuario = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: updatedData, error } = await supabase
        .from('usuario')
        .update(data)
        .eq('usuario_id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast({
        title: "Usuario actualizado",
        description: "El usuario ha sido actualizado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error updating usuario:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario.",
        variant: "destructive",
      });
    },
  });

  const getUserStats = async (userId: string) => {
    try {
      // Obtener estadísticas de HPTs
      const { data: hptStats } = await supabase
        .from('hpt')
        .select('id')
        .eq('user_id', userId);

      // Obtener estadísticas de Anexos Bravo
      const { data: anexoStats } = await supabase
        .from('anexo_bravo')
        .select('id')
        .eq('user_id', userId);

      // Obtener estadísticas de inmersiones
      const { data: inmersionStats } = await supabase
        .from('inmersion')
        .select('inmersion_id')
        .or(`buzo_principal_id.eq.${userId},supervisor_id.eq.${userId}`);

      // Obtener estadísticas de bitácoras
      const { data: bitacoraStats } = await supabase
        .from('bitacora_supervisor')
        .select('bitacora_id')
        .eq('aprobada_por', userId);

      // Obtener última actividad
      const { data: lastActivity } = await supabase
        .from('usuario_actividad')
        .select('created_at')
        .eq('usuario_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      return {
        hpts_created: hptStats?.length || 0,
        anexos_created: anexoStats?.length || 0,
        inmersiones: inmersionStats?.length || 0,
        bitacoras: bitacoraStats?.length || 0,
        last_activity: lastActivity?.created_at || null
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        hpts_created: 0,
        anexos_created: 0,
        inmersiones: 0,
        bitacoras: 0,
        last_activity: null
      };
    }
  };

  return {
    usuarios,
    isLoading,
    error,
    updateUsuario: updateUsuario.mutateAsync,
    getUserStats,
  };
};
