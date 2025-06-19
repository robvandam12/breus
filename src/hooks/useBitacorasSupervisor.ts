
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { BitacoraSupervisorCompleta } from '@/types/bitacoras';
import { useOfflineSync } from './useOfflineSync';

const bitacoraSupervisorFormSchema = z.object({
  codigo: z.string(),
  inmersion_id: z.string().uuid(),
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
});

export type BitacoraSupervisorFormData = z.infer<typeof bitacoraSupervisorFormSchema>;

const getBitacorasSupervisor = async (): Promise<BitacoraSupervisorCompleta[]> => {
  const { data, error } = await supabase
    .from('bitacora_supervisor')
    .select(`
      *,
      inmersion:inmersion_id(*,
        operacion:operacion_id(*,
          salmoneras:salmonera_id(nombre),
          sitios:sitio_id(nombre),
          contratistas:contratista_id(nombre)
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
  const { isOnline, addPendingAction } = useOfflineSync();

  const { data: bitacorasSupervisor = [], isLoading: loadingSupervisor, refetch: refetchSupervisor } = useQuery<BitacoraSupervisorCompleta[]>({
    queryKey: ['bitacorasSupervisor'],
    queryFn: getBitacorasSupervisor,
  });

  const createBitacoraSupervisor = useMutation({
    mutationFn: async (formData: BitacoraSupervisorFormData) => {
      // Remover campos que no existen en la tabla
      const { equipo_buceo_id, operacion_id, empresa_nombre, centro_nombre, ...dataToInsert } = formData as any;
      
      // Asegurar que la fecha esté presente
      if (!dataToInsert.fecha) {
        dataToInsert.fecha = new Date().toISOString().split('T')[0];
      }
      
      if (!isOnline) {
        addPendingAction({ type: 'create', table: 'bitacora_supervisor', payload: dataToInsert });
        const tempId = `offline_${Date.now()}`;
        const newBitacora = { ...dataToInsert, bitacora_id: tempId };
        queryClient.setQueryData(['bitacorasSupervisor'], (oldData: BitacoraSupervisorCompleta[] = []) => [...oldData, newBitacora]);
        return newBitacora;
      }
      
      const { error } = await supabase.from('bitacora_supervisor').insert(dataToInsert as any);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacorasSupervisor'] });
      toast({
        title: isOnline ? "Bitácora de Supervisor Creada" : "Bitácora guardada (Offline)",
        description: isOnline ? "La bitácora ha sido registrada exitosamente." : "Se sincronizará cuando haya conexión.",
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
      const payload = { supervisor_firma: signatureData, firmado: true, updated_at: new Date().toISOString() };
      if (!isOnline) {
        addPendingAction({ type: 'update', table: 'bitacora_supervisor', payload: { pk: { bitacora_id: bitacoraId }, data: payload } });
        queryClient.setQueryData(['bitacorasSupervisor'], (oldData: BitacoraSupervisorCompleta[] = []) =>
          oldData.map(b => b.bitacora_id === bitacoraId ? { ...b, ...payload } : b)
        );
        return;
      }
      const { error } = await supabase
        .from('bitacora_supervisor')
        .update(payload)
        .eq('bitacora_id', bitacoraId);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacorasSupervisor'] });
      toast({
        title: isOnline ? "Bitácora Firmada" : "Firma guardada (Offline)",
        description: isOnline ? "La firma ha sido registrada exitosamente." : "Se sincronizará cuando haya conexión.",
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
