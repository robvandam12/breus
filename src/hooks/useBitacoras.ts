
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface Bitacora {
  bitacora_id: string;
  fecha: string;
  buzo: string;
  inmersion_id: string;
  firmado: boolean;
  estado_aprobacion: string;
  created_at: string;
  updated_at: string;
  codigo: string;
  profundidad_maxima?: number;
  trabajos_realizados: string;
}

export const useBitacoras = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: bitacoras = [], isLoading, error } = useQuery({
    queryKey: ['bitacoras'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bitacora_buzo')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const createBitacora = useMutation({
    mutationFn: async (bitacoraData: Partial<Bitacora>) => {
      const { data, error } = await supabase
        .from('bitacora_buzo')
        .insert([{
          buzo: profile?.nombre || '',
          codigo: bitacoraData.codigo || `BIT-${Date.now()}`,
          fecha: bitacoraData.fecha || new Date().toISOString().split('T')[0],
          inmersion_id: bitacoraData.inmersion_id || '',
          profundidad_maxima: bitacoraData.profundidad_maxima || 0,
          trabajos_realizados: bitacoraData.trabajos_realizados || '',
          estado_fisico_post: 'normal'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacoras'] });
      toast({
        title: "Bitácora creada",
        description: "La bitácora ha sido creada exitosamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Error al crear la bitácora.",
        variant: "destructive",
      });
    },
  });

  return {
    bitacoras,
    isLoading,
    error,
    createBitacora: createBitacora.mutate,
    isCreating: createBitacora.isPending,
  };
};
