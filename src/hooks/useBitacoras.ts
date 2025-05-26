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

// Tipos extendidos para la UI que incluyen propiedades calculadas
export interface BitacoraSupervisorItem extends BitacoraSupervisor {
  id: string; // Alias para bitacora_id
  inmersion_codigo: string;
}

export interface BitacoraBuzoItem extends BitacoraBuzo {
  id: string; // Alias para bitacora_id
  inmersion_codigo: string;
}

// Tipos para formularios
export interface BitacoraSupervisorFormData {
  inmersion_id: string;
  supervisor: string;
  desarrollo_inmersion: string;
  evaluacion_general: string;
  incidentes?: string;
}

export interface BitacoraBuzoFormData {
  inmersion_id: string;
  buzo: string;
  profundidad_maxima: number;
  trabajos_realizados: string;
  estado_fisico_post: string;
  observaciones_tecnicas?: string;
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

  // Fetch bitácoras supervisor con datos enriquecidos
  const { data: bitacorasSupervisor = [], isLoading: loadingSupervisor } = useQuery({
    queryKey: ['bitacoras-supervisor'],
    queryFn: async () => {
      console.log('Fetching bitácoras supervisor...');
      const { data, error } = await supabase
        .from('bitacora_supervisor')
        .select(`
          *,
          inmersion:inmersion_id (codigo)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bitácoras supervisor:', error);
        throw error;
      }

      // Transformar datos para incluir propiedades esperadas por la UI
      return (data || []).map((item: any): BitacoraSupervisorItem => ({
        ...item,
        id: item.bitacora_id, // Alias para compatibilidad
        inmersion_codigo: item.inmersion?.codigo || 'N/A'
      }));
    },
  });

  // Fetch bitácoras buzo con datos enriquecidos
  const { data: bitacorasBuzo = [], isLoading: loadingBuzo } = useQuery({
    queryKey: ['bitacoras-buzo'],
    queryFn: async () => {
      console.log('Fetching bitácoras buzo...');
      const { data, error } = await supabase
        .from('bitacora_buzo')
        .select(`
          *,
          inmersion:inmersion_id (codigo)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bitácoras buzo:', error);
        throw error;
      }

      // Transformar datos para incluir propiedades esperadas por la UI
      return (data || []).map((item: any): BitacoraBuzoItem => ({
        ...item,
        id: item.bitacora_id, // Alias para compatibilidad
        inmersion_codigo: item.inmersion?.codigo || 'N/A'
      }));
    },
  });

  // Create bitácora supervisor - ahora activa las bitácoras de buzo
  const createBitacoraSupervisorMutation = useMutation({
    mutationFn: async (data: BitacoraSupervisorFormData) => {
      console.log('Creating bitácora supervisor:', data);
      
      const codigo = `BS-${Date.now().toString().slice(-6)}`;
      const fecha = new Date().toISOString().split('T')[0];

      const { data: result, error } = await supabase
        .from('bitacora_supervisor')
        .insert([{
          ...data,
          codigo,
          fecha,
          firmado: false
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating bitácora supervisor:', error);
        throw error;
      }

      // Obtener la información de la inmersión para crear bitácoras de buzo
      const { data: inmersionData, error: inmersionError } = await supabase
        .from('inmersion')
        .select('buzo_principal, buzo_asistente')
        .eq('inmersion_id', data.inmersion_id)
        .single();

      if (inmersionError) {
        console.error('Error fetching inmersion data:', inmersionError);
        // No lanzamos error aquí para no bloquear la creación de la bitácora supervisor
      } else if (inmersionData) {
        // Crear bitácoras de buzo automáticamente para el equipo
        const buzos = [inmersionData.buzo_principal];
        if (inmersionData.buzo_asistente) {
          buzos.push(inmersionData.buzo_asistente);
        }

        for (const buzo of buzos) {
          if (buzo && buzo.trim()) {
            const buzoCodigo = `BB-${Date.now().toString().slice(-6)}-${buzo.substring(0, 3).toUpperCase()}`;
            
            await supabase
              .from('bitacora_buzo')
              .insert([{
                inmersion_id: data.inmersion_id,
                buzo: buzo,
                codigo: buzoCodigo,
                fecha: fecha,
                profundidad_maxima: 0, // Se llenará después
                trabajos_realizados: '', // Se llenará después
                estado_fisico_post: '', // Se llenará después
                firmado: false
              }]);
          }
        }

        console.log(`Bitácoras de buzo creadas automáticamente para: ${buzos.join(', ')}`);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacoras-supervisor'] });
      queryClient.invalidateQueries({ queryKey: ['bitacoras-buzo'] });
      toast({
        title: "Bitácora Supervisor creada",
        description: "La bitácora ha sido creada y se habilitaron las bitácoras de buzo correspondientes.",
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

  // Create bitácora buzo - solo permitir si existe una bitácora supervisor
  const createBitacoraBuzoMutation = useMutation({
    mutationFn: async (data: BitacoraBuzoFormData) => {
      console.log('Creating bitácora buzo:', data);
      
      // Verificar que existe una bitácora supervisor para esta inmersión
      const { data: supervisorBitacora, error: supervisorError } = await supabase
        .from('bitacora_supervisor')
        .select('bitacora_id')
        .eq('inmersion_id', data.inmersion_id)
        .single();

      if (supervisorError || !supervisorBitacora) {
        throw new Error('No se puede crear una bitácora de buzo sin una bitácora de supervisor previa.');
      }
      
      const codigo = `BB-${Date.now().toString().slice(-6)}`;
      const fecha = new Date().toISOString().split('T')[0];

      const { data: result, error } = await supabase
        .from('bitacora_buzo')
        .insert([{
          ...data,
          codigo,
          fecha,
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
        description: error.message || "No se pudo crear la bitácora buzo.",
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

  const refreshBitacoras = () => {
    queryClient.invalidateQueries({ queryKey: ['bitacoras-supervisor'] });
    queryClient.invalidateQueries({ queryKey: ['bitacoras-buzo'] });
  };

  return {
    bitacorasSupervisor,
    bitacorasBuzo,
    isLoading: loadingSupervisor || loadingBuzo,
    loading: loadingSupervisor || loadingBuzo, // Alias para compatibilidad
    createBitacoraSupervisor: createBitacoraSupervisorMutation.mutateAsync,
    createBitacoraBuzo: createBitacoraBuzoMutation.mutateAsync,
    signBitacoraSupervisor: signBitacoraSupervisorMutation.mutateAsync,
    signBitacoraBuzo: signBitacoraBuzoMutation.mutateAsync,
    isCreating: createBitacoraSupervisorMutation.isPending || createBitacoraBuzoMutation.isPending,
    isSigning: signBitacoraSupervisorMutation.isPending || signBitacoraBuzoMutation.isPending,
    refreshBitacoras
  };
};
