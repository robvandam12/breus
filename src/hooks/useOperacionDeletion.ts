
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
      console.log('Force delete success, updating cache for:', deletedId);
      
      // Actualización inmediata y agresiva del cache
      queryClient.setQueryData(['operaciones'], (oldData: any) => {
        if (!oldData) return [];
        const filtered = oldData.filter((op: any) => op.id !== deletedId);
        console.log('Cache updated, old length:', oldData.length, 'new length:', filtered.length);
        return filtered;
      });
      
      // Invalidar múltiples queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      queryClient.invalidateQueries({ queryKey: ['operacion-wizard'] });
      queryClient.invalidateQueries({ queryKey: ['operation-documents'] });
      
      // Forzar refetch inmediato
      queryClient.refetchQueries({ queryKey: ['operaciones'] });

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

      console.log('Dependency check results:', { hptResult, anexoResult, inmersionResult });

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

      console.log('Operation deleted successfully');
      return operacionId;
    },
    onSuccess: (deletedId) => {
      console.log('Check and delete success for:', deletedId);
      
      // Actualización inmediata del cache
      queryClient.setQueryData(['operaciones'], (oldData: any) => {
        if (!oldData) return [];
        const filtered = oldData.filter((op: any) => op.id !== deletedId);
        console.log('Cache updated after check delete, old length:', oldData.length, 'new length:', filtered.length);
        return filtered;
      });
      
      // Invalidar y forzar refetch
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      queryClient.refetchQueries({ queryKey: ['operaciones'] });

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

  const deleteWithCacheUpdate = async (operacionId: string) => {
    try {
      console.log('Starting deletion process for:', operacionId);
      
      // Intentar eliminación normal primero
      await checkAndDeleteMutation.mutateAsync(operacionId);
      
      // Forzar actualización adicional del cache después de un delay
      setTimeout(() => {
        console.log('Additional cache refresh for:', operacionId);
        queryClient.setQueryData(['operaciones'], (oldData: any) => {
          if (!oldData) return [];
          return oldData.filter((op: any) => op.id !== operacionId);
        });
      }, 1000);
      
    } catch (error) {
      console.log('Normal delete failed, trying force delete:', error);
      // Si falla, intentar eliminación forzada
      await forceDeleteMutation.mutateAsync(operacionId);
      
      // Forzar actualización adicional del cache
      setTimeout(() => {
        queryClient.setQueryData(['operaciones'], (oldData: any) => {
          if (!oldData) return [];
          return oldData.filter((op: any) => op.id !== operacionId);
        });
        queryClient.refetchQueries({ queryKey: ['operaciones'] });
      }, 1000);
    }
  };

  return {
    forceDelete: forceDeleteMutation.mutateAsync,
    checkAndDelete: checkAndDeleteMutation.mutateAsync,
    deleteWithCacheUpdate,
    isDeleting: forceDeleteMutation.isPending || checkAndDeleteMutation.isPending
  };
};
