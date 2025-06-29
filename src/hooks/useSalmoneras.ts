
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Salmonera {
  id: string;
  nombre: string;
  rut: string;
  direccion: string;
  telefono?: string;
  email?: string;
  estado: string;
  sitios_activos?: number;
  created_at: string;
  updated_at: string;
}

export const useSalmoneras = () => {
  const { data: salmoneras = [], isLoading, error } = useQuery({
    queryKey: ['salmoneras'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salmoneras')
        .select('*')
        .eq('estado', 'activa')
        .order('nombre');

      if (error) throw error;
      return data as Salmonera[];
    },
  });

  return {
    salmoneras,
    isLoading,
    error,
  };
};
