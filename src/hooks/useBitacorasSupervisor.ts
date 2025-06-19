
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

// CORRECCIÓN: Validación de bitácora única por supervisor por inmersión
const validateUniqueBitacoraSupervisor = async (inmersionId: string, excludeBitacoraId?: string): Promise<boolean> => {
  let query = supabase
    .from('bitacora_supervisor')
    .select('bitacora_id')
    .eq('inmersion_id', inmersionId);
    
  if (excludeBitacoraId) {
    query = query.neq('bitacora_id', excludeBitacoraId);
  }
  
  const { data, error } = await query;
  
  if (error) throw new Error(error.message);
  
  return data.length === 0; // Retorna true si NO existe otra bitácora
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
      // CORRECCIÓN: Validar unicidad antes de crear
      const isUnique = await validateUniqueBitacoraSupervisor(formData.inmersion_id);
      if (!isUnique) {
        throw new Error('Ya existe una bitácora de supervisor para esta inmersión. Solo se permite una bitácora por inmersión.');
      }

      // Solo usar campos que existen en la tabla bitacora_supervisor
      const dataToInsert = {
        codigo: formData.codigo,
        inmersion_id: formData.inmersion_id,
        supervisor: formData.supervisor || '',
        desarrollo_inmersion: formData.desarrollo_inmersion,
        incidentes: formData.incidentes || '',
        evaluacion_general: formData.evaluacion_general,
        fecha: formData.fecha || new Date().toISOString().split('T')[0],
        firmado: formData.firmado || false,
        estado_aprobacion: formData.estado_aprobacion || 'pendiente',
        fecha_inicio_faena: formData.fecha_inicio_faena,
        hora_inicio_faena: formData.hora_inicio_faena,
        hora_termino_faena: formData.hora_termino_faena,
        lugar_trabajo: formData.lugar_trabajo,
        supervisor_nombre_matricula: formData.supervisor_nombre_matricula,
        estado_mar: formData.estado_mar,
        visibilidad_fondo: formData.visibilidad_fondo,
        inmersiones_buzos: Array.isArray(formData.inmersiones_buzos) ? formData.inmersiones_buzos : [],
        equipos_utilizados: Array.isArray(formData.equipos_utilizados) ? formData.equipos_utilizados : [],
        trabajo_a_realizar: formData.trabajo_a_realizar,
        descripcion_trabajo: formData.descripcion_trabajo,
        embarcacion_apoyo: formData.embarcacion_apoyo,
        observaciones_generales_texto: formData.observaciones_generales_texto,
        validacion_contratista: formData.validacion_contratista || false,
        comentarios_validacion: formData.comentarios_validacion,
        diving_records: Array.isArray(formData.diving_records) ? formData.diving_records : [],
      };
      
      if (!isOnline) {
        addPendingAction({ type: 'create', table: 'bitacora_supervisor', payload: dataToInsert });
        const tempId = `offline_${Date.now()}`;
        const newBitacora = { ...dataToInsert, bitacora_id: tempId };
        queryClient.setQueryData(['bitacorasSupervisor'], (oldData: BitacoraSupervisorCompleta[] = []) => [...oldData, newBitacora]);
        return newBitacora;
      }
      
      const { error } = await supabase.from('bitacora_supervisor').insert(dataToInsert);
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
    validateUniqueBitacoraSupervisor, // NUEVO: Exportar función de validación
  };
};
