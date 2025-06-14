import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, Json } from '@/integrations/supabase/types';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { Inmersion } from './useInmersiones';

// Nueva interfaz para Inmersión con detalles de operación
export interface InmersionCompleta extends Inmersion {
  operacion: {
    id: string;
    nombre: string;
    equipo_buceo_id?: string | null;
    salmoneras?: { nombre: string } | null;
    contratistas?: { nombre: string } | null;
    sitios?: { nombre: string } | null;
  } | null;
}

// Interfaces unificadas para Bitácoras Completas
export interface BitacoraSupervisorCompleta extends Omit<Tables<'bitacora_supervisor'>, 'aprobada_por' | 'inmersiones_buzos' | 'equipos_utilizados' | 'diving_records'> {
  inmersion: InmersionCompleta | null;
  supervisor_data?: { id: string; nombre: string; } | null;
  aprobador_data?: { id: string; nombre: string; } | null;
  inmersiones_buzos: any[] | null;
  equipos_utilizados: any[] | null;
  diving_records: any[] | null;
}

export interface BitacoraBuzoCompleta extends Omit<Tables<'bitacora_buzo'>, 'aprobada_por'> {
  inmersion: InmersionCompleta | null;
}

// Esquemas Zod para formularios
const bitacoraSupervisorFormSchema = z.object({
  codigo: z.string(),
  inmersion_id: z.string().uuid(),
  supervisor_id: z.string().uuid().optional(),
  supervisor: z.string().optional(),
  desarrollo_inmersion: z.string(),
  incidentes: z.string().optional(),
  evaluacion_general: z.string(),
  fecha: z.string(),
  firmado: z.boolean().default(false),
  estado_aprobacion: z.string().default('pendiente'),
  fecha_inicio_faena: z.string().optional(),
  hora_inicio_faena: z.string().optional(),
  hora_termino_faena: z.string().optional(),
  lugar_trabajo: z.string().optional(),
  supervisor_nombre_matricula: z.string().optional(),
  estado_mar: z.string().optional(),
  visibilidad_fondo: z.number().optional(),
  inmersiones_buzos: z.array(z.any()).optional(),
  equipos_utilizados: z.array(z.any()).optional(),
  trabajo_a_realizar: z.string().optional(),
  descripcion_trabajo: z.string().optional(),
  embarcacion_apoyo: z.string().optional(),
  observaciones_generales_texto: z.string().optional(),
  validacion_contratista: z.boolean().optional(),
  comentarios_validacion: z.string().optional(),
  diving_records: z.array(z.any()).optional(),
  operacion_id: z.string().uuid().optional(),
  empresa_nombre: z.string().optional(),
  centro_nombre: z.string().optional(),
  equipo_buceo_id: z.string().uuid().optional(),
  buzos_asistentes: z.array(z.any()).optional(),
  fecha_termino_faena: z.string().optional(),
});

export type BitacoraSupervisorFormData = z.infer<typeof bitacoraSupervisorFormSchema>;

const bitacoraBuzoFormSchema = z.object({
  codigo: z.string(),
  inmersion_id: z.string().uuid(),
  buzo: z.string(),
  fecha: z.string(),
  profundidad_maxima: z.number(),
  trabajos_realizados: z.string(),
  observaciones_tecnicas: z.string().optional(),
  estado_fisico_post: z.string(),
  firmado: z.boolean().default(false),
  estado_aprobacion: z.string().default('pendiente'),
  buzo_id: z.string().uuid().optional(),
  folio: z.string().optional(),
  codigo_verificacion: z.string().optional(),
  empresa_nombre: z.string().optional(),
  centro_nombre: z.string().optional(),
  buzo_rut: z.string().optional(),
  supervisor_nombre: z.string().optional(),
  supervisor_rut: z.string().optional(),
  supervisor_correo: z.string().optional(),
  jefe_centro_correo: z.string().optional(),
  contratista_nombre: z.string().optional(),
  contratista_rut: z.string().optional(),
  condamb_estado_puerto: z.string().optional(),
  condamb_estado_mar: z.string().optional(),
  condamb_temp_aire_c: z.number().optional(),
  condamb_temp_agua_c: z.number().optional(),
  condamb_visibilidad_fondo_mts: z.number().optional(),
  condamb_corriente_fondo_nudos: z.number().optional(),
  datostec_equipo_usado: z.string().optional(),
  datostec_traje: z.string().optional(),
  datostec_hora_dejo_superficie: z.string().optional(),
  datostec_hora_llegada_fondo: z.string().optional(),
  datostec_hora_salida_fondo: z.string().optional(),
  datostec_hora_llegada_superficie: z.string().optional(),
  tiempos_total_fondo: z.string().optional(),
  tiempos_total_descompresion: z.string().optional(),
  tiempos_total_buceo: z.string().optional(),
  tiempos_tabulacion_usada: z.string().optional(),
  tiempos_intervalo_superficie: z.string().optional(),
  tiempos_nitrogeno_residual: z.string().optional(),
  tiempos_grupo_repetitivo_anterior: z.string().optional(),
  tiempos_nuevo_grupo_repetitivo: z.string().optional(),
  objetivo_proposito: z.string().optional(),
  objetivo_tipo_area: z.string().optional(),
  objetivo_caracteristicas_dimensiones: z.string().optional(),
  condcert_buceo_altitud: z.boolean().optional(),
  condcert_certificados_equipos_usados: z.boolean().optional(),
  condcert_buceo_areas_confinadas: z.boolean().optional(),
  condcert_observaciones: z.string().optional(),
  validador_nombre: z.string().optional(),
});

