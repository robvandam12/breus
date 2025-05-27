
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Inmersion {
  inmersion_id: string;
  codigo: string;
  fecha_inmersion: string;
  hora_inicio: string;
  hora_fin?: string;
  operacion_id: string;
  buzo_principal: string;
  buzo_principal_id?: string;
  buzo_asistente?: string;
  buzo_asistente_id?: string;
  supervisor: string;
  supervisor_id?: string;
  objetivo: string;
  estado: string;
  profundidad_max: number;
  temperatura_agua: number;
  visibilidad: number;
  corriente: string;
  observaciones?: string;
  hpt_validado: boolean;
  anexo_bravo_validado: boolean;
  created_at: string;
  updated_at: string;
}

export const useInmersiones = () => {
  const queryClient = useQueryClient();

  const { data: inmersiones = [], isLoading, error } = useQuery({
    queryKey: ['inmersiones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inmersion')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Inmersion[];
    },
  });

  const createInmersionMutation = useMutation({
    mutationFn: async (inmersionData: Partial<Inmersion>) => {
      const { data, error } = await supabase
        .from('inmersion')
        .insert([inmersionData])
        .select()
        .single();

      if (error) throw error;
      return data;
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

  const updateInmersionMutation = useMutation({
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
        title: "Inmersión actualizada",
        description: "La inmersión ha sido actualizada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error updating inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la inmersión.",
        variant: "destructive",
      });
    },
  });

  return {
    inmersiones,
    isLoading,
    error,
    createInmersion: createInmersionMutation.mutateAsync,
    updateInmersion: updateInmersionMutation.mutateAsync,
    isCreating: createInmersionMutation.isPending,
    isUpdating: updateInmersionMutation.isPending,
  };
};
