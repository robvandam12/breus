
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export interface OperacionFormData {
  nombre: string;
  codigo: string;
  tareas?: string;
  fecha_inicio: string;
  fecha_fin?: string;
  estado: 'activa' | 'completada' | 'cancelada' | 'pausada';
  salmonera_id?: string;
  contratista_id?: string;
  sitio_id?: string;
  servicio_id?: string;
  supervisor_asignado_id?: string;
  company_id?: string;
  company_type?: string;
}

export const useOperacionesMutations = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  const checkCanDelete = async (operacionId: string): Promise<{ canDelete: boolean; reason?: string }> => {
    try {
      console.log('Checking if operation can be deleted:', operacionId);
      
      const { data: hpts } = await supabase.from('hpt').select('id').eq('operacion_id', operacionId).limit(1);
      if (hpts && hpts.length > 0) {
        return { canDelete: false, reason: 'tiene documentos HPT asociados' };
      }
      
      const { data: anexos } = await supabase.from('anexo_bravo').select('id').eq('operacion_id', operacionId).limit(1);
      if (anexos && anexos.length > 0) {
        return { canDelete: false, reason: 'tiene documentos Anexo Bravo asociados' };
      }
      
      const { data: inmersiones } = await supabase.from('inmersion').select('inmersion_id').eq('operacion_id', operacionId).limit(1);
      if (inmersiones && inmersiones.length > 0) {
        return { canDelete: false, reason: 'tiene inmersiones registradas' };
      }
      
      return { canDelete: true };
    } catch (error) {
      console.error('Error checking if operation can be deleted:', error);
      return { canDelete: false, reason: 'error al verificar dependencias' };
    }
  };

  const createMutation = useMutation({
    mutationFn: async (formData: OperacionFormData) => {
      if (profile?.role === 'admin_salmonera' && profile?.salmonera_id && !formData.salmonera_id) {
        formData.salmonera_id = profile.salmonera_id;
      }
      if (profile?.role === 'admin_servicio' && profile?.servicio_id && !formData.servicio_id) {
        formData.servicio_id = profile.servicio_id;
      }
      const { data, error } = await supabase.from('operacion').insert([formData]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({ title: "Operación creada", description: "La operación ha sido creada exitosamente." });
    },
    onError: (error) => {
      console.error('Error creating operacion:', error);
      toast({ title: "Error", description: "No se pudo crear la operación.", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<OperacionFormData> }) => {
      console.log('Updating operation:', id, data);
      const { data: result, error } = await supabase
        .from('operacion')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Update operation error:', error);
        throw error;
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      queryClient.invalidateQueries({ queryKey: ['operacionDetails'] });
      toast({ title: "Operación actualizada", description: "La operación ha sido actualizada exitosamente." });
    },
    onError: (error) => {
      console.error('Error updating operacion:', error);
      toast({ title: "Error", description: "No se pudo actualizar la operación.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Attempting to delete operation:', id);
      
      const { error } = await supabase
        .from('operacion')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Delete operation error:', error);
        throw new Error(`Error al eliminar operación: ${error.message}`);
      }
      
      return { id };
    },
    onSuccess: (result) => {
      console.log('Delete mutation successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      queryClient.invalidateQueries({ queryKey: ['operacionDetails'] });
      queryClient.removeQueries({ queryKey: ['operacionDetails', result.id] });
      queryClient.refetchQueries({ queryKey: ['operaciones'] });
      
      toast({ 
        title: "Operación eliminada", 
        description: "La operación ha sido eliminada exitosamente." 
      });
    },
    onError: (error: any) => {
      console.error('Error deleting operacion:', error);
      toast({ 
        title: "Error", 
        description: `No se pudo eliminar la operación: ${error.message || 'Error desconocido'}`, 
        variant: "destructive" 
      });
    },
  });

  return {
    checkCanDelete,
    createOperacion: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateOperacion: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteOperacion: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
