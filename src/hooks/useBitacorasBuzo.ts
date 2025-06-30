
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { bitacoraBuzoFormSchema } from '@/components/bitacoras/buzoFormSchema';
import { BitacoraBuzoCompleta, CuadrillaMemberData } from '@/types/bitacoras';
import { useOfflineSync } from './useOfflineSync';

const bitacoraBuzoDataSchema = bitacoraBuzoFormSchema.extend({
  codigo: z.string(),
  fecha: z.string(),
  firmado: z.boolean().default(false),
  estado_aprobacion: z.string().default('pendiente'),
  buzo_id: z.string().uuid().optional(),
  bitacora_supervisor_id: z.string().uuid().optional(),
});

export type BitacoraBuzoFormData = z.infer<typeof bitacoraBuzoDataSchema>;

const getBitacorasBuzo = async (): Promise<BitacoraBuzoCompleta[]> => {
  const { data, error } = await supabase
    .from('bitacora_buzo')
    .select(`
      *,
      inmersion:inmersion_id(*,
        operacion:operacion_id(*,
          salmoneras:salmonera_id(nombre),
          sitios:sitio_id(nombre),
          contratistas:contratista_id(nombre)
        )
      ),
      bitacora_supervisor:bitacora_supervisor_id(
        bitacora_id,
        codigo,
        supervisor,
        desarrollo_inmersion,
        datos_cuadrilla,
        tiempos_detallados
      )
    `)
    .order('fecha', { ascending: false });

  if (error) throw new Error(error.message);
  return (data as any) || [];
};

