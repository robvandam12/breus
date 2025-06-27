
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface OperacionFormData {
  codigo: string;
  nombre: string;
  fecha_inicio: string;
  fecha_fin?: string;
  estado: 'activa' | 'pausada' | 'completada' | 'cancelada';
  salmonera_id?: string;
  sitio_id?: string;
  contratista_id?: string;
  servicio_id?: string;
  tareas?: string;
}

export const useOperacionesMutations = () => {
  const queryClient = useQueryClient();

  const createOperacion = useMutation({
    mutationFn: async (data: OperacionFormData) => {
      const { data: result, error } = await supabase
        .from('operacion')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({
        title: "Operación creada",
        description: "La operación se ha creado exitosamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `No se pudo crear la operación: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateOperacion = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: OperacionFormData }) => {
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
        description: "La operación se ha actualizado exitosamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `No se pudo actualizar la operación: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    createOperacion: createOperacion.mutateAsync,
    updateOperacion: updateOperacion.mutateAsync,
    isCreating: createOperacion.isPending,
    isUpdating: updateOperacion.isPending,
  };
};
