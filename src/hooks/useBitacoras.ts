
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface BitacoraSupervisor {
  id: string;
  codigo: string;
  inmersion_id: string;
  supervisor: string;
  fecha: string;
  desarrollo_inmersion: string;
  incidentes?: string;
  evaluacion_general: string;
  firmado: boolean;
  created_at: string;
  updated_at: string;
}

export interface BitacoraBuzo {
  id: string;
  codigo: string;
  inmersion_id: string;
  buzo: string;
  fecha: string;
  profundidad_maxima: number;
  trabajos_realizados: string;
  estado_fisico_post: string;
  observaciones_tecnicas?: string;
  firmado: boolean;
  created_at: string;
  updated_at: string;
}

export interface BitacoraSupervisorFormData {
  codigo: string;
  inmersion_id: string;
  supervisor: string;
  desarrollo_inmersion: string;
  incidentes?: string;
  evaluacion_general: string;
  fecha: string;
}

export interface BitacoraBuzoFormData {
  codigo: string;
  inmersion_id: string;
  buzo: string;
  profundidad_maxima: number;
  trabajos_realizados: string;
  estado_fisico_post: string;
  observaciones_tecnicas?: string;
  fecha: string;
}

export const useBitacoras = () => {
  const queryClient = useQueryClient();

  // Fetch bitácoras supervisor
  const { data: bitacorasSupervisor = [], isLoading: loadingSupervisor } = useQuery({
    queryKey: ['bitacoras-supervisor'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bitacora_supervisor')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(bitacora => ({
        ...bitacora,
        id: bitacora.bitacora_id
      })) as BitacoraSupervisor[];
    },
  });

  // Fetch bitácoras buzo
  const { data: bitacorasBuzo = [], isLoading: loadingBuzo } = useQuery({
    queryKey: ['bitacoras-buzo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bitacora_buzo')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(bitacora => ({
        ...bitacora,
        id: bitacora.bitacora_id
      })) as BitacoraBuzo[];
    },
  });

  // Create bitácora supervisor
  const createBitacoraSupervisorMutation = useMutation({
    mutationFn: async (data: BitacoraSupervisorFormData) => {
      console.log('Creating bitácora supervisor:', data);
      
      const { data: result, error } = await supabase
        .from('bitacora_supervisor')
        .insert({
          codigo: data.codigo,
          inmersion_id: data.inmersion_id,
          supervisor: data.supervisor,
          fecha: data.fecha,
          desarrollo_inmersion: data.desarrollo_inmersion,
          incidentes: data.incidentes || '',
          evaluacion_general: data.evaluacion_general,
          firmado: false
        })
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
        .insert({
          codigo: data.codigo,
          inmersion_id: data.inmersion_id,
          buzo: data.buzo,
          fecha: data.fecha,
          profundidad_maxima: data.profundidad_maxima,
          trabajos_realizados: data.trabajos_realizados,
          estado_fisico_post: data.estado_fisico_post,
          observaciones_tecnicas: data.observaciones_tecnicas || '',
          firmado: false
        })
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
    refreshBitacoras,
    isCreatingSupervisor: createBitacoraSupervisorMutation.isPending,
    isCreatingBuzo: createBitacoraBuzoMutation.isPending,
  };
};
