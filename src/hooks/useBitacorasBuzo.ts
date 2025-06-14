import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { bitacoraBuzoFormSchema } from '@/components/bitacoras/buzoFormSchema';
import { BitacoraBuzoCompleta } from '@/types/bitacoras';
import { useOfflineSync } from './useOfflineSync';

const bitacoraBuzoDataSchema = bitacoraBuzoFormSchema.extend({
  codigo: z.string(),
  fecha: z.string(),
  firmado: z.boolean().default(false),
  estado_aprobacion: z.string().default('pendiente'),
  buzo_id: z.string().uuid().optional(),
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
        // Optimistic update
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

  const updateBitacoraBuzoSignature = useMutation({
    mutationFn: async ({ bitacoraId, signatureData }: { bitacoraId: string; signatureData: string }) => {
      const payload = { buzo_firma: signatureData, firmado: true, updated_at: new Date().toISOString() };
      if (!isOnline) {
        addPendingAction({ type: 'update', table: 'bitacora_buzo', payload: { pk: { bitacora_id: bitacoraId }, data: payload } });
        // Optimistic update
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

  return {
    bitacorasBuzo,
    loadingBuzo,
    refetchBuzo,
    createBitacoraBuzo,
    updateBitacoraBuzoSignature,
  };
};
