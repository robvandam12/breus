
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface BitacoraSupervisor {
  bitacora_id: string;
  codigo: string;
  inmersion_id: string;
  supervisor: string;
  fecha: string;
  desarrollo_inmersion: string;
  incidentes?: string;
  evaluacion_general: string;
  firmado: boolean;
  estado_aprobacion: string;
  supervisor_firma?: string;
  created_at: string;
  updated_at: string;
}

export interface BitacoraBuzo {
  bitacora_id: string;
  codigo: string;
  inmersion_id: string;
  buzo: string;
  fecha: string;
  trabajos_realizados: string;
  observaciones_tecnicas?: string;
  estado_fisico_post: string;
  profundidad_maxima: number;
  firmado: boolean;
  estado_aprobacion: string;
  buzo_firma?: string;
  created_at: string;
  updated_at: string;
}

export interface BitacoraSupervisorFormData {
  codigo: string;
  inmersion_id: string;
  supervisor: string;
  fecha: string;
  desarrollo_inmersion: string;
  incidentes?: string;
  evaluacion_general: string;
}

export interface BitacoraBuzoFormData {
  codigo: string;
  inmersion_id: string;
  buzo: string;
  fecha: string;
  trabajos_realizados: string;
  observaciones_tecnicas?: string;
  estado_fisico_post: string;
  profundidad_maxima: number;
}

export const useBitacoras = () => {
  const queryClient = useQueryClient();

  // Fetch bitácoras supervisor
  const { data: bitacorasSupervisor = [], isLoading: loadingSupervisor } = useQuery({
    queryKey: ['bitacoras-supervisor'],
    queryFn: async () => {
      console.log('Fetching bitácoras supervisor...');
      const { data, error } = await supabase
        .from('bitacora_supervisor')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bitácoras supervisor:', error);
        throw error;
      }

      return (data || []) as BitacoraSupervisor[];
    },
  });

  // Fetch bitácoras buzo
  const { data: bitacorasBuzo = [], isLoading: loadingBuzo } = useQuery({
    queryKey: ['bitacoras-buzo'],
    queryFn: async () => {
      console.log('Fetching bitácoras buzo...');
      const { data, error } = await supabase
        .from('bitacora_buzo')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bitácoras buzo:', error);
        throw error;
      }

      return (data || []) as BitacoraBuzo[];
    },
  });

  // Create bitácora supervisor
  const createBitacoraSupervisorMutation = useMutation({
    mutationFn: async (data: BitacoraSupervisorFormData) => {
      console.log('Creating bitácora supervisor:', data);
      
      const { data: result, error } = await supabase
        .from('bitacora_supervisor')
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error('Error creating bitácora supervisor:', error);
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
      console.error('Error creating bitácora supervisor:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la bitácora de supervisor.",
        variant: "destructive",
      });
    },
  });

  // Create bitácora buzo
  const createBitacoraBuzoMutation = useMutation({
    mutationFn: async (data: BitacoraBuzoFormData) => {
      console.log('Creating bitácora buzo:', data);
      
      const { data: result, error } = await supabase
        .from('bitacora_buzo')
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error('Error creating bitácora buzo:', error);
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
      console.error('Error creating bitácora buzo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la bitácora de buzo.",
        variant: "destructive",
      });
    },
  });

  const refreshBitacoras = () => {
    queryClient.invalidateQueries({ queryKey: ['bitacoras-supervisor'] });
    queryClient.invalidateQueries({ queryKey: ['bitacoras-buzo'] });
  };

  return {
    bitacorasSupervisor,
    bitacorasBuzo,
    loading: loadingSupervisor || loadingBuzo,
    createBitacoraSupervisor: createBitacoraSupervisorMutation.mutateAsync,
    createBitacoraBuzo: createBitacoraBuzoMutation.mutateAsync,
    isCreatingSupervisor: createBitacoraSupervisorMutation.isPending,
    isCreatingBuzo: createBitacoraBuzoMutation.isPending,
    refreshBitacoras,
  };
};
