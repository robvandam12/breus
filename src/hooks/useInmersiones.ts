
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Inmersion {
  id: string;
  codigo: string;
  operacion_id: string;
  fecha_inmersion: string;
  hora_inicio: string;
  hora_fin?: string;
  profundidad_maxima?: number;
  estado: 'planificada' | 'en_progreso' | 'completada' | 'cancelada';
  created_at: string;
  updated_at: string;
}

export interface CreateInmersionData {
  operacion_id: string;
  fecha_inmersion: string;
  hora_inicio: string;
  hora_fin?: string;
  profundidad_maxima?: number;
}

export const useInmersiones = () => {
  const queryClient = useQueryClient();

  // Fetch inmersiones
  const { data: inmersiones = [], isLoading } = useQuery({
    queryKey: ['inmersiones'],
    queryFn: async () => {
      console.log('Fetching inmersiones...');
      const { data, error } = await supabase
        .from('inmersion')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching inmersiones:', error);
        throw error;
      }

      return data || [];
    },
  });

  // Create inmersion
  const createInmersionMutation = useMutation({
    mutationFn: async (data: CreateInmersionData) => {
      console.log('Creating inmersion:', data);
      
      const codigo = `INM-${Date.now().toString().slice(-6)}`;

      const { data: result, error } = await supabase
        .from('inmersion')
        .insert([{
          ...data,
          codigo,
          estado: 'planificada'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating inmersion:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      toast({
        title: "Inmersión creada",
        description: "La inmersión ha sido creada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la inmersión.",
        variant: "destructive",
      });
    },
  });

  return {
    inmersiones,
    isLoading,
    createInmersion: createInmersionMutation.mutateAsync,
    isCreating: createInmersionMutation.isPending,
  };
};
