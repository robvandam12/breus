
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface AnexoBravo {
  id: string;
  codigo: string;
  operacion_id: string;
  fecha: string;
  lugar_faena: string;
  empresa_nombre: string;
  supervisor_servicio_nombre: string;
  supervisor_mandante_nombre: string;
  buzo_o_empresa_nombre: string;
  estado: string;
  firmado: boolean;
  progreso: number;
  anexo_bravo_checklist: any;
  anexo_bravo_trabajadores: any[];
  anexo_bravo_firmas: any;
  created_at: string;
  updated_at: string;
}

export const useAnexoBravo = () => {
  const queryClient = useQueryClient();

  const { data: anexosBravo = [], isLoading, error } = useQuery({
    queryKey: ['anexos-bravo'],
    queryFn: async () => {
      console.log('Fetching anexos bravo...');
      const { data, error } = await supabase
        .from('anexo_bravo')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching anexos bravo:', error);
        throw error;
      }

      console.log('Anexos bravo data:', data);
      return data as AnexoBravo[];
    },
  });

  const createAnexoBravoMutation = useMutation({
    mutationFn: async (anexoData: Omit<AnexoBravo, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating Anexo Bravo:', anexoData);
      const { data, error } = await supabase
        .from('anexo_bravo')
        .insert(anexoData)
        .select()
        .single();

      if (error) {
        console.error('Error creating Anexo Bravo:', error);
        throw error;
      }

      console.log('Anexo Bravo created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anexos-bravo'] });
      toast({
        title: "Anexo Bravo creado",
        description: "El Anexo Bravo ha sido creado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating Anexo Bravo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el Anexo Bravo. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const signAnexoBravoMutation = useMutation({
    mutationFn: async ({ id, signatures }: { id: string; signatures: any }) => {
      console.log('Signing Anexo Bravo:', id, signatures);
      const { data, error } = await supabase
        .from('anexo_bravo')
        .update({
          firmado: true,
          estado: 'firmado',
          progreso: 100,
          anexo_bravo_firmas: signatures
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error signing Anexo Bravo:', error);
        throw error;
      }

      console.log('Anexo Bravo signed:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anexos-bravo'] });
      toast({
        title: "Anexo Bravo firmado",
        description: "El Anexo Bravo ha sido firmado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error signing Anexo Bravo:', error);
      toast({
        title: "Error",
        description: "No se pudo firmar el Anexo Bravo. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  return {
    anexosBravo,
    isLoading,
    error,
    createAnexoBravo: createAnexoBravoMutation.mutateAsync,
    signAnexoBravo: signAnexoBravoMutation.mutateAsync,
    isSigning: signAnexoBravoMutation.isPending,
    isCreating: createAnexoBravoMutation.isPending,
  };
};