export type BitacoraBuzoFormData = z.infer<typeof bitacoraBuzoFormSchema>;


// Funciones de Fetch
const getInmersionesCompletas = async (): Promise<InmersionCompleta[]> => {
  const { data, error } = await supabase
    .from('inmersion')
    .select(`
      *,
      operacion:operacion(*,
        salmoneras:salmonera_id(*),
        sitios:sitio_id(*),
        contratistas:contratista_id(*)
      )
    `)
    .order('fecha_inmersion', { ascending: false });

  if (error) throw new Error(error.message);
  return (data as any) || [];
};

const getBitacorasSupervisor = async (): Promise<BitacoraSupervisorCompleta[]> => {
  const { data, error } = await supabase
    .from('bitacora_supervisor')
    .select(`
      *,
      inmersion:inmersion(*,
        operacion:operacion(*,
          salmoneras:salmonera_id(*),
          sitios:sitio_id(*),
          contratistas:contratista_id(*)
        )
      )
    `)
    .order('fecha', { ascending: false });

  if (error) throw new Error(error.message);
  
  const mappedData = data?.map(item => ({
    ...item,
    inmersiones_buzos: Array.isArray(item.inmersiones_buzos) ? item.inmersiones_buzos : [],
    equipos_utilizados: Array.isArray(item.equipos_utilizados) ? item.equipos_utilizados : [],
    diving_records: Array.isArray(item.diving_records) ? item.diving_records : [],
  })) || [];

  return mappedData as unknown as BitacoraSupervisorCompleta[];
};

const getBitacorasBuzo = async (): Promise<BitacoraBuzoCompleta[]> => {
  const { data, error } = await supabase
    .from('bitacora_buzo')
    .select(`
      *,
      inmersion:inmersion(*,
        operacion:operacion(*,
          salmoneras:salmonera_id(*),
          sitios:sitio_id(*),
          contratistas:contratista_id(*)
        )
      )
    `)
    .order('fecha', { ascending: false });

  if (error) throw new Error(error.message);
  return (data as any) || [];
};

export const useBitacoraEnhanced = () => {
  const queryClient = useQueryClient();
  
  const { data: inmersiones = [], isLoading: loadingInmersiones, error: errorInmersiones } = useQuery<InmersionCompleta[]>({
    queryKey: ['inmersionesCompletas'],
    queryFn: getInmersionesCompletas,
  });

  const { data: bitacorasSupervisor = [], isLoading: loadingSupervisor, refetch: refetchSupervisor } = useQuery<BitacoraSupervisorCompleta[]>({
    queryKey: ['bitacorasSupervisor'],
    queryFn: getBitacorasSupervisor,
  });

  const { data: bitacorasBuzo = [], isLoading: loadingBuzo, refetch: refetchBuzo } = useQuery<BitacoraBuzoCompleta[]>({
    queryKey: ['bitacorasBuzo'],
    queryFn: getBitacorasBuzo,
  });

  const refreshBitacoras = () => {
    refetchSupervisor();
    refetchBuzo();
  };

  const createBitacoraSupervisor = useMutation({
    mutationFn: async (formData: BitacoraSupervisorFormData) => {
      const { fecha_termino_faena, ...dataToInsert } = formData as any;
      const { error } = await supabase.from('bitacora_supervisor').insert(dataToInsert as any);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacorasSupervisor'] });
      toast({
        title: "Bitácora de Supervisor Creada",
        description: "La bitácora ha sido registrada exitosamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error al crear bitácora",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createBitacoraBuzo = useMutation({
    mutationFn: async (formData: BitacoraBuzoFormData) => {
      const { buzo_id, ...dataToInsert } = formData as any;
      const { error } = await supabase.from('bitacora_buzo').insert(dataToInsert as any);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacorasBuzo'] });
      toast({
        title: "Bitácora de Buzo Creada",
        description: "La bitácora ha sido registrada exitosamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error al crear bitácora",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    bitacorasSupervisor,
    bitacorasBuzo,
    loading: loadingSupervisor || loadingBuzo || loadingInmersiones,
    error: errorInmersiones,
    createBitacoraSupervisor,
    createBitacoraBuzo,
    refreshBitacoras,
    inmersiones,
    loadingInmersiones,
  };
};
