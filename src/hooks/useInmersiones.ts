import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Inmersion {
  inmersion_id: string;
  codigo: string;
  fecha_inmersion: string;
  hora_inicio: string;
  hora_fin?: string;
  operacion_id: string;
  buzo_principal: string;
  buzo_principal_id?: string;
  buzo_asistente?: string;
  buzo_asistente_id?: string;
  supervisor: string;
  supervisor_id?: string;
  objetivo: string;
  estado: string;
  profundidad_max: number;
  temperatura_agua: number;
  visibilidad: number;
  corriente: string;
  observaciones?: string;
  hpt_validado: boolean;
  anexo_bravo_validado: boolean;
  created_at: string;
  updated_at: string;
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

export const useInmersiones = (operacionId?: string) => {
  const queryClient = useQueryClient();

  const { data: inmersiones = [], isLoading, error, refetch } = useQuery({
    queryKey: ['inmersiones', operacionId],
    queryFn: async () => {
      let query = supabase
        .from('inmersion')
        .select(`
          *,
          operacion:operacion_id (
            nombre
          )
        `)
        .order('created_at', { ascending: false });

      if (operacionId) {
        query = query.eq('operacion_id', operacionId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      return data.map(inmersion => ({
        ...inmersion,
        operacion_nombre: inmersion.operacion?.nombre || ''
      })) as Inmersion[];
    },
  });

  const createInmersionMutation = useMutation({
    mutationFn: async (inmersionData: Omit<Inmersion, 'inmersion_id' | 'created_at' | 'updated_at' | 'operacion_nombre'>) => {
      // Eliminar validación de documentos para permitir crear inmersiones sin documentos firmados
      const { data, error } = await supabase
        .from('inmersion')
        .insert({
          ...inmersionData,
          hpt_validado: false,
          anexo_bravo_validado: false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
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
        description: error.message || "No se pudo crear la inmersión.",
        variant: "destructive",
      });
    },
  });

  const updateInmersionMutation = useMutation({
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
        title: "Inmersión actualizada",
        description: "La inmersión ha sido actualizada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error updating inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la inmersión.",
        variant: "destructive",
      });
    },
  });

  const deleteInmersionMutation = useMutation({
    mutationFn: async (id: string) => {
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
    onError: (error) => {
      console.error('Error deleting inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la inmersión.",
        variant: "destructive",
      });
    },
  });

  const executeInmersionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('inmersion')
        .update({ estado: 'en_progreso' })
        .eq('inmersion_id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      toast({
        title: "Inmersión ejecutada",
        description: "La inmersión ha sido puesta en ejecución.",
      });
    },
    onError: (error) => {
      console.error('Error executing inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo ejecutar la inmersión.",
        variant: "destructive",
      });
    },
  });

  const completeInmersionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('inmersion')
        .update({ estado: 'completada' })
        .eq('inmersion_id', id)
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
    onError: (error) => {
      console.error('Error completing inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo completar la inmersión.",
        variant: "destructive",
      });
    },
  });

  const validateOperationDocuments = async (operacionId: string): Promise<ValidationStatus> => {
    try {
      // Verificar HPT firmado
      const { data: hptData } = await supabase
        .from('hpt')
        .select('codigo, firmado')
        .eq('operacion_id', operacionId)
        .eq('firmado', true)
        .single();

      // Verificar Anexo Bravo firmado
      const { data: anexoData } = await supabase
        .from('anexo_bravo')
        .select('codigo, firmado')
        .eq('operacion_id', operacionId)
        .eq('firmado', true)
        .single();

      // Verificar que la operación tenga equipo asignado
      const { data: operacionData } = await supabase
        .from('operacion')
        .select('equipo_buceo_id')
        .eq('id', operacionId)
        .single();

      const hasValidHPT = !!hptData;
      const hasValidAnexoBravo = !!anexoData;
      const hasTeam = !!(operacionData?.equipo_buceo_id);

      return {
        hasValidHPT,
        hasValidAnexoBravo,
        hasTeam,
        canExecute: hasValidHPT && hasValidAnexoBravo && hasTeam,
        hptCode: hptData?.codigo,
        anexoBravoCode: anexoData?.codigo
      };
    } catch (error) {
      console.error('Error validating documents:', error);
      return {
        hasValidHPT: false,
        hasValidAnexoBravo: false,
        hasTeam: false,
        canExecute: false
      };
    }
  };

  return {
    inmersiones,
    isLoading,
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
  };
};
