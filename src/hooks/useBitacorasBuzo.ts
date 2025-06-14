
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { bitacoraBuzoFormSchema } from '@/components/bitacoras/buzoFormSchema';
import { BitacoraBuzoCompleta } from '@/types/bitacoras';

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

  const { data: bitacorasBuzo = [], isLoading: loadingBuzo, refetch: refetchBuzo } = useQuery<BitacoraBuzoCompleta[]>({
    queryKey: ['bitacorasBuzo'],
    queryFn: getBitacorasBuzo,
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

  const updateBitacoraBuzoSignature = useMutation({
    mutationFn: async ({ bitacoraId, signatureData }: { bitacoraId: string; signatureData: string }) => {
      const { error } = await supabase
        .from('bitacora_buzo')
        .update({ buzo_firma: signatureData, firmado: true, updated_at: new Date().toISOString() })
        .eq('bitacora_id', bitacoraId);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacorasBuzo'] });
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
    bitacorasBuzo,
    loadingBuzo,
    refetchBuzo,
    createBitacoraBuzo,
    updateBitacoraBuzoSignature,
  };
};
