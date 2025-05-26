
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
  // Para compatibilidad con componentes existentes
  id: string;
  inmersion_codigo?: string;
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
  // Para compatibilidad con componentes existentes
  id: string;
  inmersion_codigo?: string;
}

export interface BitacoraSupervisorFormData {
  inmersion_id: string;
  supervisor: string;
  fecha: string;
  desarrollo_inmersion: string;
  evaluacion_general: string;
  incidentes?: string;
}

export interface BitacoraBuzoFormData {
  inmersion_id: string;
  fecha: string;
  buzo: string;
  profundidad_maxima: number;
  trabajos_realizados: string;
  estado_fisico_post: string;
  observaciones_tecnicas?: string;
  // Extended fields for complete form
  folio: string;
  codigo_verificacion: string;
  empresa_nombre: string;
  centro_nombre: string;
  buzo_rut: string;
  supervisor_nombre: string;
  supervisor_rut: string;
  supervisor_correo: string;
  jefe_centro_correo: string;
  contratista_nombre: string;
  contratista_rut: string;
  // Condiciones ambientales
  condamb_estado_puerto: string;
  condamb_estado_mar: string;
  condamb_temp_aire_c: number;
  condamb_temp_agua_c: number;
  condamb_visibilidad_fondo_mts: number;
  condamb_corriente_fondo_nudos: number;
  // Datos técnicos del buceo
  datostec_equipo_usado: string;
  datostec_traje: string;
  datostec_hora_dejo_superficie: string;
  datostec_hora_llegada_fondo: string;
  datostec_hora_salida_fondo: string;
  datostec_hora_llegada_superficie: string;
  // Tiempos y tabulación
  tiempos_total_fondo: string;
  tiempos_total_descompresion: string;
  tiempos_total_buceo: string;
  tiempos_tabulacion_usada: string;
  tiempos_intervalo_superficie: string;
  tiempos_nitrogeno_residual: string;
  tiempos_grupo_repetitivo_anterior: string;
  tiempos_nuevo_grupo_repetitivo: string;
  // Objetivo del buceo
  objetivo_proposito: string;
  objetivo_tipo_area: string;
  objetivo_caracteristicas_dimensiones: string;
  // Condiciones y certificaciones
  condcert_buceo_altitud: boolean;
  condcert_certificados_equipos_usados: boolean;
  condcert_buceo_areas_confinadas: boolean;
  condcert_observaciones: string;
  // Firma final
  validador_nombre: string;
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

      return (data || []).map(item => ({
        ...item,
        id: item.bitacora_id,
      })) as BitacoraSupervisor[];
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

      return (data || []).map(item => ({
        ...item,
        id: item.bitacora_id,
      })) as BitacoraBuzo[];
    },
  });

  const loading = loadingSupervisor || loadingBuzo;

  // Create bitácora supervisor
  const createBitacoraSupervisorMutation = useMutation({
    mutationFn: async (data: BitacoraSupervisorFormData) => {
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
      
      const codigo = `BB-${Date.now().toString().slice(-6)}`;
      const { data: result, error } = await supabase
        .from('bitacora_buzo')
        .insert([{
          bitacora_id: crypto.randomUUID(),
          codigo,
          inmersion_id: data.inmersion_id,
          buzo: data.buzo,
          fecha: data.fecha,
          profundidad_maxima: data.profundidad_maxima,
          trabajos_realizados: data.trabajos_realizados,
          estado_fisico_post: data.estado_fisico_post,
          observaciones_tecnicas: data.observaciones_tecnicas,
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
    loading,
    createBitacoraSupervisor: createBitacoraSupervisorMutation.mutateAsync,
    createBitacoraBuzo: createBitacoraBuzoMutation.mutateAsync,
    refreshBitacoras,
    isCreatingSupervisor: createBitacoraSupervisorMutation.isPending,
    isCreatingBuzo: createBitacoraBuzoMutation.isPending,
  };
};
