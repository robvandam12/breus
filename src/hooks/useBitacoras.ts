
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
  evaluacion_general: string;
  incidentes?: string;
  firmado: boolean;
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
  profundidad_maxima: number;
  trabajos_realizados: string;
  estado_fisico_post: string;
  observaciones_tecnicas?: string;
  firmado: boolean;
  buzo_firma?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBitacoraSupervisorData {
  inmersion_id: string;
  supervisor: string;
  fecha: string;
  desarrollo_inmersion: string;
  evaluacion_general: string;
  incidentes?: string;
}

export interface CreateBitacoraBuzoData {
  inmersion_id: string;
  buzo: string;
  fecha: string;
  profundidad_maxima: number;
  trabajos_realizados: string;
  estado_fisico_post: string;
  observaciones_tecnicas?: string;
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

      return data as BitacoraSupervisor[];
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

      return data as BitacoraBuzo[];
    },
  });

  // Create bitácora supervisor
  const createBitacoraSupervisorMutation = useMutation({
    mutationFn: async (data: CreateBitacoraSupervisorData) => {
      console.log('Creating bitácora supervisor:', data);
      
      const codigo = `BS-${Date.now().toString().slice(-6)}`;

      const { data: result, error } = await supabase
        .from('bitacora_supervisor')
        .insert([{
          ...data,
          codigo,
          firmado: false
        }])
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
        title: "Bitácora Supervisor creada",
        description: "La bitácora ha sido creada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating bitácora supervisor:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la bitácora supervisor.",
        variant: "destructive",
      });
    },
  });

  // Create bitácora buzo
  const createBitacoraBuzoMutation = useMutation({
    mutationFn: async (data: CreateBitacoraBuzoData) => {
      console.log('Creating bitácora buzo:', data);
      
      const codigo = `BB-${Date.now().toString().slice(-6)}`;

      const { data: result, error } = await supabase
        .from('bitacora_buzo')
        .insert([{
          ...data,
          codigo,
          firmado: false
        }])
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
        title: "Bitácora Buzo creada",
        description: "La bitácora ha sido creada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating bitácora buzo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la bitácora buzo.",
        variant: "destructive",
      });
    },
  });

  // Sign bitácora supervisor
  const signBitacoraSupervisorMutation = useMutation({
    mutationFn: async ({ id, signature }: { id: string; signature: string }) => {
      console.log('Signing bitácora supervisor:', id);
      
      const { data, error } = await supabase
        .from('bitacora_supervisor')
        .update({
          firmado: true,
          supervisor_firma: signature
        })
        .eq('bitacora_id', id)
        .select()
        .single();

      if (error) {
        console.error('Error signing bitácora supervisor:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacoras-supervisor'] });
      toast({
        title: "Bitácora firmada",
        description: "La bitácora supervisor ha sido firmada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error signing bitácora supervisor:', error);
      toast({
        title: "Error",
        description: "No se pudo firmar la bitácora supervisor.",
        variant: "destructive",
      });
    },
  });

  // Sign bitácora buzo
  const signBitacoraBuzoMutation = useMutation({
    mutationFn: async ({ id, signature }: { id: string; signature: string }) => {
      console.log('Signing bitácora buzo:', id);
      
      const { data, error } = await supabase
        .from('bitacora_buzo')
        .update({
          firmado: true,
          buzo_firma: signature
        })
        .eq('bitacora_id', id)
        .select()
        .single();

      if (error) {
        console.error('Error signing bitácora buzo:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacoras-buzo'] });
      toast({
        title: "Bitácora firmada",
        description: "La bitácora buzo ha sido firmada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error signing bitácora buzo:', error);
      toast({
        title: "Error",
        description: "No se pudo firmar la bitácora buzo.",
        variant: "destructive",
      });
    },
  });

  return {
    bitacorasSupervisor,
    bitacorasBuzo,
    isLoading: loadingSupervisor || loadingBuzo,
    createBitacoraSupervisor: createBitacoraSupervisorMutation.mutateAsync,
    createBitacoraBuzo: createBitacoraBuzoMutation.mutateAsync,
    signBitacoraSupervisor: signBitacoraSupervisorMutation.mutateAsync,
    signBitacoraBuzo: signBitacoraBuzoMutation.mutateAsync,
    isCreating: createBitacoraSupervisorMutation.isPending || createBitacoraBuzoMutation.isPending,
    isSigning: signBitacoraSupervisorMutation.isPending || signBitacoraBuzoMutation.isPending,
  };
};
