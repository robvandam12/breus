
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Inmersion {
  id: string;
  inmersion_id: string;
  codigo: string;
  operacion_id: string;
  operacion_nombre: string;
  fecha_inmersion: string;
  hora_inicio: string;
  hora_fin?: string;
  profundidad_maxima?: number;
  temperatura_agua: number;
  visibilidad: number;
  corriente: string;
  buzo_principal: string;
  buzo_asistente?: string;
  supervisor: string;
  objetivo: string;
  observaciones?: string;
  hpt_validado: boolean;
  anexo_bravo_validado: boolean;
  estado: 'planificada' | 'en_progreso' | 'completada' | 'cancelada';
  created_at: string;
  updated_at: string;
}

export interface CreateInmersionData {
  operacion_id: string;
  fecha_inmersion: string;
  hora_inicio: string;
  hora_fin?: string;
  profundidad_maxima?: number;
  buzo_principal: string;
  buzo_asistente?: string;
  supervisor: string;
  objetivo: string;
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

  // Fetch inmersiones
  const { data: inmersiones = [], isLoading } = useQuery({
    queryKey: ['inmersiones'],
    queryFn: async () => {
      console.log('Fetching inmersiones...');
      const { data, error } = await supabase
        .from('inmersion')
        .select(`
          *,
          operacion:operacion_id (
            nombre
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching inmersiones:', error);
        throw error;
      }

      // Mapear los datos para incluir operacion_nombre
      const mappedData = (data || []).map(item => ({
        ...item,
        id: item.inmersion_id,
        operacion_nombre: item.operacion?.nombre || 'Sin nombre',
        profundidad_maxima: item.profundidad_max,
      }));

      return mappedData as Inmersion[];
    },
  });

  // Create inmersion
  const createInmersionMutation = useMutation({
    mutationFn: async (data: CreateInmersionData) => {
      console.log('Creating inmersion:', data);
      
      const codigo = `INM-${Date.now().toString().slice(-6)}`;

      const { data: result, error } = await supabase
        .from('inmersion')
        .insert([{
          ...data,
          codigo,
          estado: 'planificada',
          profundidad_max: data.profundidad_maxima
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating inmersion:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      toast({
        title: "Inmersión creada",
        description: "La inmersión ha sido creada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la inmersión.",
        variant: "destructive",
      });
    },
  });

  // Update inmersion
  const updateInmersionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateInmersionData> }) => {
      console.log('Updating inmersion:', id, data);
      
      const { data: result, error } = await supabase
        .from('inmersion')
        .update(data)
        .eq('inmersion_id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      toast({
        title: "Inmersión actualizada",
        description: "La inmersión ha sido actualizada exitosamente.",
      });
    },
  });

  // Delete inmersion
  const deleteInmersionMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting inmersion:', id);
      
      const { error } = await supabase
        .from('inmersion')
        .delete()
        .eq('inmersion_id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      toast({
        title: "Inmersión eliminada",
        description: "La inmersión ha sido eliminada exitosamente.",
      });
    },
  });

  // Execute inmersion
  const executeInmersionMutation = useMutation({
    mutationFn: async (inmersionId: string) => {
      console.log('Executing inmersion:', inmersionId);
      
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
        title: "Inmersión iniciada",
        description: "La inmersión ha sido marcada como en progreso.",
      });
    },
  });

  // Complete inmersion
  const completeInmersionMutation = useMutation({
    mutationFn: async (inmersionId: string) => {
      console.log('Completing inmersion:', inmersionId);
      
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
        title: "Inmersión completada",
        description: "La inmersión ha sido marcada como completada.",
      });
    },
  });

  // Validate operation documents
  const validateOperationDocuments = async (operacionId: string): Promise<ValidationStatus> => {
    console.log('Validating operation documents for:', operacionId);
    
    // Check for valid HPT
    const { data: hptData } = await supabase
      .from('hpt')
      .select('codigo')
      .eq('operacion_id', operacionId)
      .eq('firmado', true)
      .eq('estado', 'firmado')
      .single();

    // Check for valid Anexo Bravo
    const { data: anexoData } = await supabase
      .from('anexo_bravo')
      .select('codigo')
      .eq('operacion_id', operacionId)
      .eq('firmado', true)
      .eq('estado', 'firmado')
      .single();

    const hasValidHPT = !!hptData;
    const hasValidAnexoBravo = !!anexoData;

    return {
      hasValidHPT,
      hasValidAnexoBravo,
      canExecute: hasValidHPT && hasValidAnexoBravo,
      hptCode: hptData?.codigo,
      anexoBravoCode: anexoData?.codigo,
    };
  };

  const refreshInmersiones = () => {
    queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
  };

  return {
    inmersiones,
    isLoading,
    createInmersion: createInmersionMutation.mutateAsync,
    isCreating: createInmersionMutation.isPending,
    updateInmersion: updateInmersionMutation.mutateAsync,
    deleteInmersion: deleteInmersionMutation.mutateAsync,
    executeInmersion: executeInmersionMutation.mutateAsync,
    completeInmersion: completeInmersionMutation.mutateAsync,
    validateOperationDocuments,
    refreshInmersiones,
  };
};
