
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface HPT {
  id: string;
  codigo: string;
  supervisor: string;
  plan_trabajo: string;
  operacion_id: string;
  fecha_programada?: string;
  hora_inicio?: string;
  hora_fin?: string;
  descripcion_trabajo?: string;
  profundidad_maxima?: number;
  temperatura?: number;
  observaciones?: string;
  firmado: boolean;
  estado?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface HPTFormData {
  codigo: string;
  supervisor: string;
  operacion_id: string;
  plan_trabajo: string;
  fecha_programada?: string;
  hora_inicio?: string;
  hora_fin?: string;
  descripcion_trabajo?: string;
  profundidad_maxima?: number;
  temperatura?: number;
  observaciones?: string;
}

export const useHPT = () => {
  const queryClient = useQueryClient();

  const { data: hpts = [], isLoading, error } = useQuery({
    queryKey: ['hpts'],
    queryFn: async () => {
      console.log('useHPT - Fetching HPTs...');
      const { data, error } = await supabase
        .from('hpt')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('useHPT - Error fetching HPTs:', error);
        throw error;
      }

      console.log('useHPT - HPTs data:', data);
      return data as HPT[];
    },
  });

  const createHPTMutation = useMutation({
    mutationFn: async (hptData: HPTFormData) => {
      console.log('Creating HPT:', hptData);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('hpt')
        .insert([{
          ...hptData,
          user_id: user.id,
          fecha_creacion: new Date().toISOString().split('T')[0]
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating HPT:', error);
        throw error;
      }

      console.log('HPT created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hpts'] });
      toast({
        title: "HPT creada",
        description: "La Hoja de Planificación de Tarea ha sido creada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating HPT:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la HPT. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const updateHPTMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<HPTFormData> }) => {
      console.log('Updating HPT:', id, data);
      const { data: updatedData, error } = await supabase
        .from('hpt')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating HPT:', error);
        throw error;
      }

      console.log('HPT updated:', updatedData);
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hpts'] });
      toast({
        title: "HPT actualizada",
        description: "La HPT ha sido actualizada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error updating HPT:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la HPT. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const deleteHPTMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting HPT:', id);
      const { error } = await supabase
        .from('hpt')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting HPT:', error);
        throw error;
      }

      console.log('HPT deleted:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hpts'] });
      toast({
        title: "HPT eliminada",
        description: "La HPT ha sido eliminada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error deleting HPT:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la HPT. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  return {
    hpts,
    isLoading,
    error,
    createHPT: createHPTMutation.mutateAsync,
    updateHPT: updateHPTMutation.mutateAsync,
    deleteHPT: deleteHPTMutation.mutateAsync,
    isCreating: createHPTMutation.isPending,
    isUpdating: updateHPTMutation.isPending,
    isDeleting: deleteHPTMutation.isPending,
  };
};
