
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Operacion {
  id: string;
  nombre: string;
  sitio_id: string;
  servicio_id: string;
  fecha_inicio: string;
  fecha_fin?: string;
  tareas?: string;
  estado: 'activa' | 'completada' | 'cancelada';
  created_at: string;
  updated_at: string;
}

export interface CreateOperacionData {
  nombre: string;
  sitio_id: string;
  servicio_id: string;
  fecha_inicio: string;
  fecha_fin?: string;
  tareas?: string;
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
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching operaciones:', error);
        throw error;
      }

      return data || [];
    },
  });

  // Create operacion
  const createOperacionMutation = useMutation({
    mutationFn: async (data: CreateOperacionData) => {
      console.log('Creating operacion:', data);
      
      const { data: result, error } = await supabase
        .from('operacion')
        .insert([{
          ...data,
          estado: 'activa'
        }])
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

  return {
    operaciones,
    isLoading,
    createOperacion: createOperacionMutation.mutateAsync,
    isCreating: createOperacionMutation.isPending,
  };
};
