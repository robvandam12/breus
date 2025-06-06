
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
  operacion_id: string;
  supervisor_id?: string;
  buzo_principal_id?: string;
  operacion?: {
    id: string;
    nombre: string;
    codigo: string;
    equipo_buceo_id?: string;
    salmoneras?: { nombre: string };
    contratistas?: { nombre: string };
    sitios?: { nombre: string };
    equipos_buceo?: { nombre: string };
  };
}

export interface EquipoBuceoMiembroCompleto {
  id: string;
  equipo_id: string;
  usuario_id: string;
  rol_equipo: string;
  disponible: boolean;
  created_at: string;
  usuario?: {
    nombre: string;
    apellido: string;
    email: string;
  };
}

export interface EquipoBuceoCompleto {
  id: string;
  nombre: string;
  descripcion?: string;
  tipo_empresa: string;
  empresa_id: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
  miembros?: EquipoBuceoMiembroCompleto[];
}

export interface BitacoraSupervisorCompleta {
  bitacora_id: string;
  codigo: string;
  inmersion_id: string;
  supervisor: string;
  desarrollo_inmersion: string;
  incidentes: string;
  evaluacion_general: string;
  fecha: string;
  firmado: boolean;
  estado_aprobacion: 'pendiente' | 'aprobada' | 'rechazada';
  created_at: string;
  updated_at: string;
  inmersion?: InmersionCompleta;
  
  // Campos adicionales opcionales
  folio?: string;
  codigo_verificacion?: string;
  empresa_nombre?: string;
  centro_nombre?: string;
  fecha_inicio_faena?: string;
  hora_inicio_faena?: string;
  fecha_termino_faena?: string;
  hora_termino_faena?: string;
  lugar_trabajo?: string;
  tipo_trabajo?: string;
  supervisor_nombre_matricula?: string;
  buzos_asistentes?: any[];
  equipos_utilizados?: any[];
  condiciones_fisicas_previas?: string;
  incidentes_menores?: string;
  embarcacion_nombre?: string;
  embarcacion_matricula?: string;
  tiempo_total_buceo?: string;
  incluye_descompresion?: boolean;
  contratista_nombre?: string;
  buzo_apellido_paterno?: string;
  buzo_apellido_materno?: string;
  buzo_nombres?: string;
  buzo_run?: string;
  profundidad_trabajo?: number;
  profundidad_maxima?: number;
  camara_hiperbarica_requerida?: boolean;
  evaluacion_riesgos_actualizada?: boolean;
  procedimientos_escritos_disponibles?: boolean;
  capacitacion_previa_realizada?: boolean;
  identificacion_peligros_realizada?: boolean;
  registro_incidentes_reportados?: boolean;
  medidas_correctivas?: string;
  observaciones_generales?: string;
}

export interface BitacoraBuzoCompleta {
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
  estado_aprobacion: 'pendiente' | 'aprobada' | 'rechazada';
  created_at: string;
  updated_at: string;
  inmersion?: InmersionCompleta;
  bitacora_supervisor_id?: string;
  
  // Campos adicionales opcionales
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
  condamb_estado_puerto?: string;
  condamb_estado_mar?: string;
  condamb_temp_aire_c?: number;
  condamb_temp_agua_c?: number;
  condamb_visibilidad_fondo_mts?: number;
  condamb_corriente_fondo_nudos?: number;
  datostec_equipo_usado?: string;
  datostec_traje?: string;
  datostec_hora_dejo_superficie?: string;
  datostec_hora_llegada_fondo?: string;
  datostec_hora_salida_fondo?: string;
  datostec_hora_llegada_superficie?: string;
  tiempos_total_fondo?: string;
  tiempos_total_descompresion?: string;
  tiempos_total_buceo?: string;
  tiempos_tabulacion_usada?: string;
  tiempos_intervalo_superficie?: string;
  tiempos_nitrogeno_residual?: string;
  tiempos_grupo_repetitivo_anterior?: string;
  tiempos_nuevo_grupo_repetitivo?: string;
  objetivo_proposito?: string;
  objetivo_tipo_area?: string;
  objetivo_caracteristicas_dimensiones?: string;
  condcert_buceo_altitud?: boolean;
  condcert_certificados_equipos_usados?: boolean;
  condcert_buceo_areas_confinadas?: boolean;
  condcert_observaciones?: string;
  validador_nombre?: string;
}

