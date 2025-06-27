
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';

export interface Inmersion extends Tables<'inmersion'> {
  operacion?: {
    id: string;
    codigo: string;
    nombre: string;
    salmonera_id?: string;
    contratista_id?: string;
    salmoneras?: { nombre: string } | null;
    sitios?: { nombre: string } | null;
    contratistas?: { nombre: string } | null;
  };
  operacion_nombre?: string;
}

export interface ValidationStatus {
  hasValidHPT: boolean;
  hasValidAnexoBravo: boolean;
  hasTeam: boolean;
  canExecute: boolean;
  hptCode?: string;
  anexoBravoCode?: string;
}

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

      // Mapear datos para incluir operacion_nombre
      const mappedData = (data || []).map(inmersion => ({
        ...inmersion,
        operacion_nombre: inmersion.operacion?.nombre || 'Sin operación'
      }));

      return mappedData as Inmersion[];
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

  const updateInmersion = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Inmersion> }) => {
      const { data: updatedData, error } = await supabase
        .from('inmersion')
        .update(data)
        .eq('inmersion_id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      toast({
        title: 'Inmersión actualizada',
        description: 'La inmersión ha sido actualizada exitosamente.',
      });
    },
  });

  const deleteInmersion = useMutation({
    mutationFn: async (inmersionId: string) => {
      const { error } = await supabase
        .from('inmersion')
        .delete()
        .eq('inmersion_id', inmersionId);

      if (error) throw error;
      return inmersionId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      toast({
        title: 'Inmersión eliminada',
        description: 'La inmersión ha sido eliminada exitosamente.',
      });
    },
  });

  const executeInmersion = useMutation({
    mutationFn: async (inmersionId: string) => {
      const { data, error } = await supabase
        .from('inmersion')
        .update({ estado: 'en_progreso' })
        .eq('inmersion_id', inmersionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      toast({
        title: 'Inmersión ejecutada',
        description: 'La inmersión ha sido puesta en ejecución.',
      });
    },
  });

  const completeInmersion = useMutation({
    mutationFn: async (inmersionId: string) => {
      const { data, error } = await supabase
        .from('inmersion')
        .update({ estado: 'completada' })
        .eq('inmersion_id', inmersionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      toast({
        title: 'Inmersión completada',
        description: 'La inmersión ha sido marcada como completada.',
      });
    },
  });

  const validateOperationDocuments = useMutation({
    mutationFn: async (operacionId: string): Promise<ValidationStatus> => {
      // Check for HPT
      const { data: hptData } = await supabase
        .from('hpt')
        .select('codigo, firmado')
        .eq('operacion_id', operacionId)
        .eq('firmado', true)
        .single();

      // Check for Anexo Bravo
      const { data: anexoData } = await supabase
        .from('anexo_bravo')
        .select('codigo, firmado')
        .eq('operacion_id', operacionId)
        .eq('firmado', true)
        .single();

      return {
        hasValidHPT: !!hptData,
        hasValidAnexoBravo: !!anexoData,
        hasTeam: true, // Assuming team is always available
        canExecute: !!hptData && !!anexoData,
        hptCode: hptData?.codigo,
        anexoBravoCode: anexoData?.codigo,
      };
    },
  });

  const refreshInmersiones = () => {
    queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
  };

  return {
    inmersiones,
    isLoading,
    error,
    createInmersion: createInmersion.mutate,
    updateInmersion: updateInmersion.mutate,
    deleteInmersion: deleteInmersion.mutate,
    executeInmersion: executeInmersion.mutate,
    completeInmersion: completeInmersion.mutate,
    validateOperationDocuments: validateOperationDocuments.mutate,
    refreshInmersiones,
    isCreating: createInmersion.isPending,
  };
};
