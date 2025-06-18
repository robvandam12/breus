
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useOperacionDeletion = () => {
  const queryClient = useQueryClient();

  const forceDeleteMutation = useMutation({
    mutationFn: async (operacionId: string) => {
      console.log('Force deleting operation:', operacionId);
      
      // Eliminar directamente sin verificaciones previas
      const { error } = await supabase
        .from('operacion')
        .delete()
        .eq('id', operacionId);

      if (error) {
        console.error('Force delete error:', error);
        throw error;
      }

      console.log('Operation force deleted successfully');
      return operacionId;
    },
    onSuccess: (deletedId) => {
      // Forzar actualización inmediata del cache
      queryClient.setQueryData(['operaciones'], (oldData: any) => {
        if (!oldData) return [];
        return oldData.filter((op: any) => op.id !== deletedId);
      });
      
      // Invalidar múltiples queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      queryClient.invalidateQueries({ queryKey: ['operacion-wizard'] });
      queryClient.invalidateQueries({ queryKey: ['operation-documents'] });
      
      // Refetch forzado
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['operaciones'] });
      }, 100);

      toast({
        title: "Operación eliminada",
        description: "La operación ha sido eliminada exitosamente."
      });
    },
    onError: (error: any) => {
      console.error('Force delete mutation error:', error);
      toast({
        title: "Error al eliminar",
        description: `No se pudo eliminar la operación: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const checkAndDeleteMutation = useMutation({
    mutationFn: async (operacionId: string) => {
      console.log('Checking and deleting operation:', operacionId);
      
      // Verificar dependencias
      const [hptResult, anexoResult, inmersionResult] = await Promise.all([
        supabase
          .from('hpt')
          .select('id, firmado')
          .eq('operacion_id', operacionId)
          .maybeSingle(),
        supabase
          .from('anexo_bravo')
          .select('id, firmado')
          .eq('operacion_id', operacionId)
          .maybeSingle(),
        supabase
          .from('inmersion')
          .select('inmersion_id')
          .eq('operacion_id', operacionId)
          .maybeSingle()
      ]);

      // Verificar si hay documentos firmados o inmersiones
      if (hptResult.data?.firmado || anexoResult.data?.firmado || inmersionResult.data) {
        throw new Error('La operación tiene documentos firmados o inmersiones asociadas');
      }

      // Eliminar si no hay dependencias
      const { error } = await supabase
        .from('operacion')
        .delete()
        .eq('id', operacionId);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      return operacionId;
    },
    onSuccess: (deletedId) => {
      // Actualización optimista del cache
      queryClient.setQueryData(['operaciones'], (oldData: any) => {
        if (!oldData) return [];
        return oldData.filter((op: any) => op.id !== deletedId);
      });
      
      // Invalidar y refetch
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['operaciones'] });
      }, 200);

      toast({
        title: "Operación eliminada",
        description: "La operación ha sido eliminada exitosamente."
      });
    },
    onError: (error: any) => {
      console.error('Check and delete error:', error);
      toast({
        title: "No se puede eliminar",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return {
    forceDelete: forceDeleteMutation.mutateAsync,
    checkAndDelete: checkAndDeleteMutation.mutateAsync,
    isDeleting: forceDeleteMutation.isPending || checkAndDeleteMutation.isPending
  };
};