export interface BitacoraBuzoFormData {
  codigo: string;
  inmersion_id: string;
  buzo_id?: string;
  buzo: string;
  fecha: string;
  profundidad_maxima: number;
  trabajos_realizados: string;
  estado_fisico_post: string;
  observaciones_tecnicas?: string;
  firmado: boolean;
  estado_aprobacion: 'pendiente' | 'aprobada' | 'rechazada';
  
  // Campos completos opcionales
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
  
  // Validador final
  validador_nombre?: string;
}

// Interfaz completa para Bitácora Supervisor con todos los campos requeridos
export interface BitacoraSupervisorFormData {
  codigo: string;
  inmersion_id: string;
  supervisor: string;
  supervisor_id?: string;
  fecha: string;
  
  // 1. Identificación de la Faena
  fecha_inicio_faena: string;
  hora_inicio_faena: string;
  fecha_termino_faena?: string;
  hora_termino_faena?: string;
  lugar_trabajo: string;
  tipo_trabajo: string;
  supervisor_nombre_matricula: string;
  
  // 2. Buzos y Asistentes (hasta 6 personas)
  buzos_asistentes: Array<{
    nombre: string;
    matricula: string;
    cargo: string;
    numero_serie_profundimetro: string;
    color_profundimetro: string;
  }>;
  
  // 3. Equipos Usados
  equipos_utilizados: Array<{
    equipo_usado: string;
    numero_registro: string;
  }>;
  
  // 4. Observaciones
  condiciones_fisicas_previas: string;
  incidentes_menores?: string;
  
  // 5. Embarcación de Apoyo
  embarcacion_nombre?: string;
  embarcacion_matricula?: string;
  
  // 6. Tiempo de Buceo
  tiempo_total_buceo: string;
  incluye_descompresion: boolean;
  
  // 7. Contratista de Buceo
  contratista_nombre: string;
  
  // 8. Datos del Buzo Principal
  buzo_apellido_paterno: string;
  buzo_apellido_materno: string;
  buzo_nombres: string;
  buzo_run: string;
  
  // 9. Profundidades
  profundidad_trabajo: number;
  profundidad_maxima: number;
  camara_hiperbarica_requerida: boolean;
  
  // 10. Gestión Preventiva Según Decreto N°44
  evaluacion_riesgos_actualizada: boolean;
  procedimientos_escritos_disponibles: boolean;
  capacitacion_previa_realizada: boolean;
  identificacion_peligros_realizada: boolean;
  registro_incidentes_reportados: boolean;
  
  // 11. Medidas Correctivas Implementadas
  medidas_correctivas: string;
  
  // 12. Observaciones Generales
  observaciones_generales: string;
  
  // Campos existentes para compatibilidad
  desarrollo_inmersion: string;
  incidentes?: string;
  evaluacion_general: string;
  firmado: boolean;
  estado_aprobacion: 'pendiente' | 'aprobada' | 'rechazada';
  
  // Campos opcionales existentes
  folio?: string;
  codigo_verificacion?: string;
  empresa_nombre?: string;
  centro_nombre?: string;
  estado_mar?: string;
  visibilidad_fondo?: number;
  trabajo_a_realizar?: string;
  descripcion_trabajo?: string;
  embarcacion_apoyo?: string;
  observaciones_generales_texto?: string;
  validacion_contratista?: boolean;
  comentarios_validacion?: string;
}

