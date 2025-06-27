
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useInmersiones = () => {
  const queryClient = useQueryClient();

  const { data: inmersiones = [], isLoading, error } = useQuery({
    queryKey: ['inmersiones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inmersion')
        .select(`
          *,
          operacion:operacion_id(
            id,
            codigo,
            nombre,
            salmonera_id,
            contratista_id,
            salmoneras:salmonera_id(nombre),
            sitios:sitio_id(nombre),
            contratistas:contratista_id(nombre)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching inmersiones:', error);
        throw error;
      }

      return data || [];
    },
  });

  const createInmersion = useMutation({
    mutationFn: async (inmersionData: any) => {
      const { data, error } = await supabase
        .from('inmersion')
        .insert(inmersionData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      toast({
        title: 'Inmersión creada',
        description: 'La inmersión ha sido creada exitosamente.',
      });
    },
    onError: (error) => {
      console.error('Error creating inmersion:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear la inmersión.',
        variant: 'destructive',
      });
    },
  });

  return {
    inmersiones,
    isLoading,
    error,
    createInmersion: createInmersion.mutate,
    isCreating: createInmersion.isPending,
  };
};
