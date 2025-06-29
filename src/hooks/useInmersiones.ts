
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';

export interface Inmersion extends Tables<'inmersion'> {
  operacion?: {
    id: string;
    codigo: string;
    nombre: string;
    salmonera_id?: string;
    contratista_id?: string;
    salmoneras?: { nombre: string } | null;
    centros?: { nombre: string } | null;
    contratistas?: { nombre: string } | null;
  };
  operacion_nombre?: string;
}

export interface ValidationStatus {
  hasValidHPT: boolean;
  hasValidAnexoBravo: boolean;
  hasTeam: boolean;
  canExecute: boolean;
  hptCode?: string;
  anexoBravoCode?: string;
}

const generateInmersionCode = (prefix: string = 'IMM') => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

export const useInmersiones = () => {
  const queryClient = useQueryClient();

  const { data: inmersiones = [], isLoading, error } = useQuery({
    queryKey: ['inmersiones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inmersion')
        .select(`
          *,
          operacion:operacion_id(
            id,
            codigo,
            nombre,
            salmonera_id,
            contratista_id,
            salmoneras:salmonera_id(nombre),
            centros:centro_id(nombre),
            contratistas:contratista_id(nombre)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching inmersiones:', error);
        throw error;
      }

      // Mapear datos para incluir operacion_nombre
      const mappedData = (data || []).map(inmersion => ({
        ...inmersion,
        operacion_nombre: inmersion.operacion?.nombre || (inmersion.is_independent ? 'Inmersión Independiente' : 'Sin operación')
      }));

      return mappedData as Inmersion[];
    },
  });

  const createInmersion = useMutation({
    mutationFn: async (inmersionData: any) => {
      console.log('Creating inmersion with data:', inmersionData);

      // Asegurar que siempre haya un código
      if (!inmersionData.codigo) {
        inmersionData.codigo = generateInmersionCode();
      }

      // Validar datos requeridos
      if (!inmersionData.fecha_inmersion) {
        throw new Error('Fecha de inmersión es requerida');
      }

      if (!inmersionData.objetivo) {
        throw new Error('Objetivo de inmersión es requerido');
      }

      // Separar metadatos de cuadrilla del objeto principal
      const cuadrillaId = inmersionData.cuadrilla_id || inmersionData.metadata?.cuadrilla_id;
      
      // Preparar datos para inmersión
      const inmersionPayload = {
        codigo: inmersionData.codigo,
        fecha_inmersion: inmersionData.fecha_inmersion,
        hora_inicio: inmersionData.hora_inicio || null,
        hora_fin: inmersionData.hora_fin || null,
        objetivo: inmersionData.objetivo,
        profundidad_max: inmersionData.profundidad_max || 0,
        supervisor: inmersionData.supervisor || null,
        buzo_principal: inmersionData.buzo_principal || null,
        buzo_asistente: inmersionData.buzo_asistente || null,
        operacion_id: inmersionData.operacion_id || null,
        observaciones: inmersionData.observaciones || '',
        centro_id: inmersionData.centro_id || null,
        estado: 'planificada',
        // Establecer contexto operativo correcto
        contexto_operativo: inmersionData.is_independent ? 'independiente' : 'planificada',
        is_independent: inmersionData.is_independent || false,
        // Campos opcionales para inmersiones planificadas
        temperatura_agua: inmersionData.temperatura_agua || null,
        visibilidad: inmersionData.visibilidad || null,
        corriente: inmersionData.corriente || null,
        // Incluir metadata con cuadrilla si existe
        metadata: cuadrillaId ? { cuadrilla_id: cuadrillaId } : {}
      };

      // Si es inmersión independiente (no tiene operacion_id), 
      // remover operacion_id del objeto para evitar enviar null
      if (!inmersionData.operacion_id) {
        delete inmersionPayload.operacion_id;
        inmersionPayload.is_independent = true;
      }

      // Crear la inmersión
      const { data, error } = await supabase
        .from('inmersion')
        .insert(inmersionPayload)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Si hay cuadrilla asignada y se creó la inmersión exitosamente, crear asignación
      if (cuadrillaId && data) {
        console.log('Creating cuadrilla assignment for:', cuadrillaId);
        const { error: assignmentError } = await supabase
          .from('cuadrilla_asignaciones')
          .insert({
            cuadrilla_id: cuadrillaId,
            inmersion_id: data.inmersion_id,
            fecha_asignacion: data.fecha_inmersion,
            estado: 'activa'
          });

        if (assignmentError) {
          console.error('Error creating cuadrilla assignment:', assignmentError);
          // Si falla la asignación, eliminar la inmersión creada
          await supabase
            .from('inmersion')
            .delete()
            .eq('inmersion_id', data.inmersion_id);
          
          throw new Error('Error al asignar cuadrilla a la inmersión');
        }
      }
      
      return data;
    },
    onSuccess: () => {
      // Invalidar múltiples queries relacionadas para asegurar actualización
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      queryClient.invalidateQueries({ queryKey: ['cuadrilla-availability'] });
      queryClient.invalidateQueries({ queryKey: ['cuadrillas'] });
      queryClient.invalidateQueries({ queryKey: ['cuadrillas-con-asignaciones'] });
      
      toast({
        title: 'Inmersión creada',
        description: 'La inmersión ha sido creada exitosamente.',
      });
    },
    onError: (error: any) => {
      console.error('Error creating inmersion:', error);
      const errorMessage = error?.message || 'No se pudo crear la inmersión.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const updateInmersion = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Inmersion> }) => {
      const { data: updatedData, error } = await supabase
        .from('inmersion')
        .update(data)
        .eq('inmersion_id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      toast({
        title: 'Inmersión actualizada',
        description: 'La inmersión ha sido actualizada exitosamente.',
      });
    },
  });

  const deleteInmersion = useMutation({
    mutationFn: async (inmersionId: string) => {
      console.log('Starting deletion process for inmersion:', inmersionId);
      
      // Primero eliminar asignaciones de cuadrilla si existen
      const { error: asignacionError } = await supabase
        .from('cuadrilla_asignaciones')
        .delete()
        .eq('inmersion_id', inmersionId);

      if (asignacionError) {
        console.warn('Warning deleting cuadrilla assignments:', asignacionError);
      }

      // Luego eliminar la inmersión
      const { error: inmersionError } = await supabase
        .from('inmersion')
        .delete()
        .eq('inmersion_id', inmersionId);

      if (inmersionError) {
        console.error('Error deleting inmersion:', inmersionError);
        throw new Error('No se pudo eliminar la inmersión - ' + inmersionError.message);
      }

      return inmersionId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      queryClient.invalidateQueries({ queryKey: ['cuadrilla-availability'] });
      queryClient.invalidateQueries({ queryKey: ['cuadrillas-con-asignaciones'] });
      queryClient.invalidateQueries({ queryKey: ['cuadrillas'] });
      
      toast({
        title: 'Inmersión eliminada',
        description: 'La inmersión ha sido eliminada exitosamente.',
      });
    },
    onError: (error: any) => {
      console.error('Delete mutation failed:', error);
      toast({
        title: 'Error',
        description: error?.message || 'No se pudo eliminar la inmersión.',
        variant: 'destructive',
      });
    },
  });

  const executeInmersion = useMutation({
    mutationFn: async (inmersionId: string) => {
      const { data, error } = await supabase
        .from('inmersion')
        .update({ estado: 'en_progreso' })
        .eq('inmersion_id', inmersionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      toast({
        title: 'Inmersión ejecutada',
        description: 'La inmersión ha sido puesta en ejecución.',
      });
    },
  });

  const completeInmersion = useMutation({
    mutationFn: async (inmersionId: string) => {
      const { data, error } = await supabase
        .from('inmersion')
        .update({ estado: 'completada' })
        .eq('inmersion_id', inmersionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      toast({
        title: 'Inmersión completada',
        description: 'La inmersión ha sido marcada como completada.',
      });
    },
  });

  const validateOperationDocuments = useMutation({
    mutationFn: async (operacionId: string): Promise<ValidationStatus> => {
      // Check for HPT
      const { data: hptData } = await supabase
        .from('hpt')
        .select('codigo, firmado')
        .eq('operacion_id', operacionId)
        .eq('firmado', true)
        .single();

      // Check for Anexo Bravo
      const { data: anexoData } = await supabase
        .from('anexo_bravo')
        .select('codigo, firmado')
        .eq('operacion_id', operacionId)
        .eq('firmado', true)
        .single();

      return {
        hasValidHPT: !!hptData,
        hasValidAnexoBravo: !!anexoData,
        hasTeam: true, // Assuming team is always available
        canExecute: !!hptData && !!anexoData,
        hptCode: hptData?.codigo,
        anexoBravoCode: anexoData?.codigo,
      };
    },
  });

  const refreshInmersiones = () => {
    queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
  };

  return {
    inmersiones,
    isLoading,
    error,
    createInmersion: createInmersion.mutate,
    updateInmersion: updateInmersion.mutate,
    deleteInmersion: deleteInmersion.mutate,
    executeInmersion: executeInmersion.mutate,
    completeInmersion: completeInmersion.mutate,
    validateOperationDocuments: validateOperationDocuments.mutate,
    refreshInmersiones,
    isCreating: createInmersion.isPending,
    isDeleting: deleteInmersion.isPending,
    generateInmersionCode,
  };
};
