
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Contratista {
  id: string;
  nombre: string;
  rut: string;
  direccion: string;
  email?: string;
  telefono?: string;
  estado: string;
  especialidades?: string[];
  certificaciones?: string[];
  created_at: string;
  updated_at: string;
}

export const useContratistas = () => {
  const { data: contratistas = [], isLoading } = useQuery({
    queryKey: ['contratistas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contratistas')
        .select('*')
        .order('nombre');

      if (error) throw error;
      return data as Contratista[];
    },
  });

  return {
    contratistas,
    isLoading,
  };
};
