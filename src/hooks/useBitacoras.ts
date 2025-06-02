
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
  equipo_buceo_id?: string;
  operacion_id?: string;
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
  equipo_buceo_id?: string;
  operacion_id?: string;
  bitacora_supervisor_id?: string;
}

// Tipos simplificados para evitar recursión infinita
export interface InmersionCompleta {
  inmersion_id: string;
  codigo: string;
  fecha_inmersion: string;
  objetivo: string;
  supervisor: string;
  buzo_principal: string;
  hora_inicio: string;
  hora_fin?: string;
  profundidad_max: number;
  temperatura_agua: number;
  visibilidad: number;
  corriente: string;
  equipo_buceo_id?: string;
  operacion: {
    id: string;
    codigo: string;
    nombre: string;
    equipo_buceo_id?: string;
    salmoneras?: { nombre: string } | null;
    contratistas?: { nombre: string } | null;
    sitios?: { nombre: string } | null;
    equipos_buceo?: {
      id: string;
      nombre: string;
    } | null;
  };
}

export interface BitacoraSupervisorFormData {
  codigo: string; // Agregada la propiedad faltante
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
  equipo_buceo_id?: string;
  operacion_id?: string;
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
  equipo_buceo_id?: string;
  operacion_id?: string;
  bitacora_supervisor_id?: string;
}

// Hook mejorado para manejar bitácoras con equipos
export const useBitacoras = () => {
  const queryClient = useQueryClient();

  // Obtener inmersiones con información completa del equipo
  const { data: inmersiones = [], isLoading: loadingInmersiones } = useQuery({
    queryKey: ['inmersiones-con-equipos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inmersion')
        .select(`
          *,
          operacion:operacion_id(
            *,
            salmoneras(nombre),
            contratistas(nombre),
            sitios(nombre),
            equipos_buceo(
              id,
              nombre
            )
          )
        `)
        .order('fecha_inmersion', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: bitacorasSupervisor = [], isLoading: loadingSupervisor } = useQuery({
    queryKey: ['bitacoras-supervisor'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bitacora_supervisor')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
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
      return data || [];
    }
  });

  const createBitacoraSupervisor = useMutation({
    mutationFn: async (data: BitacoraSupervisorFormData) => {
      // Obtener información del equipo y operación si viene de inmersión
      let equipoId = data.equipo_buceo_id;
      let operacionId = data.operacion_id;

      if (data.inmersion_id && !equipoId) {
        const { data: inmersion } = await supabase
          .from('inmersion')
          .select('operacion:operacion_id(id, equipo_buceo_id)')
          .eq('inmersion_id', data.inmersion_id)
          .single();
        
        if (inmersion?.operacion) {
          equipoId = inmersion.operacion.equipo_buceo_id;
          operacionId = inmersion.operacion.id;
        }
      }

      const { data: result, error } = await supabase
        .from('bitacora_supervisor')
        .insert([{
          ...data,
          equipo_buceo_id: equipoId,
          operacion_id: operacionId
        }])
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
      // Obtener información del equipo y operación si viene de inmersión
      let equipoId = data.equipo_buceo_id;
      let operacionId = data.operacion_id;
      let bitacoraSupervisorId = data.bitacora_supervisor_id;

      if (data.inmersion_id && !equipoId) {
        const { data: inmersion } = await supabase
          .from('inmersion')
          .select('operacion:operacion_id(id, equipo_buceo_id)')
          .eq('inmersion_id', data.inmersion_id)
          .single();
        
        if (inmersion?.operacion) {
          equipoId = inmersion.operacion.equipo_buceo_id;
          operacionId = inmersion.operacion.id;
        }
      }

      // Buscar bitácora de supervisor del mismo equipo para esta inmersión
      if (equipoId && data.inmersion_id && !bitacoraSupervisorId) {
        const { data: supervisorBitacora } = await supabase
          .from('bitacora_supervisor')
          .select('bitacora_id')
          .eq('inmersion_id', data.inmersion_id)
          .eq('equipo_buceo_id', equipoId)
          .single();
        
        if (supervisorBitacora) {
          bitacoraSupervisorId = supervisorBitacora.bitacora_id;
        }
      }

      const { data: result, error } = await supabase
        .from('bitacora_buzo')
        .insert([{
          ...data,
          equipo_buceo_id: equipoId,
          operacion_id: operacionId,
          bitacora_supervisor_id: bitacoraSupervisorId
        }])
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
    queryClient.invalidateQueries({ queryKey: ['inmersiones-con-equipos'] });
  };

  return {
    inmersiones,
    bitacorasSupervisor,
    bitacorasBuzo,
    loadingInmersiones,
    loadingSupervisor,
    loadingBuzo,
    loading: loadingSupervisor || loadingBuzo || loadingInmersiones,
    createBitacoraSupervisor,
    createBitacoraBuzo,
    refreshBitacoras
  };
};
