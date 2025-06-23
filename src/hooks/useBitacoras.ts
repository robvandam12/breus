
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface Bitacora {
  id: string;
  fecha: string;
  created_by: string;
  firmado: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useBitacoras = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: bitacoras = [], isLoading, error } = useQuery({
    queryKey: ['bitacoras'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bitacoras_buzo')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const createBitacora = useMutation({
    mutationFn: async (bitacoraData: Partial<Bitacora>) => {
      const { data, error } = await supabase
        .from('bitacoras_buzo')
        .insert([{
          ...bitacoraData,
          created_by: profile?.id
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
