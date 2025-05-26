
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface BitacoraSupervisor {
  bitacora_id: string;
  inmersion_id: string;
  supervisor: string;
  fecha: string;
  codigo: string;
  desarrollo_inmersion: string;
  evaluacion_general: string;
  incidentes?: string;
  supervisor_firma?: string;
  firmado: boolean;
  created_at: string;
  updated_at: string;
}

export interface BitacoraBuzo {
  bitacora_id: string;
  inmersion_id: string;
  buzo: string;
  fecha: string;
  codigo: string;
  profundidad_maxima: number;
  trabajos_realizados: string;
  estado_fisico_post: string;
  observaciones_tecnicas?: string;
  buzo_firma?: string;
  firmado: boolean;
  created_at: string;
  updated_at: string;
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
      return data as BitacoraSupervisor[];
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
      return data as BitacoraBuzo[];
    },
  });

  // Crear bitácora supervisor y activar bitácoras buzo
  const createBitacoraSupervisor = useMutation({
    mutationFn: async (data: Partial<BitacoraSupervisor>) => {
      const { data: result, error } = await supabase
        .from('bitacora_supervisor')
        .insert([{
          inmersion_id: data.inmersion_id,
          supervisor: data.supervisor || '',
          fecha: data.fecha || new Date().toISOString().split('T')[0],
          codigo: data.codigo || `BS-${Date.now()}`,
          desarrollo_inmersion: data.desarrollo_inmersion || '',
          evaluacion_general: data.evaluacion_general || '',
          incidentes: data.incidentes,
          firmado: false
        }])
        .select()
        .single();

      if (error) throw error;

      // Crear bitácoras buzo automáticamente para el equipo
      if (result) {
        await createBitacorasBuzoForTeam(result.inmersion_id, result);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacoras-supervisor'] });
      queryClient.invalidateQueries({ queryKey: ['bitacoras-buzo'] });
      toast({
        title: "Bitácora creada",
        description: "Bitácora de supervisor creada y bitácoras de buzos activadas",
      });
    },
  });

  // Función para crear bitácoras buzo automáticamente
  const createBitacorasBuzoForTeam = async (inmersionId: string, bitacoraSupervisor: BitacoraSupervisor) => {
    // Obtener información de la inmersión para determinar los buzos del equipo
    const { data: inmersion, error: inmersionError } = await supabase
      .from('inmersion')
      .select('buzo_principal, buzo_asistente')
      .eq('inmersion_id', inmersionId)
      .single();

    if (inmersionError || !inmersion) return;

    const buzos = [inmersion.buzo_principal, inmersion.buzo_asistente].filter(Boolean);

    // Crear bitácoras para cada buzo
    for (const buzo of buzos) {
      await supabase
        .from('bitacora_buzo')
        .insert([{
          inmersion_id: inmersionId,
          buzo: buzo,
          fecha: bitacoraSupervisor.fecha,
          codigo: `BB-${Date.now()}-${buzo}`,
          profundidad_maxima: 0, // Se completará después
          trabajos_realizados: bitacoraSupervisor.desarrollo_inmersion, // Pre-rellenado
          estado_fisico_post: '',
          firmado: false
        }]);
    }
  };

  // Completar bitácora buzo
  const completeBitacoraBuzo = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BitacoraBuzo> }) => {
      const { data: result, error } = await supabase
        .from('bitacora_buzo')
        .update(data)
        .eq('bitacora_id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacoras-buzo'] });
      toast({
        title: "Bitácora actualizada",
        description: "Bitácora de buzo completada exitosamente",
      });
    },
  });

  // Firmar bitácora
  const signBitacora = useMutation({
    mutationFn: async ({ id, type, signature }: { id: string; type: 'supervisor' | 'buzo'; signature: string }) => {
      const table = type === 'supervisor' ? 'bitacora_supervisor' : 'bitacora_buzo';
      const signatureField = type === 'supervisor' ? 'supervisor_firma' : 'buzo_firma';

      const { data: result, error } = await supabase
        .from(table)
        .update({ 
          [signatureField]: signature,
          firmado: true 
        })
        .eq('bitacora_id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacoras-supervisor'] });
      queryClient.invalidateQueries({ queryKey: ['bitacoras-buzo'] });
      toast({
        title: "Bitácora firmada",
        description: "Bitácora firmada exitosamente",
      });
    },
  });

  return {
    bitacorasSupervisor,
    bitacorasBuzo,
    loadingSupervisor,
    loadingBuzo,
    createBitacoraSupervisor: createBitacoraSupervisor.mutateAsync,
    completeBitacoraBuzo: completeBitacoraBuzo.mutateAsync,
    signBitacora: signBitacora.mutateAsync,
    isCreating: createBitacoraSupervisor.isPending,
    isUpdating: completeBitacoraBuzo.isPending,
    isSigning: signBitacora.isPending,
  };
};
