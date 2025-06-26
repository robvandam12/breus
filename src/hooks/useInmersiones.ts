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

// CRUD operations with contextual validation and company context
const useInmersionesCRUD = (operacionId?: string) => {
  const queryClient = useQueryClient();
  const { isOnline, addPendingAction } = useOfflineSync();
  const { checkForSecurityBreaches } = useInmersionSecurity();
  const { createImmersionWithValidation } = usePreDiveValidation();

  const { data: inmersiones = [], isLoading, error, refetch } = useQuery({
    queryKey: ['inmersiones', operacionId],
    queryFn: async () => {
      // Obtener contexto del usuario para filtrar por empresa si no es superuser
      const { data: userContext, error: contextError } = await supabase
        .rpc('get_user_company_context');

      if (contextError) {
        console.error('Error getting user context:', contextError);
      }

      const contextData = userContext?.[0];
      const isSuperuser = contextData?.is_superuser;

      let query = supabase
        .from('inmersion')
        .select(`
          *,
          operacion:operacion_id (
            id,
            codigo,
            nombre,
            salmonera_id,
            contratista_id,
            salmoneras:salmonera_id(nombre),
            sitios:sitio_id(nombre),
            contratistas:contratista_id(nombre)
          )
        `)
        .order('created_at', { ascending: false });

      // Filtrar por operación específica si se proporciona
      if (operacionId) {
        query = query.eq('operacion_id', operacionId);
      }

      // Si no es superuser, filtrar por empresa del usuario
      if (!isSuperuser && contextData?.company_id) {
        query = query.eq('company_id', contextData.company_id);
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
    mutationFn: async (inmersionData: Omit<Inmersion, 'inmersion_id' | 'created_at' | 'updated_at' | 'operacion_nombre'>) => {
      if (!isOnline) {
        const tempId = `offline_${Date.now()}`;
        const payload = { ...inmersionData, hpt_validado: false, anexo_bravo_validado: false };
        addPendingAction({ type: 'create', table: 'inmersion', payload });
        
        const newInmersion = { ...payload, inmersion_id: tempId, codigo: `OFFLINE-${tempId.slice(-4)}` } as Inmersion;
        queryClient.setQueryData(['inmersiones'], (oldData: Inmersion[] = []) => [...oldData, newInmersion]);
        return newInmersion;
      }

      // Validar que tenga contexto empresarial
      if (!inmersionData.company_id || !inmersionData.company_type) {
        throw new Error('Contexto empresarial requerido para crear inmersión');
      }

      // Limpiar datos para enviar solo campos que existen en la tabla
      const cleanData = {
        codigo: inmersionData.codigo,
        operacion_id: inmersionData.operacion_id || null,
        fecha_inmersion: inmersionData.fecha_inmersion,
        hora_inicio: inmersionData.hora_inicio,
        hora_fin: inmersionData.hora_fin || null,
        objetivo: inmersionData.objetivo,
        profundidad_max: inmersionData.profundidad_max,
        temperatura_agua: inmersionData.temperatura_agua,
        visibilidad: inmersionData.visibilidad,
        corriente: inmersionData.corriente,
        supervisor: inmersionData.supervisor,
        buzo_principal: inmersionData.buzo_principal,
        buzo_asistente: inmersionData.buzo_asistente || null,
        observaciones: inmersionData.observaciones || '',
        estado: inmersionData.estado || 'planificada',
        planned_bottom_time: inmersionData.planned_bottom_time || null,
        context_type: inmersionData.context_type || 'direct',
        is_independent: inmersionData.is_independent || false,
        company_id: inmersionData.company_id,
        company_type: inmersionData.company_type,
        hpt_validado: inmersionData.hpt_validado || false,
        anexo_bravo_validado: inmersionData.anexo_bravo_validado || false
      };

      console.log('Creating inmersion with clean data:', cleanData);

      // Para inmersiones independientes, crear directamente
      if (cleanData.is_independent || !cleanData.operacion_id) {
        const { data, error } = await supabase
          .from('inmersion')
          .insert([{
            ...cleanData,
            is_independent: true,
            hpt_validado: true, // Independientes no requieren HPT
            anexo_bravo_validado: true, // Independientes no requieren Anexo Bravo
            contexto_operativo: 'independiente'
          }])
          .select()
          .single();

        if (error) {
          console.error('Database error:', error);
          throw error;
        }
        
        toast({
          title: "Inmersión creada",
          description: "La inmersión independiente ha sido creada exitosamente.",
        });
        
        return data;
      }

      // Para inmersiones con operación, usar validación contextual
      return await createImmersionWithValidation(cleanData);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
    },
    onError: (error: any) => {
      console.error('Error creating inmersion:', error);
      
      let errorMessage = "No se pudo crear la inmersión.";
      
      if (error.code === 'PGRST204') {
        errorMessage = "Error de configuración de la base de datos. Por favor contacta al administrador.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
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
