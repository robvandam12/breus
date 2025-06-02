
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
  // Nuevos campos completos
  folio?: string;
  codigo_verificacion?: string;
  empresa_nombre?: string;
  centro_nombre?: string;
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
  // Nuevos campos completos
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

export interface BitacoraSupervisorFormData extends Omit<BitacoraSupervisor, 'bitacora_id' | 'created_at' | 'updated_at'> {}

export interface BitacoraBuzoFormData extends Omit<BitacoraBuzo, 'bitacora_id' | 'created_at' | 'updated_at'> {}

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
        .insert([{
          codigo: data.codigo,
          inmersion_id: data.inmersion_id,
          supervisor: data.supervisor,
          fecha: data.fecha,
          desarrollo_inmersion: data.desarrollo_inmersion,
          incidentes: data.incidentes || "",
          evaluacion_general: data.evaluacion_general,
          firmado: false,
          estado_aprobacion: 'pendiente',
          // Todos los campos adicionales
          folio: data.folio,
          codigo_verificacion: data.codigo_verificacion,
          empresa_nombre: data.empresa_nombre,
          centro_nombre: data.centro_nombre,
          fecha_inicio_faena: data.fecha_inicio_faena,
          hora_inicio_faena: data.hora_inicio_faena,
          hora_termino_faena: data.hora_termino_faena,
          lugar_trabajo: data.lugar_trabajo,
          supervisor_nombre_matricula: data.supervisor_nombre_matricula,
          estado_mar: data.estado_mar,
          visibilidad_fondo: data.visibilidad_fondo,
          inmersiones_buzos: data.inmersiones_buzos || [],
          equipos_utilizados: data.equipos_utilizados || [],
          trabajo_a_realizar: data.trabajo_a_realizar,
          descripcion_trabajo: data.descripcion_trabajo,
          embarcacion_apoyo: data.embarcacion_apoyo,
          observaciones_generales_texto: data.observaciones_generales_texto,
          validacion_contratista: data.validacion_contratista || false,
          comentarios_validacion: data.comentarios_validacion,
          diving_records: data.diving_records || []
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
      
      const { data: result, error } = await supabase
        .from('bitacora_buzo')
        .insert([{
          codigo: data.codigo,
          inmersion_id: data.inmersion_id,
          buzo: data.buzo,
          fecha: data.fecha,
          trabajos_realizados: data.trabajos_realizados,
          observaciones_tecnicas: data.observaciones_tecnicas || "",
          estado_fisico_post: data.estado_fisico_post,
          profundidad_maxima: data.profundidad_maxima,
          firmado: false,
          estado_aprobacion: 'pendiente',
          // Todos los campos adicionales
          folio: data.folio,
          codigo_verificacion: data.codigo_verificacion,
          empresa_nombre: data.empresa_nombre,
          centro_nombre: data.centro_nombre,
          buzo_rut: data.buzo_rut,
          supervisor_nombre: data.supervisor_nombre,
          supervisor_rut: data.supervisor_rut,
          supervisor_correo: data.supervisor_correo,
          jefe_centro_correo: data.jefe_centro_correo,
          contratista_nombre: data.contratista_nombre,
          contratista_rut: data.contratista_rut,
          // Condiciones ambientales
          condamb_estado_puerto: data.condamb_estado_puerto,
          condamb_estado_mar: data.condamb_estado_mar,
          condamb_temp_aire_c: data.condamb_temp_aire_c,
          condamb_temp_agua_c: data.condamb_temp_agua_c,
          condamb_visibilidad_fondo_mts: data.condamb_visibilidad_fondo_mts,
          condamb_corriente_fondo_nudos: data.condamb_corriente_fondo_nudos,
          // Datos técnicos del buceo
          datostec_equipo_usado: data.datostec_equipo_usado,
          datostec_traje: data.datostec_traje,
          datostec_hora_dejo_superficie: data.datostec_hora_dejo_superficie,
          datostec_hora_llegada_fondo: data.datostec_hora_llegada_fondo,
          datostec_hora_salida_fondo: data.datostec_hora_salida_fondo,
          datostec_hora_llegada_superficie: data.datostec_hora_llegada_superficie,
          // Tiempos y tabulación
          tiempos_total_fondo: data.tiempos_total_fondo,
          tiempos_total_descompresion: data.tiempos_total_descompresion,
          tiempos_total_buceo: data.tiempos_total_buceo,
          tiempos_tabulacion_usada: data.tiempos_tabulacion_usada,
          tiempos_intervalo_superficie: data.tiempos_intervalo_superficie,
          tiempos_nitrogeno_residual: data.tiempos_nitrogeno_residual,
          tiempos_grupo_repetitivo_anterior: data.tiempos_grupo_repetitivo_anterior,
          tiempos_nuevo_grupo_repetitivo: data.tiempos_nuevo_grupo_repetitivo,
          // Objetivo del buceo
          objetivo_proposito: data.objetivo_proposito,
          objetivo_tipo_area: data.objetivo_tipo_area,
          objetivo_caracteristicas_dimensiones: data.objetivo_caracteristicas_dimensiones,
          // Condiciones y certificaciones
          condcert_buceo_altitud: data.condcert_buceo_altitud || false,
          condcert_certificados_equipos_usados: data.condcert_certificados_equipos_usados || false,
          condcert_buceo_areas_confinadas: data.condcert_buceo_areas_confinadas || false,
          condcert_observaciones: data.condcert_observaciones,
          // Validador final
          validador_nombre: data.validador_nombre
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
    loading: loadingSupervisor || loadingBuzo,
    createBitacoraSupervisor: createBitacoraSupervisorMutation.mutateAsync,
    createBitacoraBuzo: createBitacoraBuzoMutation.mutateAsync,
    isCreatingSupervisor: createBitacoraSupervisorMutation.isPending,
    isCreatingBuzo: createBitacoraBuzoMutation.isPending,
    refreshBitacoras,
  };
};
