
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export interface SystemModule {
  id: string;
  name: string;
  display_name: string;
  description: string;
  category: 'planning' | 'operational' | 'reporting' | 'integration';
  dependencies: string[];
  version: string;
  is_core: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyModule {
  id: string;
  company_id: string;
  company_type: 'salmonera' | 'contratista';
  module_name: string;
  is_active: boolean;
  activated_by?: string;
  activated_at?: string;
  deactivated_at?: string;
  configuration: any;
  created_at: string;
  updated_at: string;
}

export interface ActiveModule {
  module_name: string;
  display_name: string;
  description: string;
  category: string;
  configuration: any;
}

export const useModularSystem = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // Obtener todos los módulos del sistema
  const { data: systemModules = [], isLoading: loadingSystemModules } = useQuery({
    queryKey: ['system-modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_modules')
        .select('*')
        .order('category, display_name');

      if (error) throw error;
      return data as SystemModule[];
    },
  });

  // Obtener módulos activos para la empresa del usuario
  const { data: activeModules = [], isLoading: loadingActiveModules } = useQuery({
    queryKey: ['active-modules', profile?.salmonera_id || profile?.servicio_id],
    queryFn: async () => {
      if (!profile?.salmonera_id && !profile?.servicio_id) return [];
      
      const companyId = profile.salmonera_id || profile.servicio_id;
      const companyType = profile.salmonera_id ? 'salmonera' : 'contratista';
      
      const { data, error } = await supabase
        .rpc('get_company_active_modules', {
          p_company_id: companyId,
          p_company_type: companyType
        });

      if (error) throw error;
      return data as ActiveModule[];
    },
    enabled: !!(profile?.salmonera_id || profile?.servicio_id),
  });

  // Verificar si un módulo específico está activo
  const hasModuleAccess = (moduleName: string): boolean => {
    return activeModules.some(module => module.module_name === moduleName);
  };

  // Verificar múltiples módulos
  const hasAnyModule = (moduleNames: string[]): boolean => {
    return moduleNames.some(name => hasModuleAccess(name));
  };

  // Obtener configuración específica de un módulo
  const getModuleConfig = (moduleName: string): any => {
    const module = activeModules.find(m => m.module_name === moduleName);
    return module?.configuration || {};
  };

  // Mutation para activar/desactivar módulos (solo admins y superuser)
  const toggleModule = useMutation({
    mutationFn: async ({ 
      companyId, 
      companyType, 
      moduleName, 
      isActive 
    }: { 
      companyId: string; 
      companyType: 'salmonera' | 'contratista'; 
      moduleName: string; 
      isActive: boolean;
    }) => {
      const { data, error } = await supabase
        .from('company_modules')
        .upsert({
          company_id: companyId,
          company_type: companyType,
          module_name: moduleName,
          is_active: isActive,
          activated_by: isActive ? profile?.id : null,
          configuration: {},
        }, {
          onConflict: 'company_id,company_type,module_name'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['active-modules'] });
      toast({
        title: variables.isActive ? "Módulo Activado" : "Módulo Desactivado",
        description: `El módulo ha sido ${variables.isActive ? 'activado' : 'desactivado'} exitosamente.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado del módulo.",
        variant: "destructive",
      });
    },
  });

  // Helpers específicos para módulos conocidos
  const modules = {
    // Core (siempre activo)
    CORE_IMMERSIONS: 'core_immersions',
    
    // Módulos opcionales
    PLANNING_OPERATIONS: 'planning_operations',
    MAINTENANCE_NETWORKS: 'maintenance_networks', // antes MultiX
    ADVANCED_REPORTING: 'advanced_reporting',
    EXTERNAL_INTEGRATIONS: 'external_integrations',
  };

  return {
    // Data
    systemModules,
    activeModules,
    isLoading: loadingSystemModules || loadingActiveModules,
    
    // Verificaciones
    hasModuleAccess,
    hasAnyModule,
    getModuleConfig,
    
    // Acciones
    toggleModule: toggleModule.mutateAsync,
    isToggling: toggleModule.isPending,
    
    // Helpers específicos
    canPlanOperations: hasModuleAccess(modules.PLANNING_OPERATIONS),
    canManageNetworks: hasModuleAccess(modules.MAINTENANCE_NETWORKS),
    canAccessAdvancedReports: hasModuleAccess(modules.ADVANCED_REPORTING),
    canUseIntegrations: hasModuleAccess(modules.EXTERNAL_INTEGRATIONS),
    
    // Constantes
    modules,
  };
};
