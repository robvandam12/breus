
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Inmersion {
  inmersion_id: string;
  operacion_id: string;
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

export const useInmersiones = () => {
  const queryClient = useQueryClient();

  const { data: inmersiones = [], isLoading, error } = useQuery({
    queryKey: ['inmersiones'],
    queryFn: async () => {
      console.log('useInmersiones - Fetching Inmersiones...');
      const { data, error } = await supabase
        .from('inmersion')
        .select('*')
        .order('fecha_inmersion', { ascending: false });

      if (error) {
        console.error('useInmersiones - Error fetching Inmersiones:', error);
        throw error;
      }

      console.log('useInmersiones - Inmersiones data:', data);
      return data as Inmersion[];
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
      .select('id, firmado')
      .eq('operacion_id', operacionId)
      .eq('firmado', true)
      .single();

    if (hptError || !hptData) {
      throw new Error('No existe HPT firmado para esta operación');
    }

    // Verificar Anexo Bravo firmado
    const { data: anexoData, error: anexoError } = await supabase
      .from('anexo_bravo')
      .select('id, firmado')
      .eq('operacion_id', operacionId)
      .eq('firmado', true)
      .single();

    if (anexoError || !anexoData) {
      throw new Error('No existe Anexo Bravo firmado para esta operación');
    }

    return { hpt_validado: true, anexo_bravo_validado: true };
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
    error,
    createInmersion: createInmersionMutation.mutateAsync,
    updateInmersion: updateInmersionMutation.mutateAsync,
    deleteInmersion: deleteInmersionMutation.mutateAsync,
    isCreating: createInmersionMutation.isPending,
    isUpdating: updateInmersionMutation.isPending,
    isDeleting: deleteInmersionMutation.isPending,
  };
};
