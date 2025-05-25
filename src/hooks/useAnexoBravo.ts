
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface AnexoBravo {
  id: string;
  codigo: string;
  supervisor: string;
  jefe_centro: string;
  operacion_id: string;
  fecha_verificacion: string;
  estado: string;
  firmado: boolean;
  checklist_completo: boolean;
  progreso: number;
  observaciones_generales?: string;
  supervisor_firma?: string;
  jefe_centro_firma?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface AnexoBravoFormData {
  codigo: string;
  supervisor: string;
  jefe_centro: string;
  operacion_id: string;
  fecha_verificacion: string;
  observaciones_generales?: string;
}

export const useAnexoBravo = () => {
  const queryClient = useQueryClient();

  const { data: anexosBravo = [], isLoading, error } = useQuery({
    queryKey: ['anexos-bravo'],
    queryFn: async () => {
      console.log('useAnexoBravo - Fetching Anexos Bravo...');
      const { data, error } = await supabase
        .from('anexo_bravo')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('useAnexoBravo - Error fetching Anexos Bravo:', error);
        throw error;
      }

      console.log('useAnexoBravo - Anexos Bravo data:', data);
      return data as AnexoBravo[];
    },
  });

  const createAnexoBravoMutation = useMutation({
    mutationFn: async (anexoBravoData: AnexoBravoFormData) => {
      console.log('Creating Anexo Bravo:', anexoBravoData);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('anexo_bravo')
        .insert([{
          ...anexoBravoData,
          user_id: user.id,
          fecha_creacion: new Date().toISOString().split('T')[0]
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating Anexo Bravo:', error);
        throw error;
      }

      console.log('Anexo Bravo created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anexos-bravo'] });
      toast({
        title: "Anexo Bravo creado",
        description: "El Anexo Bravo ha sido creado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating Anexo Bravo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el Anexo Bravo. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const updateAnexoBravoMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AnexoBravoFormData> }) => {
      console.log('Updating Anexo Bravo:', id, data);
      const { data: updatedData, error } = await supabase
        .from('anexo_bravo')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating Anexo Bravo:', error);
        throw error;
      }

      console.log('Anexo Bravo updated:', updatedData);
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anexos-bravo'] });
      toast({
        title: "Anexo Bravo actualizado",
        description: "El Anexo Bravo ha sido actualizado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error updating Anexo Bravo:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el Anexo Bravo. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const deleteAnexoBravoMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting Anexo Bravo:', id);
      const { error } = await supabase
        .from('anexo_bravo')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting Anexo Bravo:', error);
        throw error;
      }

      console.log('Anexo Bravo deleted:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anexos-bravo'] });
      toast({
        title: "Anexo Bravo eliminado",
        description: "El Anexo Bravo ha sido eliminado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error deleting Anexo Bravo:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el Anexo Bravo. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  return {
    anexosBravo,
    isLoading,
    error,
    createAnexoBravo: createAnexoBravoMutation.mutateAsync,
    updateAnexoBravo: updateAnexoBravoMutation.mutateAsync,
    deleteAnexoBravo: deleteAnexoBravoMutation.mutateAsync,
    isCreating: createAnexoBravoMutation.isPending,
    isUpdating: updateAnexoBravoMutation.isPending,
    isDeleting: deleteAnexoBravoMutation.isPending,
  };
};
