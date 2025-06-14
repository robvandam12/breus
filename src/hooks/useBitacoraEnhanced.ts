
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Tables, Json } from '@/types/supabase';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { useInmersiones, Inmersion } from './useInmersiones';

// Interfaces unificadas para Bitácoras Completas
export interface BitacoraSupervisorCompleta extends Omit<Tables<'bitacora_supervisor'>, 'inmersion_id' | 'aprobada_por' | 'inmersiones_buzos' | 'equipos_utilizados' | 'diving_records'> {
  inmersion: Inmersion | null;
  supervisor_data?: { id: string; nombre: string; } | null;
  aprobador_data?: { id: string; nombre: string; } | null;
  inmersiones_buzos: any[] | null;
  equipos_utilizados: any[] | null;
  diving_records: any[] | null;
}

export interface BitacoraBuzoCompleta extends Omit<Tables<'bitacora_buzo'>, 'inmersion_id' | 'aprobada_por'> {
  inmersion: Inmersion | null;
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
  buzos_asistentes: z.array(z.any()).optional(), // Campo añadido para compatibilidad
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
  // Campos adicionales del formulario completo
  empresa_nombre: z.string().optional(),
  centro_nombre: z.string().optional(),
  supervisor_nombre: z.string().optional(),
  condamb_temp_agua_c: z.number().optional(),
  condamb_visibilidad_fondo_mts: z.number().optional(),
  condamb_corriente_fondo_nudos: z.number().optional(),
  datostec_hora_dejo_superficie: z.string().optional(),
  datostec_hora_llegada_superficie: z.string().optional(),
  objetivo_proposito: z.string().optional(),
  tiempos_total_fondo: z.string().optional(),
  tiempos_tabulacion_usada: z.string().optional(),
});

export type BitacoraBuzoFormData = z.infer<typeof bitacoraBuzoFormSchema>;


// Funciones de Fetch
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

  return mappedData as BitacoraSupervisorCompleta[];
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
  const { inmersiones, isLoading: loadingInmersiones, error: errorInmersiones } = useInmersiones();

  const { data: bitacorasSupervisor = [], isLoading: loadingSupervisor, refetch: refetchSupervisor } = useQuery<BitacoraSupervisorCompleta[]>({
    queryKey: ['bitacorasSupervisor'],
    queryFn: getBitacorasSupervisor,
    initialData: [],
  });

  const { data: bitacorasBuzo = [], isLoading: loadingBuzo, refetch: refetchBuzo } = useQuery<BitacoraBuzoCompleta[]>({
    queryKey: ['bitacorasBuzo'],
    queryFn: getBitacorasBuzo,
    initialData: [],
  });

  const refreshBitacoras = () => {
    refetchSupervisor();
    refetchBuzo();
  };

  const createBitacoraSupervisor = useMutation({
    mutationFn: async (formData: BitacoraSupervisorFormData) => {
      const { error } = await supabase.from('bitacora_supervisor').insert(formData as any);
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
      const { error } = await supabase.from('bitacora_buzo').insert(formData as any);
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
