
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
  console.log('Fetching operation details for:', operacionId);
  
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

  if (opError) {
    console.error('Error fetching operation details:', opError);
    throw opError;
  }

  console.log('Operation data:', opData);

  const [hptData, anexoData, inmersionData] = await Promise.all([
    supabase.from('hpt').select('id, firmado').eq('operacion_id', operacionId),
    supabase.from('anexo_bravo').select('id, firmado').eq('operacion_id', operacionId),
    supabase.from('inmersion').select('inmersion_id, codigo, fecha_inmersion, estado').eq('operacion_id', operacionId)
  ]);

  if (hptData.error) {
    console.error('Error fetching HPT data:', hptData.error);
    throw hptData.error;
  }
  if (anexoData.error) {
    console.error('Error fetching Anexo Bravo data:', anexoData.error);
    throw anexoData.error;
  }
  if (inmersionData.error) {
    console.error('Error fetching immersion data:', inmersionData.error);
    throw inmersionData.error;
  }

  console.log('Documents data:', {
    hpts: hptData.data,
    anexosBravo: anexoData.data,
    inmersiones: inmersionData.data,
    hasTeam: !!opData.equipo_buceo_id
  });

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

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['operacionDetails', operacionId],
        queryFn: () => fetchOperacionDetails(operacionId),
        enabled: !!operacionId,
        staleTime: 0, // Siempre refetch para mantener datos actualizados
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });

    const createInmersionMutation = useMutation({
        mutationFn: async (inmersionData: any) => {
          console.log('Creating immersion with data:', inmersionData);
          const dataToInsert = { ...inmersionData, operacion_id: operacionId };
          const { data: result, error } = await supabase.from('inmersion').insert([dataToInsert]).select().single();
          if (error) {
            console.error('Error creating immersion:', error);
            throw error;
          }
          console.log('Immersion created successfully:', result);
          return result;
        },
        onSuccess: (result) => {
          console.log('Immersion creation successful, invalidating queries');
          toast({ title: "Inmersión creada", description: "La inmersión ha sido creada exitosamente." });
          
          // Invalidar y refrescar múltiples queries relacionadas
          queryClient.invalidateQueries({ queryKey: ['operacionDetails', operacionId] });
          queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
          queryClient.invalidateQueries({ queryKey: ['inmersionesCompletas'] });
          
          // Forzar refetch inmediato
          queryClient.refetchQueries({ queryKey: ['operacionDetails', operacionId] });
          queryClient.refetchQueries({ queryKey: ['inmersiones'] });
        },
        onError: (error: any) => {
          console.error('Error creating Inmersion:', error);
          toast({
            title: "Error",
            description: `No se pudo crear la inmersión: ${error.message || 'Error desconocido'}`,
            variant: "destructive",
          });
        }
    });
    
    const compliance = useMemo(() => {
        if (!data?.documentStatus) {
          console.log('No document status available for compliance calculation');
          return null;
        }
        
        const { documentStatus } = data;
        const hasValidHPT = documentStatus.hpts.some(h => h.firmado);
        const hasValidAnexo = documentStatus.anexosBravo.some(a => a.firmado);
        const hasTeam = documentStatus.hasTeam;
        const canExecute = hasValidHPT && hasValidAnexo && hasTeam;
        
        console.log('Compliance calculation:', {
          hasValidHPT,
          hasValidAnexo,
          hasTeam,
          canExecute,
          hpts: documentStatus.hpts,
          anexosBravo: documentStatus.anexosBravo
        });
        
        return { hasValidHPT, hasValidAnexo, canExecute, hasTeam };
    }, [data?.documentStatus]);

    // Función para refrescar manualmente los datos
    const refreshOperacionDetails = async () => {
      console.log('Manually refreshing operation details');
      await refetch();
    };

    return {
        operacion: data?.operacion,
        documentStatus: data?.documentStatus,
        isLoading,
        isError,
        error,
        createInmersion: createInmersionMutation.mutateAsync,
        compliance,
        refreshOperacionDetails
    };
};
