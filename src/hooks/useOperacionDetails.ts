
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useMemo } from 'react';

export interface OperacionFull {
  id: string;
  codigo: string;
  nombre: string;
  estado: string;
  fecha_inicio: string;
  fecha_fin?: string;
  tareas?: string;
  sitio_nombre?: string;
  contratista_nombre?: string;
  equipo_buceo_id?: string;
  created_at: string;
  salmonera_id?: string;
  contratista_id?: string;
  salmoneras?: { nombre: string };
  sitios?: { nombre: string };
  contratistas?: { nombre: string };
}

export interface DocumentStatus {
  hpts: any[];
  anexosBravo: any[];
  inmersiones: any[];
  hasTeam: boolean;
}

const fetchOperacionDetails = async (operacionId: string) => {
  const { data: opData, error: opError } = await supabase
    .from('operacion')
    .select(`
      *,
      salmoneras:salmonera_id (nombre),
      sitios:sitio_id (nombre),
      contratistas:contratista_id (nombre)
    `)
    .eq('id', operacionId)
    .single();

  if (opError) throw opError;

  const [hptData, anexoData, inmersionData] = await Promise.all([
    supabase.from('hpt').select('id, firmado').eq('operacion_id', operacionId),
    supabase.from('anexo_bravo').select('id, firmado').eq('operacion_id', operacionId),
    supabase.from('inmersion').select('inmersion_id, codigo, fecha_inmersion, estado').eq('operacion_id', operacionId)
  ]);

  if (hptData.error) throw hptData.error;
  if (anexoData.error) throw anexoData.error;
  if (inmersionData.error) throw inmersionData.error;

  const operacion: OperacionFull = {
    ...opData,
    sitio_nombre: opData.sitios?.nombre,
    contratista_nombre: opData.contratistas?.nombre
  };

  const documentStatus: DocumentStatus = {
    hpts: hptData.data || [],
    anexosBravo: anexoData.data || [],
    inmersiones: inmersionData.data || [],
    hasTeam: !!opData.equipo_buceo_id
  };
  
  return { operacion, documentStatus };
};

export const useOperacionDetails = (operacionId: string) => {
    const queryClient = useQueryClient();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['operacionDetails', operacionId],
        queryFn: () => fetchOperacionDetails(operacionId),
        enabled: !!operacionId,
    });

    const createInmersionMutation = useMutation({
        mutationFn: async (inmersionData: any) => {
          const dataToInsert = { ...inmersionData, operacion_id: operacionId };
          const { error } = await supabase.from('inmersion').insert([dataToInsert]);
          if (error) throw error;
        },
        onSuccess: () => {
          toast({ title: "Inmersión creada", description: "La inmersión ha sido creada exitosamente." });
          queryClient.invalidateQueries({ queryKey: ['operacionDetails', operacionId] });
          queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
          queryClient.invalidateQueries({ queryKey: ['inmersionesCompletas'] });
        },
        onError: (error: any) => {
          console.error('Error creating Inmersion:', error);
          toast({
            title: "Error",
            description: "No se pudo crear la inmersión.",
            variant: "destructive",
          });
        }
    });
    
    const compliance = useMemo(() => {
        if (!data?.documentStatus) return null;
        
        const { documentStatus } = data;
        const hasValidHPT = documentStatus.hpts.some(h => h.firmado);
        const hasValidAnexo = documentStatus.anexosBravo.some(a => a.firmado);
        const hasTeam = documentStatus.hasTeam;
        const canExecute = hasValidHPT && hasValidAnexo && hasTeam;
        
        return { hasValidHPT, hasValidAnexo, canExecute, hasTeam };
    }, [data?.documentStatus]);

    return {
        operacion: data?.operacion,
        documentStatus: data?.documentStatus,
        isLoading,
        isError,
        error,
        createInmersion: createInmersionMutation.mutateAsync,
        compliance
    };
};
