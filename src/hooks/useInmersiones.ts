
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Inmersion {
  inmersion_id: string;
  id: string; // Alias para compatibilidad
  operacion_id: string;
  operacion_nombre?: string; // Agregado para compatibilidad
  fecha_inmersion: string;
  hora_inicio: string;
  hora_fin?: string;
  codigo: string;
  buzo_principal: string;
  buzo_asistente?: string;
  supervisor: string;
  objetivo: string;
  profundidad_max: number;
  temperatura_agua: number;
  visibilidad: number;
  corriente: string;
  estado: 'planificada' | 'en_curso' | 'completada' | 'cancelada';
  observaciones?: string;
  hpt_validado: boolean;
  anexo_bravo_validado: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateInmersionData {
  operacion_id: string;
  fecha_inmersion: string;
  hora_inicio: string;
  hora_fin?: string;
  buzo_principal: string;
  buzo_asistente?: string;
  supervisor: string;
  objetivo: string;
  profundidad_max: number;
  temperatura_agua: number;
  visibilidad: number;
  corriente: string;
  observaciones?: string;
}

export interface ValidationStatus {
  hasValidHPT: boolean;
  hasValidAnexoBravo: boolean;
  canExecute: boolean;
  hptCode?: string;
  anexoBravoCode?: string;
}

export const useInmersiones = () => {
  const queryClient = useQueryClient();

  const { data: inmersiones = [], isLoading, error, refetch } = useQuery({
    queryKey: ['inmersiones'],
    queryFn: async () => {
      console.log('useInmersiones - Fetching Inmersiones...');
      const { data, error } = await supabase
        .from('inmersion')
        .select(`
          *,
          operacion:operacion_id (
            nombre
          )
        `)
        .order('fecha_inmersion', { ascending: false });

      if (error) {
        console.error('useInmersiones - Error fetching Inmersiones:', error);
        throw error;
      }

      // Transformar datos para compatibilidad
      const transformedData = data.map(item => ({
        ...item,
        id: item.inmersion_id, // Alias para compatibilidad
        operacion_nombre: item.operacion?.nombre || 'Sin nombre'
      }));

      console.log('useInmersiones - Inmersiones data:', transformedData);
      return transformedData as Inmersion[];
    },
  });

  // Obtener operaciones disponibles para validación
  const { data: operaciones = [] } = useQuery({
    queryKey: ['operaciones-for-inmersion'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('operacion')
        .select('id, nombre, codigo')
        .eq('estado', 'activa');

      if (error) throw error;
      return data;
    },
  });

  const validatePreInmersion = async (operacionId: string) => {
    console.log('Validating pre-inmersion requirements for operation:', operacionId);
    
    // Verificar HPT firmado
    const { data: hptData, error: hptError } = await supabase
      .from('hpt')
      .select('id, firmado, codigo')
      .eq('operacion_id', operacionId)
      .eq('firmado', true)
      .single();

    if (hptError || !hptData) {
      throw new Error('No existe HPT firmado para esta operación');
    }

    // Verificar Anexo Bravo firmado
    const { data: anexoData, error: anexoError } = await supabase
      .from('anexo_bravo')
      .select('id, firmado, codigo')
      .eq('operacion_id', operacionId)
      .eq('firmado', true)
      .single();

    if (anexoError || !anexoData) {
      throw new Error('No existe Anexo Bravo firmado para esta operación');
    }

    return { hpt_validado: true, anexo_bravo_validado: true };
  };

  const validateOperationDocuments = async (operacionId: string): Promise<ValidationStatus> => {
    try {
      // Verificar HPT firmado
      const { data: hptData } = await supabase
        .from('hpt')
        .select('id, firmado, codigo')
        .eq('operacion_id', operacionId)
        .eq('firmado', true)
        .maybeSingle();

      // Verificar Anexo Bravo firmado
      const { data: anexoData } = await supabase
        .from('anexo_bravo')
        .select('id, firmado, codigo')
        .eq('operacion_id', operacionId)
        .eq('firmado', true)
        .maybeSingle();

      const hasValidHPT = !!hptData;
      const hasValidAnexoBravo = !!anexoData;

      return {
        hasValidHPT,
        hasValidAnexoBravo,
        canExecute: hasValidHPT && hasValidAnexoBravo,
        hptCode: hptData?.codigo,
        anexoBravoCode: anexoData?.codigo
      };
    } catch (error) {
      console.error('Error validating operation documents:', error);
      return {
        hasValidHPT: false,
        hasValidAnexoBravo: false,
        canExecute: false
      };
    }
  };

  const createInmersionMutation = useMutation({
    mutationFn: async (inmersionData: CreateInmersionData) => {
      console.log('Creating Inmersion:', inmersionData);
      
      // Validar requisitos previos
      const validation = await validatePreInmersion(inmersionData.operacion_id);

      // Generar código único
      const codigo = `IMM-${Date.now().toString().slice(-6)}`;

      const { data, error } = await supabase
        .from('inmersion')
        .insert([{
          ...inmersionData,
          codigo,
          estado: 'planificada',
          hpt_validado: validation.hpt_validado,
          anexo_bravo_validado: validation.anexo_bravo_validado,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating Inmersion:', error);
        throw error;
      }

      console.log('Inmersion created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      toast({
        title: "Inmersión creada",
        description: "La inmersión ha sido creada exitosamente y está validada.",
      });
    },
    onError: (error: any) => {
      console.error('Error creating Inmersion:', error);
      toast({
        title: "Error de validación",
        description: error.message || "No se pudo crear la inmersión. Verifique que existan HPT y Anexo Bravo firmados.",
        variant: "destructive",
      });
    },
  });

  const updateInmersionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateInmersionData> }) => {
      console.log('Updating Inmersion:', id, data);
      const { data: updatedData, error } = await supabase
        .from('inmersion')
        .update(data)
        .eq('inmersion_id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating Inmersion:', error);
        throw error;
      }

      console.log('Inmersion updated:', updatedData);
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      toast({
        title: "Inmersión actualizada",
        description: "La inmersión ha sido actualizada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error updating Inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la inmersión. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const executeInmersionMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Executing Inmersion:', id);
      const { data, error } = await supabase
        .from('inmersion')
        .update({ estado: 'en_curso' })
        .eq('inmersion_id', id)
        .select()
        .single();

      if (error) {
        console.error('Error executing Inmersion:', error);
        throw error;
      }

      console.log('Inmersion executed:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      toast({
        title: "Inmersión iniciada",
        description: "La inmersión ha sido iniciada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error executing Inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo iniciar la inmersión. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const completeInmersionMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Completing Inmersion:', id);
      const { data, error } = await supabase
        .from('inmersion')
        .update({ estado: 'completada' })
        .eq('inmersion_id', id)
        .select()
        .single();

      if (error) {
        console.error('Error completing Inmersion:', error);
        throw error;
      }

      console.log('Inmersion completed:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      toast({
        title: "Inmersión completada",
        description: "La inmersión ha sido completada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error completing Inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo completar la inmersión. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const deleteInmersionMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting Inmersion:', id);
      const { error } = await supabase
        .from('inmersion')
        .delete()
        .eq('inmersion_id', id);

      if (error) {
        console.error('Error deleting Inmersion:', error);
        throw error;
      }

      console.log('Inmersion deleted:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      toast({
        title: "Inmersión eliminada",
        description: "La inmersión ha sido eliminada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error deleting Inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la inmersión. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  return {
    inmersiones,
    operaciones,
    isLoading,
    loading: isLoading, // Alias para compatibilidad
    error,
    createInmersion: createInmersionMutation.mutateAsync,
    updateInmersion: updateInmersionMutation.mutateAsync,
    deleteInmersion: deleteInmersionMutation.mutateAsync,
    executeInmersion: executeInmersionMutation.mutateAsync,
    completeInmersion: completeInmersionMutation.mutateAsync,
    validateOperationDocuments,
    refreshInmersiones: refetch,
    isCreating: createInmersionMutation.isPending,
    isUpdating: updateInmersionMutation.isPending,
    isDeleting: deleteInmersionMutation.isPending,
  };
};
