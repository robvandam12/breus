
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export interface ModuloActivo {
  id: string;
  salmonera_id: string;
  modulo_nombre: string;
  activo: boolean;
  configuracion: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const AVAILABLE_MODULES = {
  core: {
    name: 'Core',
    description: 'Inmersiones, bitácoras y personal de buceo',
    required: true
  },
  planificacion: {
    name: 'Planificación',
    description: 'Operaciones, HPT y Anexo Bravo',
    required: false
  },
  mantencion_redes: {
    name: 'Mantención de Redes',
    description: 'Formularios de mantención de redes',
    required: false
  },
  faena_redes: {
    name: 'Faena de Redes',
    description: 'Formularios de faena de redes',
    required: false
  }
} as const;

export type ModuleName = keyof typeof AVAILABLE_MODULES;

export const useModules = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: activeModules = [], isLoading } = useQuery({
    queryKey: ['active-modules', profile?.salmonera_id],
    queryFn: async () => {
      if (!profile?.salmonera_id) return [];
      
      const { data, error } = await supabase
        .from('modulos_activos')
        .select('*')
        .eq('salmonera_id', profile.salmonera_id)
        .order('modulo_nombre');

      if (error) throw error;
      return data as ModuloActivo[];
    },
    enabled: !!profile?.salmonera_id,
  });

  const toggleModuleMutation = useMutation({
    mutationFn: async ({ moduleId, active }: { moduleId: string; active: boolean }) => {
      const { error } = await supabase
        .from('modulos_activos')
        .update({ activo: active })
        .eq('id', moduleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-modules'] });
      toast({
        title: "Módulo actualizado",
        description: "La configuración del módulo ha sido actualizada correctamente.",
      });
    },
    onError: (error) => {
      console.error('Error updating module:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el módulo.",
        variant: "destructive",
      });
    },
  });

  const isModuleActive = (moduleName: ModuleName): boolean => {
    return activeModules.some(m => m.modulo_nombre === moduleName && m.activo);
  };

  const getActiveModuleNames = (): ModuleName[] => {
    return activeModules
      .filter(m => m.activo)
      .map(m => m.modulo_nombre as ModuleName);
  };

  const hasModule = (moduleName: ModuleName): boolean => {
    return activeModules.some(m => m.modulo_nombre === moduleName);
  };

  return {
    activeModules,
    isLoading,
    isModuleActive,
    getActiveModuleNames,
    hasModule,
    toggleModule: toggleModuleMutation.mutateAsync,
    isToggling: toggleModuleMutation.isPending,
  };
};
