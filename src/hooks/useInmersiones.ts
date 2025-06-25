import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useOfflineSync } from './useOfflineSync';
import { useEffect } from "react";
import type { Inmersion, ValidationStatus, OperationData, HPTData, AnexoBravoData, EquipoBuceoData } from "@/types/inmersion";
import { getOperationCompleteData, validateOperationDocuments } from './useOperacionInfo';
import { useInmersionExecution } from './useInmersionExecution';
import { useInmersionFiles } from './useInmersionFiles';
import { useInmersionSecurity } from './useInmersionSecurity';
import { usePreDiveValidation } from './usePreDiveValidation';

export { validateOperationDocuments };
export type { Inmersion, ValidationStatus, OperationData, HPTData, AnexoBravoData, EquipoBuceoData };

// CRUD operations with contextual validation
const useInmersionesCRUD = (operacionId?: string) => {
  const queryClient = useQueryClient();
  const { isOnline, addPendingAction } = useOfflineSync();
  const { checkForSecurityBreaches } = useInmersionSecurity();
  const { createImmersionWithValidation } = usePreDiveValidation();

  const { data: inmersiones = [], isLoading, error, refetch } = useQuery({
    queryKey: ['inmersiones', operacionId],
    queryFn: async () => {
      let query = supabase
        .from('inmersion')
        .select(`
          *,
          operacion:operacion_id (
            id,
            codigo,
            nombre,
            equipo_buceo_id,
            salmonera_id,
            contratista_id,
            salmoneras:salmonera_id(nombre),
            sitios:sitio_id(nombre),
            contratistas:contratista_id(nombre)
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
        operacion_nombre: (inmersion.operacion as any)?.nombre || '',
        depth_history: Array.isArray(inmersion.depth_history) ? inmersion.depth_history : [],
      })) as unknown as Inmersion[];
    },
  });

  const createInmersionMutation = useMutation({
    mutationFn: async (inmersionData: Omit<Inmersion, 'inmersion_id' | 'created_at' | 'updated_at' | 'operacion_nombre'>) =>
      {
      if (!isOnline) {
        const tempId = `offline_${Date.now()}`;
        const payload = { ...inmersionData, hpt_validado: false, anexo_bravo_validado: false };
        addPendingAction({ type: 'create', table: 'inmersion', payload });
        
        const newInmersion = { ...payload, inmersion_id: tempId, codigo: `OFFLINE-${tempId.slice(-4)}` } as Inmersion;
        queryClient.setQueryData(['inmersiones'], (oldData: Inmersion[] = []) => [...oldData, newInmersion]);
        return newInmersion;
      }

      // Usar validación contextual mejorada
      return await createImmersionWithValidation(inmersionData);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      // El toast ya se maneja en createImmersionWithValidation
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
      if (!isOnline) {
        addPendingAction({ type: 'update', table: 'inmersion', payload: { pk: { inmersion_id: id }, data } });
        queryClient.setQueryData(['inmersiones'], (old: Inmersion[] = []) => 
          old.map(i => i.inmersion_id === id ? { ...i, ...data } : i)
        );
        return { inmersion_id: id, ...data };
      }

      if (data.current_depth !== undefined && data.current_depth !== null) {
        await checkForSecurityBreaches(id, data);

        const { data: currentInmersion, error: fetchError } = await supabase
          .from('inmersion')
          .select('depth_history')
          .eq('inmersion_id', id)
          .single();

        if (fetchError) throw fetchError;

        const currentHistory = (Array.isArray(currentInmersion?.depth_history) ? currentInmersion?.depth_history : []) as Array<{ depth: number; timestamp: string }>;
        const newHistoryEntry = {
          depth: data.current_depth,
          timestamp: new Date().toISOString(),
        };
        const newHistory = [...currentHistory, newHistoryEntry];
        data.depth_history = newHistory as any;
      }

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
        title: isOnline ? "Inmersión actualizada" : "Actualización guardada (Offline)",
        description: isOnline 
          ? "La inmersión ha sido actualizada exitosamente."
          : "Se sincronizará cuando haya conexión.",
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
      if (!isOnline) {
        addPendingAction({ type: 'delete', table: 'inmersion', payload: { pk: { inmersion_id: id } } });
        queryClient.setQueryData(['inmersiones'], (old: Inmersion[] = []) => 
          old.filter(i => i.inmersion_id !== id)
        );
        return;
      }
      const { error } = await supabase
        .from('inmersion')
        .delete()
        .eq('inmersion_id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      toast({
        title: isOnline ? "Inmersión eliminada" : "Eliminación guardada (Offline)",
        description: isOnline
          ? "La inmersión ha sido eliminada exitosamente."
          : "Se sincronizará cuando haya conexión.",
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

  return {
    inmersiones,
    isLoading,
    error,
    refetch,
    createInmersion: createInmersionMutation.mutateAsync,
    isCreating: createInmersionMutation.isPending,
    updateInmersion: updateInmersionMutation.mutateAsync,
    isUpdating: updateInmersionMutation.isPending,
    deleteInmersion: deleteInmersionMutation.mutateAsync,
  };
};

// Main hook
export const useInmersiones = (operacionId?: string) => {
  const queryClient = useQueryClient();
  
  const crud = useInmersionesCRUD(operacionId);
  const execution = useInmersionExecution();
  const files = useInmersionFiles();

  // REAL-TIME SUBSCRIPTION FOR IMMERSIONS
  useEffect(() => {
    const channel = supabase
      .channel('realtime-inmersiones')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inmersion' },
        (payload) => {
          console.log('Cambio en inmersión recibido!', payload);
          queryClient.invalidateQueries({ queryKey: ['inmersiones', operacionId] });
          queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, operacionId]);

  return {
    inmersiones: crud.inmersiones,
    isLoading: crud.isLoading,
    error: crud.error,
    createInmersion: crud.createInmersion,
    updateInmersion: crud.updateInmersion,
    deleteInmersion: crud.deleteInmersion,
    executeInmersion: execution.executeInmersion,
    completeInmersion: execution.completeInmersion,
    importDiveLog: files.importDiveLog,
    isImportingDiveLog: files.isImportingDiveLog,
    validateOperationDocuments,
    getOperationCompleteData,
    refreshInmersiones: crud.refetch,
    isCreating: crud.isCreating,
    isUpdating: crud.isUpdating,
  };
};
