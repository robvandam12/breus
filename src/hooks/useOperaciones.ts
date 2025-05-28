
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
  supervisor_asignado_id?: string;
  tareas?: string;
  equipo_buceo_id?: string;
  servicio_id?: string;
  created_at: string;
  updated_at: string;
  salmonera?: any;
  contratista?: any;
  sitio?: any;
}

export interface OperacionFormData {
  nombre: string;
  codigo: string;
  descripcion?: string;
  fecha_inicio: string;
  fecha_fin?: string;
  salmonera_id: string;
  contratista_id?: string;
  sitio_id?: string;
  supervisor_asignado_id?: string;
  tareas?: string;
  equipo_buceo_id?: string;
  servicio_id?: string;
}

export const useOperaciones = () => {
  const queryClient = useQueryClient();

  const { data: operaciones = [], isLoading } = useQuery({
    queryKey: ['operaciones'],
    queryFn: async () => {
      console.log('Fetching operaciones...');
      const { data, error } = await supabase
        .from('operacion')
        .select(`
          *,
          salmonera:salmonera_id (nombre),
          contratista:contratista_id (nombre),
          sitio:sitio_id (nombre, ubicacion)
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
        .from('operacion')
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
        .from('operacion')
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
      
      // Actualizar la operación con el equipo asignado
      const { data: result, error } = await supabase
        .from('operacion')
        .update({ equipo_buceo_id: equipoId })
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
        .from('operacion')
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
