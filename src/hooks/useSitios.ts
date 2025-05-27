
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSitios = () => {
  const { data: sitios = [], isLoading } = useQuery({
    queryKey: ['sitios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sitios')
        .select('*')
        .eq('estado', 'activo')
        .order('nombre');

      if (error) throw error;
      return data;
    },
  });

  return {
    sitios,
    isLoading,
  };
};
