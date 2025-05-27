
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Salmonera {
  id: string;
  nombre: string;
  rut: string;
  direccion: string;
  email?: string;
  telefono?: string;
  estado: string;
  sitios_activos: number;
  created_at: string;
  updated_at: string;
}

export const useSalmoneras = () => {
  const { data: salmoneras = [], isLoading } = useQuery({
    queryKey: ['salmoneras'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salmoneras')
        .select('*')
        .order('nombre');

      if (error) throw error;
      return data as Salmonera[];
    },
  });

  return {
    salmoneras,
    isLoading,
  };
};
