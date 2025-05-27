
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface BitacoraBuzo {
  bitacora_id: string;
  codigo: string;
  inmersion_id: string;
  fecha: string;
  buzo: string;
  profundidad_maxima: number;
  trabajos_realizados: string;
  estado_fisico_post: string;
  observaciones_tecnicas?: string;
  firmado: boolean;
  buzo_firma?: string;
  estado_aprobacion: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBitacoraBuzoData {
  inmersion_id: string;
  fecha: string;
  buzo: string;
  profundidad_maxima: number;
  trabajos_realizados: string;
  estado_fisico_post: string;
  observaciones_tecnicas?: string;
}

export const useBitacorasBuzo = () => {
  const queryClient = useQueryClient();

  const { data: bitacoras = [], isLoading } = useQuery({
    queryKey: ['bitacoras-buzo'],
    queryFn: async () => {
      console.log('Fetching bitacoras buzo...');
      const { data, error } = await supabase
        .from('bitacora_buzo')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bitacoras buzo:', error);
        throw error;
      }

      return data as BitacoraBuzo[];
    },
  });

  const createBitacoraMutation = useMutation({
    mutationFn: async (data: CreateBitacoraBuzoData) => {
      console.log('Creating bitacora buzo:', data);
      
      const codigo = `BB-${Date.now().toString().slice(-6)}`;

      const { data: result, error } = await supabase
        .from('bitacora_buzo')
        .insert([{
          ...data,
          codigo,
          firmado: false,
          estado_aprobacion: 'pendiente'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating bitacora buzo:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacoras-buzo'] });
      toast({
        title: "Bitácora creada",
        description: "La bitácora de buzo ha sido creada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating bitacora buzo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la bitácora de buzo.",
        variant: "destructive",
      });
    },
  });

  return {
    bitacoras,
    isLoading,
    createBitacora: createBitacoraMutation.mutateAsync,
    isCreating: createBitacoraMutation.isPending,
  };
};
