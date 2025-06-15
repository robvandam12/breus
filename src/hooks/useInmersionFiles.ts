
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useOfflineSync } from './useOfflineSync';
import type { Inmersion } from "@/types/inmersion";
import { parseDiveLog } from "@/utils/diveLogParser";

export const useInmersionFiles = () => {
  const queryClient = useQueryClient();
  const { isOnline } = useOfflineSync();

  const importDiveLogMutation = useMutation({
    mutationFn: async ({ inmersionId, file }: { inmersionId: string; file: File }) => {
      if (!isOnline) {
        throw new Error("La importación de archivos no está disponible en modo offline.");
      }

      const fileContent = await file.text();
      const parsedData = parseDiveLog(fileContent, file.type);
      
      const updatePayload: Partial<Inmersion> = {
        profundidad_max: parsedData.maxDepth,
        depth_history: parsedData.profile.map(p => ({ depth: p.depth, timestamp: p.timestamp })),
      };
      
      const { data, error } = await supabase
        .from('inmersion')
        .update(updatePayload)
        .eq('inmersion_id', inmersionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      queryClient.invalidateQueries({ queryKey: ['active_inmersions'] });
      toast({
        title: "Log de Buceo Importado",
        description: "Los datos del computador de buceo han sido importados y asociados a la inmersión.",
      });
    },
    onError: (error: Error) => {
      console.error('Error importing dive log:', error);
      toast({
        title: "Error de Importación",
        description: error.message || "No se pudo importar el archivo.",
        variant: "destructive",
      });
    },
  });

  return {
    importDiveLog: importDiveLogMutation.mutateAsync,
    isImportingDiveLog: importDiveLogMutation.isPending,
  };
};
