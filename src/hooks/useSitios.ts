
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Sitio {
  id: string;
  nombre: string;
  codigo: string;
  ubicacion: string;
  salmonera_id: string;
  estado: string;
  coordenadas_lat?: number;
  coordenadas_lng?: number;
  profundidad_maxima?: number;
  capacidad_jaulas?: number;
  observaciones?: string;
  created_at: string;
  updated_at: string;
}

export const useSitios = () => {
  const { data: sitios = [], isLoading } = useQuery({
    queryKey: ['sitios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sitios')
        .select('*')
        .order('nombre');

      if (error) throw error;
      return data as Sitio[];
    },
  });

  return {
    sitios,
    isLoading,
  };
};
