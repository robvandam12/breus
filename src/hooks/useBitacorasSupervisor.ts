
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { BitacoraSupervisorCompleta } from '@/types/bitacoras';

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

export const useBitacorasSupervisor = () => {
  const queryClient = useQueryClient();

  const { data: bitacorasSupervisor = [], isLoading: loadingSupervisor, refetch: refetchSupervisor } = useQuery<BitacoraSupervisorCompleta[]>({
    queryKey: ['bitacorasSupervisor'],
    queryFn: getBitacorasSupervisor,
  });

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

  const updateBitacoraSupervisorSignature = useMutation({
    mutationFn: async ({ bitacoraId, signatureData }: { bitacoraId: string; signatureData: string }) => {
      const { error } = await supabase
        .from('bitacora_supervisor')
        .update({ supervisor_firma: signatureData, firmado: true, updated_at: new Date().toISOString() })
        .eq('bitacora_id', bitacoraId);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacorasSupervisor'] });
      toast({
        title: "Bitácora Firmada",
        description: "La firma ha sido registrada exitosamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error al firmar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    bitacorasSupervisor,
    loadingSupervisor,
    refetchSupervisor,
    createBitacoraSupervisor,
    updateBitacoraSupervisorSignature,
  };
};
