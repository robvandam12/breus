
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useContratistas = () => {
  const { data: contratistas = [], isLoading } = useQuery({
    queryKey: ['contratistas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contratistas')
        .select('*')
        .eq('estado', 'activo')
        .order('nombre');

      if (error) throw error;
      return data;
    },
  });

  return {
    contratistas,
    isLoading,
  };
};