export const useBitacorasBuzo = () => {
  const queryClient = useQueryClient();
  const { isOnline, addPendingAction } = useOfflineSync();

  const { data: bitacorasBuzo = [], isLoading: loadingBuzo, refetch: refetchBuzo } = useQuery<BitacoraBuzoCompleta[]>({
    queryKey: ['bitacorasBuzo'],
    queryFn: getBitacorasBuzo,
  });

  const createBitacoraBuzo = useMutation({
    mutationFn: async (formData: BitacoraBuzoFormData) => {
      const { buzo_id, ...dataToInsert } = formData as any;
      
      if (!isOnline) {
        addPendingAction({ type: 'create', table: 'bitacora_buzo', payload: dataToInsert });
        const tempId = `offline_${Date.now()}`;
        const newBitacora = { ...dataToInsert, bitacora_id: tempId };
        queryClient.setQueryData(['bitacorasBuzo'], (oldData: BitacoraBuzoCompleta[] = []) => [...oldData, newBitacora]);
        return newBitacora;
      }
      
      const { error } = await supabase.from('bitacora_buzo').insert(dataToInsert as any);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacorasBuzo'] });
      toast({
        title: isOnline ? "Bitácora de Buzo Creada" : "Bitácora guardada (Offline)",
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

  const createBitacoraBuzoFromSupervisor = useMutation({
    mutationFn: async ({ 
      bitacoraSupervisorId, 
      usuarioId, 
      additionalData 
    }: { 
      bitacoraSupervisorId: string;
      usuarioId: string;
      additionalData?: Partial<BitacoraBuzoFormData>;
    }) => {
      // Obtener datos de la bitácora de supervisor
      const { data: bitacoraSupervisor, error: supervisorError } = await supabase
        .from('bitacora_supervisor')
        .select(`
          *,
          inmersion:inmersion_id(*)
        `)
        .eq('bitacora_id', bitacoraSupervisorId)
        .single();

      if (supervisorError) throw new Error('No se pudo obtener la bitácora de supervisor');

      // Buscar datos específicos del buzo en la cuadrilla
      let cuadrillaData: CuadrillaMemberData[] = [];
      if (bitacoraSupervisor.datos_cuadrilla) {
        if (typeof bitacoraSupervisor.datos_cuadrilla === 'string') {
          cuadrillaData = JSON.parse(bitacoraSupervisor.datos_cuadrilla);
        } else if (Array.isArray(bitacoraSupervisor.datos_cuadrilla)) {
          cuadrillaData = bitacoraSupervisor.datos_cuadrilla as CuadrillaMemberData[];
        }
      }

      const datosDelBuzo = cuadrillaData.find((member: CuadrillaMemberData) => member.usuario_id === usuarioId);
      
      let tiemposDetallados: any = {};
      if (bitacoraSupervisor.tiempos_detallados) {
        if (typeof bitacoraSupervisor.tiempos_detallados === 'string') {
          tiemposDetallados = JSON.parse(bitacoraSupervisor.tiempos_detallados);
        } else {
          tiemposDetallados = bitacoraSupervisor.tiempos_detallados;
        }
      }
      
      const tiemposDelBuzo = tiemposDetallados[usuarioId];

      // Crear código automático para la bitácora de buzo
      const codigoBuzo = `${bitacoraSupervisor.codigo}-BUZO-${Date.now().toString().slice(-6)}`;

      const bitacoraBuzoData = {
        bitacora_supervisor_id: bitacoraSupervisorId,
        inmersion_id: bitacoraSupervisor.inmersion_id,
        codigo: codigoBuzo,
        fecha: bitacoraSupervisor.fecha,
        buzo: datosDelBuzo?.nombre || '',
        buzo_rut: datosDelBuzo?.matricula || '',
        supervisor_nombre: bitacoraSupervisor.supervisor,
        centro_nombre: bitacoraSupervisor.centro_nombre,
        empresa_nombre: bitacoraSupervisor.empresa_nombre,
        profundidad_maxima: datosDelBuzo?.profundidad_maxima || 0,
        trabajos_realizados: bitacoraSupervisor.trabajo_a_realizar || '',
        estado_fisico_post: datosDelBuzo?.estado_fisico_post || 'normal',
        condamb_estado_mar: bitacoraSupervisor.estado_mar,
        condamb_visibilidad_fondo_mts: bitacoraSupervisor.visibilidad_fondo,
        datostec_hora_dejo_superficie: tiemposDelBuzo?.hora_entrada,
        datostec_hora_llegada_superficie: tiemposDelBuzo?.hora_salida,
        tiempos_total_fondo: tiemposDelBuzo?.tiempo_fondo_minutos?.toString(),
        observaciones_tecnicas: datosDelBuzo?.observaciones,
        company_id: bitacoraSupervisor.company_id,
        company_type: bitacoraSupervisor.company_type,
        estado_aprobacion: 'pendiente',
        firmado: false,
        ...additionalData
      };

      const { data: result, error } = await supabase
        .from('bitacora_buzo')
        .insert(bitacoraBuzoData)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacorasBuzo'] });
      toast({
        title: "Bitácora de Buzo Creada",
        description: "La bitácora ha sido creada basada en la bitácora de supervisor.",
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

  const updateBitacoraBuzoSignature = useMutation({
    mutationFn: async ({ bitacoraId, signatureData }: { bitacoraId: string; signatureData: string }) => {
      const payload = { buzo_firma: signatureData, firmado: true, updated_at: new Date().toISOString() };
      
      if (!isOnline) {
        addPendingAction({ type: 'update', table: 'bitacora_buzo', payload: { pk: { bitacora_id: bitacoraId }, data: payload } });
        queryClient.setQueryData(['bitacorasBuzo'], (oldData: BitacoraBuzoCompleta[] = []) =>
          oldData.map(b => b.bitacora_id === bitacoraId ? { ...b, ...payload } : b)
        );
        return;
      }
      
      const { error } = await supabase
        .from('bitacora_buzo')
        .update(payload)
        .eq('bitacora_id', bitacoraId);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacorasBuzo'] });
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

  // Función para obtener bitácoras de supervisor disponibles para un usuario
  const getAvailableSupervisorBitacoras = async (usuarioId: string) => {
    const { data, error } = await supabase
      .from('bitacora_supervisor')
      .select(`
        *,
        inmersion:inmersion_id(codigo, fecha_inmersion, objetivo)
      `)
      .eq('firmado', true);

    if (error) throw error;
    
    // Filtrar las que contienen al usuario en los datos de cuadrilla
    const bitacorasConUsuario = data?.filter(bs => {
      if (!bs.datos_cuadrilla) return false;
      
      let cuadrillaData: CuadrillaMemberData[] = [];
      if (typeof bs.datos_cuadrilla === 'string') {
        try {
          cuadrillaData = JSON.parse(bs.datos_cuadrilla);
        } catch {
          return false;
        }
      } else if (Array.isArray(bs.datos_cuadrilla)) {
        cuadrillaData = bs.datos_cuadrilla as CuadrillaMemberData[];
      }
      
      return cuadrillaData.some(member => member.usuario_id === usuarioId);
    }) || [];

    // Filtrar las que ya tienen bitácora de buzo creada
    const bitacorasConBuzo = await supabase
      .from('bitacora_buzo')
      .select('bitacora_supervisor_id')
      .not('bitacora_supervisor_id', 'is', null);

    const bitacorasConBuzoIds = new Set(
      bitacorasConBuzo.data?.map(b => b.bitacora_supervisor_id) || []
    );

    return bitacorasConUsuario.filter(bs => !bitacorasConBuzoIds.has(bs.bitacora_id));
  };

  return {
    bitacorasBuzo,
    loadingBuzo,
    refetchBuzo,
    createBitacoraBuzo,
    createBitacoraBuzoFromSupervisor,
    updateBitacoraBuzoSignature,
    getAvailableSupervisorBitacoras,
  };
};
