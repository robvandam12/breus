
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Operacion {
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

  // Fetch operaciones (excluyendo las eliminadas por defecto)
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
        .neq('estado', 'eliminada') // Excluir las eliminadas
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching operaciones:', error);
        throw error;
      }

      return (data || []).map(op => ({
        ...op,
        estado: (['activa', 'pausada', 'completada', 'cancelada', 'eliminada'].includes(op.estado) 
          ? op.estado 
          : 'activa') as 'activa' | 'pausada' | 'completada' | 'cancelada' | 'eliminada'
      })) as Operacion[];
    },
  });

  // Create operacion
  const createOperacionMutation = useMutation({
    mutationFn: async (data: OperacionFormData) => {
      console.log('Creating operacion:', data);
      
      // Validar datos requeridos
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

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({
        title: "Operación creada",
        description: "La operación ha sido creada exitosamente.",
      });
    },
    onError: (error) => {
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
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({
        title: "Operación actualizada",
        description: "La operación ha sido actualizada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error updating operacion:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la operación.",
        variant: "destructive",
      });
    },
  });

  // Cambiar estado a eliminada en lugar de eliminar físicamente
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
        title: "Operación eliminada",
        description: "La operación ha sido marcada como eliminada. Los documentos asociados se mantienen para trazabilidad.",
      });
    },
    onError: (error) => {
      console.error('Error marking operacion as deleted:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la operación.",
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
    markAsDeleted: markAsDeletedMutation.mutateAsync, // Cambio de deleteOperacion a markAsDeleted
    isUpdating: updateOperacionMutation.isPending,
    isDeleting: markAsDeletedMutation.isPending,
  };
};
