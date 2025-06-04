
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Tipos básicos simplificados para evitar recursión
export interface OperacionBasica {
  id: string;
  codigo: string;
  nombre: string;
  sitio_id: string;
  servicio_id: string;
  salmonera_id: string;
  contratista_id: string;
  fecha_inicio: string;
  fecha_fin?: string;
  tareas?: string;
  estado: 'activa' | 'pausada' | 'completada' | 'cancelada' | 'eliminada';
  equipo_buceo_id?: string;
  created_at: string;
  updated_at: string;
}

export interface OperacionConRelaciones extends OperacionBasica {
  salmoneras?: { nombre: string };
  sitios?: { nombre: string };
  contratistas?: { nombre: string };
}

export interface OperacionFormData {
  codigo: string;
  nombre: string;
  sitio_id: string;
  servicio_id: string;
  salmonera_id: string;
  contratista_id: string;
  fecha_inicio: string;
  fecha_fin?: string;
  tareas?: string;
  estado: 'activa' | 'pausada' | 'completada' | 'cancelada' | 'eliminada';
}

export const useOperaciones = () => {
  const queryClient = useQueryClient();

  // Fetch operaciones
  const { data: operaciones = [], isLoading } = useQuery({
    queryKey: ['operaciones'],
    queryFn: async () => {
      console.log('Fetching operaciones...');
      const { data, error } = await supabase
        .from('operacion')
        .select(`
          *,
          salmoneras:salmonera_id (nombre),
          sitios:sitio_id (nombre),
          contratistas:contratista_id (nombre)
        `)
        .neq('estado', 'eliminada')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching operaciones:', error);
        throw error;
      }

      return (data || []).map((op: any): OperacionConRelaciones => ({
        ...op,
        estado: (['activa', 'pausada', 'completada', 'cancelada', 'eliminada'].includes(op.estado) 
          ? op.estado 
          : 'activa') as 'activa' | 'pausada' | 'completada' | 'cancelada' | 'eliminada'
      }));
    },
  });

  // Create operacion
  const createOperacionMutation = useMutation({
    mutationFn: async (data: OperacionFormData) => {
      console.log('Creating operacion:', data);
      
      if (!data.codigo || !data.nombre) {
        throw new Error('Código y nombre son campos requeridos');
      }

      const { data: result, error } = await supabase
        .from('operacion')
        .insert([{
          codigo: data.codigo,
          nombre: data.nombre,
          sitio_id: data.sitio_id || null,
          servicio_id: data.servicio_id || null,
          salmonera_id: data.salmonera_id || null,
          contratista_id: data.contratista_id || null,
          fecha_inicio: data.fecha_inicio,
          fecha_fin: data.fecha_fin || null,
          tareas: data.tareas || null,
          estado: data.estado || 'activa'
        }])
        .select(`
          *,
          salmoneras:salmonera_id (nombre),
          sitios:sitio_id (nombre),
          contratistas:contratista_id (nombre)
        `)
        .single();

      if (error) {
        console.error('Error creating operacion:', error);
        throw error;
      }

      return {
        ...result,
        estado: (['activa', 'pausada', 'completada', 'cancelada', 'eliminada'].includes(result.estado) 
          ? result.estado 
          : 'activa') as 'activa' | 'pausada' | 'completada' | 'cancelada' | 'eliminada'
      } as OperacionConRelaciones;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({
        title: "Operación creada",
        description: "La operación ha sido creada exitosamente.",
      });
    },
    onError: (error: Error) => {
      console.error('Error creating operacion:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la operación.",
        variant: "destructive",
      });
    },
  });

  // Update operacion
  const updateOperacionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<OperacionFormData> }) => {
      console.log('Updating operacion:', id, data);
      
      const { data: result, error } = await supabase
        .from('operacion')
        .update(data)
        .eq('id', id)
        .select(`
          *,
          salmoneras:salmonera_id (nombre),
          sitios:sitio_id (nombre),
          contratistas:contratista_id (nombre)
        `)
        .single();

      if (error) {
        console.error('Error updating operacion:', error);
        throw error;
      }

      return {
        ...result,
        estado: (['activa', 'pausada', 'completada', 'cancelada', 'eliminada'].includes(result.estado) 
          ? result.estado 
          : 'activa') as 'activa' | 'pausada' | 'completada' | 'cancelada' | 'eliminada'
      } as OperacionConRelaciones;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({
        title: "Operación actualizada",
        description: "La operación ha sido actualizada exitosamente.",
      });
    },
    onError: (error: Error) => {
      console.error('Error updating operacion:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la operación.",
        variant: "destructive",
      });
    },
  });

  // Verificar si la operación puede ser eliminada
  const checkCanDelete = async (operacionId: string): Promise<{ canDelete: boolean; reason?: string }> => {
    try {
      // Verificar HPTs
      const { data: hpts } = await supabase
        .from('hpt')
        .select('id')
        .eq('operacion_id', operacionId);

      if (hpts && hpts.length > 0) {
        return { canDelete: false, reason: 'La operación tiene documentos HPT asociados' };
      }

      // Verificar Anexos Bravo
      const { data: anexos } = await supabase
        .from('anexo_bravo')
        .select('id')
        .eq('operacion_id', operacionId);

      if (anexos && anexos.length > 0) {
        return { canDelete: false, reason: 'La operación tiene documentos Anexo Bravo asociados' };
      }

      // Verificar Bitácoras
      const { data: bitacoras } = await supabase
        .from('bitacora_supervisor')
        .select('bitacora_id')
        .eq('operacion_id', operacionId);

      if (bitacoras && bitacoras.length > 0) {
        return { canDelete: false, reason: 'La operación tiene bitácoras asociadas' };
      }

      return { canDelete: true };
    } catch (error) {
      console.error('Error checking if operation can be deleted:', error);
      return { canDelete: false, reason: 'Error al verificar documentos asociados' };
    }
  };

  // Eliminar físicamente
  const deleteOperacionMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Checking if operacion can be deleted:', id);
      
      const { canDelete, reason } = await checkCanDelete(id);

      if (!canDelete) {
        throw new Error(reason || 'No se puede eliminar la operación');
      }

      const { error } = await supabase
        .from('operacion')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting operacion:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({
        title: "Operación eliminada",
        description: "La operación ha sido eliminada exitosamente.",
      });
    },
    onError: (error: Error) => {
      console.error('Error deleting operacion:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la operación.",
        variant: "destructive",
      });
    },
  });

  // Marcar como eliminada
  const markAsDeletedMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Marking operacion as deleted:', id);
      
      const { error } = await supabase
        .from('operacion')
        .update({ estado: 'eliminada' })
        .eq('id', id);

      if (error) {
        console.error('Error marking operacion as deleted:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({
        title: "Operación marcada como eliminada",
        description: "La operación ha sido marcada como eliminada. Los documentos asociados se mantienen para trazabilidad.",
      });
    },
    onError: (error: Error) => {
      console.error('Error marking operacion as deleted:', error);
      toast({
        title: "Error",
        description: "No se pudo marcar la operación como eliminada.",
        variant: "destructive",
      });
    },
  });

  return {
    operaciones,
    isLoading,
    createOperacion: createOperacionMutation.mutateAsync,
    isCreating: createOperacionMutation.isPending,
    updateOperacion: updateOperacionMutation.mutateAsync,
    deleteOperacion: deleteOperacionMutation.mutateAsync,
    markAsDeleted: markAsDeletedMutation.mutateAsync,
    checkCanDelete,
    isUpdating: updateOperacionMutation.isPending,
    isDeleting: deleteOperacionMutation.isPending,
  };
};
