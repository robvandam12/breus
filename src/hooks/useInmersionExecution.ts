
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useInmersionExecution = () => {
  const queryClient = useQueryClient();

  const executeInmersionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('inmersion')
        .update({ estado: 'en_progreso' })
        .eq('inmersion_id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      toast({
        title: "Inmersión ejecutada",
        description: "La inmersión ha sido puesta en ejecución.",
      });
    },
    onError: (error) => {
      console.error('Error executing inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo ejecutar la inmersión.",
        variant: "destructive",
      });
    },
  });

  const completeInmersionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('inmersion')
        .update({ estado: 'completada' })
        .eq('inmersion_id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      toast({
        title: "Inmersión completada",
        description: "La inmersión ha sido marcada como completada.",
      });
    },
    onError: (error) => {
      console.error('Error completing inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo completar la inmersión.",
        variant: "destructive",
      });
    },
  });

  return {
    executeInmersion: executeInmersionMutation.mutateAsync,
    completeInmersion: completeInmersionMutation.mutateAsync,
  };
};
