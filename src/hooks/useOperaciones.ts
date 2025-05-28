
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Operacion {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  estado: string;
  salmonera_id?: string;
  contratista_id?: string;
  sitio_id?: string;
  supervisor_asignado?: string;
  tareas?: string;
  equipo_buceo_ids?: string[];
  created_at: string;
  updated_at: string;
  salmonera?: any;
  contratista?: any;
  sitio?: any;
}

export const useOperaciones = () => {
  const queryClient = useQueryClient();

  const { data: operaciones = [], isLoading } = useQuery({
    queryKey: ['operaciones'],
    queryFn: async () => {
      console.log('Fetching operaciones...');
      const { data, error } = await supabase
        .from('operaciones')
        .select(`
          *,
          salmonera:salmonera_id (nombre),
          contratista:contratista_id (nombre),
          sitio:sitio_id (nombre, region, comuna)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching operaciones:', error);
        throw error;
      }

      return data || [];
    },
  });

  const createOperacionMutation = useMutation({
    mutationFn: async (data: Partial<Operacion>) => {
      console.log('Creating operacion:', data);
      
      const { data: result, error } = await supabase
        .from('operaciones')
        .insert([data])
        .select()
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
        description: "No se pudo crear la operación.",
        variant: "destructive",
      });
    },
  });

  const updateOperacionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Operacion> }) => {
      console.log('Updating operacion:', id, data);
      
      const { data: result, error } = await supabase
        .from('operaciones')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({
        title: "Operación actualizada",
        description: "La operación ha sido actualizada exitosamente.",
      });
    },
  });

  const assignEquipoToOperacionMutation = useMutation({
    mutationFn: async ({ operacionId, equipoId }: { operacionId: string; equipoId: string }) => {
      console.log('Assigning equipo to operacion:', { operacionId, equipoId });
      
      // Obtener la operación actual
      const { data: operacion, error: fetchError } = await supabase
        .from('operaciones')
        .select('equipo_buceo_ids')
        .eq('id', operacionId)
        .single();

      if (fetchError) throw fetchError;

      // Agregar el nuevo equipo a la lista existente
      const currentEquipos = operacion.equipo_buceo_ids || [];
      const updatedEquipos = [...currentEquipos, equipoId];

      // Actualizar la operación
      const { data: result, error } = await supabase
        .from('operaciones')
        .update({ equipo_buceo_ids: updatedEquipos })
        .eq('id', operacionId)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({
        title: "Equipo asignado",
        description: "El equipo ha sido asignado a la operación exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error assigning equipo:', error);
      toast({
        title: "Error",
        description: "No se pudo asignar el equipo a la operación.",
        variant: "destructive",
      });
    },
  });

  const deleteOperacionMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting operacion:', id);
      
      const { error } = await supabase
        .from('operaciones')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({
        title: "Operación eliminada",
        description: "La operación ha sido eliminada exitosamente.",
      });
    },
  });

  return {
    operaciones,
    isLoading,
    createOperacion: createOperacionMutation.mutateAsync,
    updateOperacion: updateOperacionMutation.mutateAsync,
    assignEquipoToOperacion: assignEquipoToOperacionMutation.mutateAsync,
    deleteOperacion: deleteOperacionMutation.mutateAsync,
    isCreating: createOperacionMutation.isPending,
    isUpdating: updateOperacionMutation.isPending,
    isDeleting: deleteOperacionMutation.isPending,
  };
};
