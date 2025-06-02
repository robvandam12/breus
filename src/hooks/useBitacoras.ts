import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Tipos para las bitácoras basados en la estructura de la base de datos
export interface BitacoraSupervisor {
  bitacora_id: string;
  codigo: string;
  inmersion_id: string;
  supervisor: string;
  desarrollo_inmersion: string;
  incidentes: string;
  evaluacion_general: string;
  fecha: string;
  firmado: boolean;
  estado_aprobacion: string;
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
  observaciones_tecnicas: string;
  firmado: boolean;
  estado_aprobacion: string;
  created_at: string;
  updated_at: string;
}

export interface InmersionCompleta {
  inmersion_id: string;
  codigo: string;
  fecha_inmersion: string;
  objetivo: string;
  supervisor: string;
  buzo_principal: string;
  hora_inicio: string;
  hora_fin?: string;
  operacion: {
    codigo: string;
    nombre: string;
    salmoneras?: {
      nombre: string;
    };
    contratistas?: {
      nombre: string;
    };
    sitios?: {
      nombre: string;
    };
  };
}

export interface BitacoraSupervisorFormData {
  codigo: string;
  inmersion_id: string;
  supervisor: string;
  desarrollo_inmersion: string;
  incidentes: string;
  evaluacion_general: string;
  fecha: string;
  firmado: boolean;
  estado_aprobacion: string;
  fecha_inicio_faena: string;
  hora_inicio_faena: string;
  hora_termino_faena: string;
  lugar_trabajo: string;
  supervisor_nombre_matricula: string;
  estado_mar: string;
  visibilidad_fondo: number;
  inmersiones_buzos: any[];
  equipos_utilizados: any[];
  trabajo_a_realizar: string;
  descripcion_trabajo: string;
  embarcacion_apoyo: string;
  observaciones_generales_texto: string;
  validacion_contratista: boolean;
  comentarios_validacion: string;
  diving_records: any[];
  folio?: string;
  codigo_verificacion?: string;
  empresa_nombre?: string;
  centro_nombre?: string;
}

export interface BitacoraBuzoFormData {
  codigo: string;
  inmersion_id: string;
  fecha: string;
  buzo: string;
  profundidad_maxima: number;
  trabajos_realizados: string;
  estado_fisico_post: string;
  observaciones_tecnicas: string;
  firmado: boolean;
  estado_aprobacion: string;
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
  condamb_estado_puerto: string;
  condamb_estado_mar: string;
  condamb_temp_aire_c: number;
  condamb_temp_agua_c: number;
  condamb_visibilidad_fondo_mts: number;
  condamb_corriente_fondo_nudos: number;
  datostec_equipo_usado: string;
  datostec_traje: string;
  datostec_hora_dejo_superficie: string;
  datostec_hora_llegada_fondo: string;
  datostec_hora_salida_fondo: string;
  datostec_hora_llegada_superficie: string;
  tiempos_total_fondo: string;
  tiempos_total_descompresion: string;
  tiempos_total_buceo: string;
  tiempos_tabulacion_usada: string;
  tiempos_intervalo_superficie: string;
  tiempos_nitrogeno_residual: string;
  tiempos_grupo_repetitivo_anterior: string;
  tiempos_nuevo_grupo_repetitivo: string;
  objetivo_proposito: string;
  objetivo_tipo_area: string;
  objetivo_caracteristicas_dimensiones: string;
  condcert_buceo_altitud: boolean;
  condcert_certificados_equipos_usados: boolean;
  condcert_buceo_areas_confinadas: boolean;
  condcert_observaciones: string;
  validador_nombre: string;
}

export const useBitacoras = () => {
  const queryClient = useQueryClient();

  const { data: bitacorasSupervisor = [], isLoading: loadingSupervisor } = useQuery({
    queryKey: ['bitacoras-supervisor'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bitacora_supervisor')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BitacoraSupervisor[];
    }
  });

  const { data: bitacorasBuzo = [], isLoading: loadingBuzo } = useQuery({
    queryKey: ['bitacoras-buzo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bitacora_buzo')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BitacoraBuzo[];
    }
  });

  const createBitacoraSupervisor = useMutation({
    mutationFn: async (data: BitacoraSupervisorFormData) => {
      const { data: result, error } = await supabase
        .from('bitacora_supervisor')
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacoras-supervisor'] });
    }
  });

  const createBitacoraBuzo = useMutation({
    mutationFn: async (data: BitacoraBuzoFormData) => {
      const { data: result, error } = await supabase
        .from('bitacora_buzo')
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacoras-buzo'] });
    }
  });

  const refreshBitacoras = () => {
    queryClient.invalidateQueries({ queryKey: ['bitacoras-supervisor'] });
    queryClient.invalidateQueries({ queryKey: ['bitacoras-buzo'] });
  };

  return {
    bitacorasSupervisor,
    bitacorasBuzo,
    loadingSupervisor,
    loadingBuzo,
    loading: loadingSupervisor || loadingBuzo,
    createBitacoraSupervisor,
    createBitacoraBuzo,
    refreshBitacoras
  };
};
