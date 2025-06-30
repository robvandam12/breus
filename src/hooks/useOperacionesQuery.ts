
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface OperacionConRelaciones {
  id: string;
  codigo: string;
  nombre: string;
  estado: string;
  estado_aprobacion?: string;
  fecha_inicio: string;
  fecha_fin?: string;
  tareas?: string;
  salmonera_id?: string;
  contratista_id?: string;
  centro_id?: string;
  supervisor_asignado_id?: string;
  created_at: string;
  updated_at: string;
  centros?: {
    id: string;
    nombre: string;
  } | null;
  contratistas?: {
    id: string;
    nombre: string;
  } | null;
  salmoneras?: {
    id: string;
    nombre: string;
  } | null;
  usuario_supervisor?: {
    nombre: string;
    apellido: string;
  } | null;
}

export type Operacion = OperacionConRelaciones;

export const useOperacionesQuery = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['operaciones'],
    queryFn: async () => {
      console.log('Fetching operaciones...');
      
      const { data, error } = await supabase
        .from('operacion')
        .select(`
          *,
          centros (
            id,
            nombre
          ),
          contratistas (
            id,
            nombre
          ),
          salmoneras (
            id,
            nombre
          ),
          usuario_supervisor:supervisor_asignado_id (
            nombre,
            apellido
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching operaciones:', error);
        throw new Error(`Error al obtener operaciones: ${error.message}`);
      }

      console.log('Operaciones fetched successfully:', data?.length || 0);
      return (data || []) as OperacionConRelaciones[];
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (operacionId: string) => {
      console.log('Deleting operacion:', operacionId);
      
      const { error } = await supabase
        .from('operacion')
        .delete()
        .eq('id', operacionId);

      if (error) {
        console.error('Error deleting operacion:', error);
        throw new Error(`Error al eliminar operación: ${error.message}`);
      }

      return operacionId;
    },
    onSuccess: (deletedId) => {
      // Optimistic update - eliminar del cache inmediatamente
      queryClient.setQueryData(['operaciones'], (oldData: OperacionConRelaciones[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(operacion => operacion.id !== deletedId);
      });
      
      // También invalidar para refetch desde servidor
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      
      toast({
        title: "Operación eliminada",
        description: "La operación ha sido eliminada exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting operacion:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la operación.",
        variant: "destructive",
      });
    },
  });

  return {
    data: data || [],
    isLoading,
    error,
    refetch,
    deleteOperacion: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