export const useBitacoraEnhanced = () => {
  const queryClient = useQueryClient();

  // Obtener inmersiones con información completa
  const { data: inmersiones = [], isLoading: loadingInmersiones } = useQuery<InmersionCompleta[]>({
    queryKey: ['inmersiones-completas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inmersion')
        .select(`
          *,
          operacion:operacion_id(
            *,
            salmoneras:salmonera_id(nombre),
            sitios:sitio_id(nombre),
            contratistas:contratista_id(nombre),
            equipos_buceo:equipo_buceo_id(nombre)
          )
        `)
        .order('fecha_inmersion', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Obtener bitácoras de supervisor con inmersiones
  const { data: bitacorasSupervisor = [], isLoading: loadingSupervisor } = useQuery<BitacoraSupervisorCompleta[]>({
    queryKey: ['bitacoras-supervisor-completas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bitacora_supervisor')
        .select(`
          *,
          inmersion:inmersion_id(
            *,
            operacion:operacion_id(
              *,
              salmoneras:salmonera_id(nombre),
              sitios:sitio_id(nombre),
              contratistas:contratista_id(nombre),
              equipos_buceo:equipo_buceo_id(nombre)
            )
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Mapear los datos para asegurar tipos correctos y manejar arrays JSON
      return (data || []).map(item => ({
        ...item,
        estado_aprobacion: (item.estado_aprobacion || 'pendiente') as 'pendiente' | 'aprobada' | 'rechazada',
        buzos_asistentes: Array.isArray(item.buzos_asistentes) ? item.buzos_asistentes : 
          (item.buzos_asistentes ? JSON.parse(item.buzos_asistentes as string) : []),
        equipos_utilizados: Array.isArray(item.equipos_utilizados) ? item.equipos_utilizados : 
          (item.equipos_utilizados ? JSON.parse(item.equipos_utilizados as string) : [])
      }));
    }
  });

  // Obtener bitácoras de buzo con inmersiones
  const { data: bitacorasBuzo = [], isLoading: loadingBuzo } = useQuery<BitacoraBuzoCompleta[]>({
    queryKey: ['bitacoras-buzo-completas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bitacora_buzo')
        .select(`
          *,
          inmersion:inmersion_id(
            *,
            operacion:operacion_id(
              *,
              salmoneras:salmonera_id(nombre),
              sitios:sitio_id(nombre),
              contratistas:contratista_id(nombre),
              equipos_buceo:equipo_buceo_id(nombre)
            )
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Mapear los datos para asegurar tipos correctos
      return (data || []).map(item => ({
        ...item,
        estado_aprobacion: (item.estado_aprobacion || 'pendiente') as 'pendiente' | 'aprobada' | 'rechazada'
      }));
    }
  });

  // Buscar bitácora de supervisor para una inmersión específica
  const getBitacoraSupervisorForInmersion = async (inmersionId: string): Promise<BitacoraSupervisorCompleta | null> => {
    const { data, error } = await supabase
      .from('bitacora_supervisor')
      .select(`
        *,
        inmersion:inmersion_id(
          *,
          operacion:operacion_id(
            *,
            salmoneras:salmonera_id(nombre),
            sitios:sitio_id(nombre),
            contratistas:contratista_id(nombre),
            equipos_buceo:equipo_buceo_id(nombre)
          )
        )
      `)
      .eq('inmersion_id', inmersionId)
      .maybeSingle();

    if (error) throw error;
    
    if (!data) return null;
    
    return {
      ...data,
      estado_aprobacion: (data.estado_aprobacion || 'pendiente') as 'pendiente' | 'aprobada' | 'rechazada',
      buzos_asistentes: Array.isArray(data.buzos_asistentes) ? data.buzos_asistentes : 
        (data.buzos_asistentes ? JSON.parse(data.buzos_asistentes as string) : []),
      equipos_utilizados: Array.isArray(data.equipos_utilizados) ? data.equipos_utilizados : 
        (data.equipos_utilizados ? JSON.parse(data.equipos_utilizados as string) : [])
    };
  };

  // Verificar si existe bitácora de supervisor para una inmersión
  const checkSupervisorBitacoraExists = async (inmersionId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('bitacora_supervisor')
      .select('bitacora_id')
      .eq('inmersion_id', inmersionId)
      .limit(1);

    if (error) throw error;
    return (data && data.length > 0) || false;
  };

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ['inmersiones-completas'] });
    queryClient.invalidateQueries({ queryKey: ['bitacoras-supervisor-completas'] });
    queryClient.invalidateQueries({ queryKey: ['bitacoras-buzo-completas'] });
  };

  return {
    inmersiones,
    bitacorasSupervisor,
    bitacorasBuzo,
    loadingInmersiones,
    loadingSupervisor,
    loadingBuzo,
    loading: loadingInmersiones || loadingSupervisor || loadingBuzo,
    getBitacoraSupervisorForInmersion,
    checkSupervisorBitacoraExists,
    refreshAll
  };
};
