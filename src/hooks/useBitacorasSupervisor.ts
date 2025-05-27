
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface BitacoraSupervisor {
  bitacora_id: string;
  codigo: string;
  inmersion_id: string;
  fecha: string;
  supervisor: string;
  desarrollo_inmersion: string;
  evaluacion_general: string;
  incidentes?: string;
  firmado: boolean;
  supervisor_firma?: string;
  estado_aprobacion: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBitacoraSupervisorData {
  inmersion_id: string;
  fecha: string;
  supervisor: string;
  desarrollo_inmersion: string;
  evaluacion_general: string;
  incidentes?: string;
}

export const useBitacorasSupervisor = () => {
  const queryClient = useQueryClient();

  const { data: bitacoras = [], isLoading } = useQuery({
    queryKey: ['bitacoras-supervisor'],
    queryFn: async () => {
      console.log('Fetching bitacoras supervisor...');
      const { data, error } = await supabase
        .from('bitacora_supervisor')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bitacoras supervisor:', error);
        throw error;
      }

      return data as BitacoraSupervisor[];
    },
  });

  const createBitacoraMutation = useMutation({
    mutationFn: async (data: CreateBitacoraSupervisorData) => {
      console.log('Creating bitacora supervisor:', data);
      
      const codigo = `BS-${Date.now().toString().slice(-6)}`;

      const { data: result, error } = await supabase
        .from('bitacora_supervisor')
        .insert([{
          ...data,
          codigo,
          firmado: false,
          estado_aprobacion: 'pendiente'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating bitacora supervisor:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacoras-supervisor'] });
      toast({
        title: "Bitácora creada",
        description: "La bitácora de supervisor ha sido creada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating bitacora supervisor:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la bitácora de supervisor.",
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
