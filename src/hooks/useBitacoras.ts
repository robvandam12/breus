
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Tipos básicos simplificados
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

// Interfaz que coincide exactamente con el esquema de la base de datos
export interface BitacoraSupervisorFormData {
  codigo: string;
  inmersion_id: string;
  supervisor: string;
  desarrollo_inmersion: string;
  incidentes: string;
  evaluacion_general: string;
  fecha: string;
  firmado: boolean;
  estado_aprobacion: 'pendiente' | 'aprobada' | 'rechazada';
  // Campos requeridos por la base de datos
  fecha_inicio_faena?: string;
  hora_inicio_faena?: string;
  hora_termino_faena?: string;
  lugar_trabajo?: string;
  supervisor_nombre_matricula?: string;
  estado_mar?: string;
  visibilidad_fondo?: number;
  inmersiones_buzos?: any[];
  equipos_utilizados?: any[];
  trabajo_a_realizar?: string;
  descripcion_trabajo?: string;
  embarcacion_apoyo?: string;
  observaciones_generales_texto?: string;
  validacion_contratista?: boolean;
  comentarios_validacion?: string;
  diving_records?: any[];
  // Campos adicionales para compatibilidad
  supervisor_id?: string;
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
  buzo: string;
  fecha: string;
  profundidad_maxima: number;
  trabajos_realizados: string;
  estado_fisico_post: string;
  observaciones_tecnicas?: string;
  firmado: boolean;
  estado_aprobacion?: 'pendiente' | 'aprobada' | 'rechazada';
  // Campos adicionales para formulario completo
  folio?: string;
  codigo_verificacion?: string;
  empresa_nombre?: string;
  centro_nombre?: string;
  buzo_rut?: string;
  supervisor_nombre?: string;
  supervisor_rut?: string;
  supervisor_correo?: string;
  jefe_centro_correo?: string;
  contratista_nombre?: string;
  contratista_rut?: string;
  // Condiciones ambientales
  condamb_estado_puerto?: string;
  condamb_estado_mar?: string;
  condamb_temp_aire_c?: number;
  condamb_temp_agua_c?: number;
  condamb_visibilidad_fondo_mts?: number;
  condamb_corriente_fondo_nudos?: number;
  // Datos técnicos del buceo
  datostec_equipo_usado?: string;
  datostec_traje?: string;
  datostec_hora_dejo_superficie?: string;
  datostec_hora_llegada_fondo?: string;
  datostec_hora_salida_fondo?: string;
  datostec_hora_llegada_superficie?: string;
  // Tiempos y tabulación
  tiempos_total_fondo?: string;
  tiempos_total_descompresion?: string;
  tiempos_total_buceo?: string;
  tiempos_tabulacion_usada?: string;
  tiempos_intervalo_superficie?: string;
  tiempos_nitrogeno_residual?: string;
  tiempos_grupo_repetitivo_anterior?: string;
  tiempos_nuevo_grupo_repetitivo?: string;
  // Objetivo del buceo
  objetivo_proposito?: string;
  objetivo_tipo_area?: string;
  objetivo_caracteristicas_dimensiones?: string;
  // Condiciones y certificaciones
  condcert_buceo_altitud?: boolean;
  condcert_certificados_equipos_usados?: boolean;
  condcert_buceo_areas_confinadas?: boolean;
  condcert_observaciones?: string;
  // Firma final
  validador_nombre?: string;
}

// Hook simplificado para manejar bitácoras
export const useBitacoras = () => {
  const queryClient = useQueryClient();

  // Obtener inmersiones con información básica
  const { data: inmersiones = [], isLoading: loadingInmersiones } = useQuery<any[]>({
    queryKey: ['inmersiones-con-equipos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inmersion')
        .select(`
          *,
          operacion:operacion_id(
            *,
            salmoneras:salmonera_id(nombre),
            sitios:sitio_id(nombre),
            contratistas:contratista_id(nombre)
          )
        `)
        .order('fecha_inmersion', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: bitacorasSupervisor = [], isLoading: loadingSupervisor } = useQuery<BitacoraSupervisor[]>({
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

  const { data: bitacorasBuzo = [], isLoading: loadingBuzo } = useQuery<BitacoraBuzo[]>({
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

  const createBitacoraSupervisor = useMutation<BitacoraSupervisor, Error, BitacoraSupervisorFormData>({
    mutationFn: async (data: BitacoraSupervisorFormData) => {
      // Preparar los datos para la inserción, asegurando que todos los campos requeridos estén presentes
      const insertData = {
        codigo: data.codigo,
        inmersion_id: data.inmersion_id,
        supervisor: data.supervisor,
        desarrollo_inmersion: data.desarrollo_inmersion,
        incidentes: data.incidentes || '',
        evaluacion_general: data.evaluacion_general,
        fecha: data.fecha,
        firmado: data.firmado,
        estado_aprobacion: data.estado_aprobacion,
        fecha_inicio_faena: data.fecha_inicio_faena || '',
        hora_inicio_faena: data.hora_inicio_faena || '',
        hora_termino_faena: data.hora_termino_faena || '',
        lugar_trabajo: data.lugar_trabajo || '',
        supervisor_nombre_matricula: data.supervisor_nombre_matricula || '',
        estado_mar: data.estado_mar || '',
        visibilidad_fondo: data.visibilidad_fondo || 0,
        inmersiones_buzos: data.inmersiones_buzos || [],
        equipos_utilizados: data.equipos_utilizados || [],
        trabajo_a_realizar: data.trabajo_a_realizar || '',
        descripcion_trabajo: data.descripcion_trabajo || '',
        embarcacion_apoyo: data.embarcacion_apoyo || '',
        observaciones_generales_texto: data.observaciones_generales_texto || '',
        validacion_contratista: data.validacion_contratista || false,
        comentarios_validacion: data.comentarios_validacion || '',
        diving_records: data.diving_records || []
      };

      const { data: result, error } = await supabase
        .from('bitacora_supervisor')
        .insert([insertData])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacoras-supervisor'] });
    }
  });

  const createBitacoraBuzo = useMutation<BitacoraBuzo, Error, BitacoraBuzoFormData>({
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

  const checkCanDeleteInmersion = async (inmersionId: string): Promise<{ canDelete: boolean; reason?: string }> => {
    try {
      const { data: bitacorasSup } = await supabase
        .from('bitacora_supervisor')
        .select('bitacora_id')
        .eq('inmersion_id', inmersionId);

      if (bitacorasSup && bitacorasSup.length > 0) {
        return { canDelete: false, reason: 'La inmersión tiene bitácoras de supervisor asociadas' };
      }

      const { data: bitacorasBuz } = await supabase
        .from('bitacora_buzo')
        .select('bitacora_id')
        .eq('inmersion_id', inmersionId);

      if (bitacorasBuz && bitacorasBuz.length > 0) {
        return { canDelete: false, reason: 'La inmersión tiene bitácoras de buzo asociadas' };
      }

      return { canDelete: true };
    } catch (error) {
      console.error('Error checking if immersion can be deleted:', error);
      return { canDelete: false, reason: 'Error al verificar bitácoras asociadas' };
    }
  };

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
    checkCanDeleteInmersion,
    refreshBitacoras
  };
};
