
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import type { Inmersion, ValidationStatus, OperationData, HPTData, AnexoBravoData, EquipoBuceoData } from "@/types/inmersion";
import { getOperationCompleteData, validateOperationDocuments } from './useOperacionInfo';
import { useInmersionesCRUD } from './useInmersionesCRUD';
import { useInmersionExecution } from './useInmersionExecution';
import { useInmersionFiles } from './useInmersionFiles';

export { validateOperationDocuments };
export type { Inmersion, ValidationStatus, OperationData, HPTData, AnexoBravoData, EquipoBuceoData };

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
