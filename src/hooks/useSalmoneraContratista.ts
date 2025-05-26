
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SalmoneraContratista {
  id: string;
  salmonera_id: string;
  contratista_id: string;
  fecha_asociacion: string;
  estado: 'activa' | 'inactiva' | 'suspendida';
  salmonera?: {
    nombre: string;
    rut: string;
  };
  contratista?: {
    nombre: string;
    rut: string;
  };
}

export const useSalmoneraContratista = () => {
  const queryClient = useQueryClient();

  const { data: asociaciones = [], isLoading } = useQuery({
    queryKey: ['salmonera-contratista'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salmonera_contratista')
        .select(`
          *,
          salmonera:salmoneras(nombre, rut),
          contratista:contratistas(nombre, rut)
        `)
        .order('fecha_asociacion', { ascending: false });

      if (error) throw error;
      return data as SalmoneraContratista[];
    },
  });

  const createAsociacion = useMutation({
    mutationFn: async ({ salmonera_id, contratista_id }: {
      salmonera_id: string;
      contratista_id: string;
    }) => {
      const { data, error } = await supabase
        .from('salmonera_contratista')
        .insert({ salmonera_id, contratista_id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salmonera-contratista'] });
      toast({
        title: 'Asociación creada',
        description: 'La asociación entre salmonera y contratista ha sido creada exitosamente.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Error al crear la asociación: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const removeAsociacion = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('salmonera_contratista')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salmonera-contratista'] });
      toast({
        title: 'Asociación eliminada',
        description: 'La asociación ha sido eliminada exitosamente.',
      });
    },
  });

  return {
    asociaciones,
    isLoading,
    createAsociacion: createAsociacion.mutate,
    removeAsociacion: removeAsociacion.mutate,
    isCreating: createAsociacion.isPending,
  };
};
