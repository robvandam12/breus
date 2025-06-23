
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  access_level: 'all' | 'admin' | 'supervisor' | 'custom';
  dependencies?: string[];
  features: string[];
}

export const modules = {
  CORE_IMMERSIONS: 'core_immersions',
  PLANNING_OPERATIONS: 'planning_operations', 
  MAINTENANCE_NETWORKS: 'maintenance_networks',
  ADVANCED_REPORTING: 'advanced_reporting',
  EXTERNAL_INTEGRATIONS: 'external_integrations',
  HPT: 'hpt_forms',
  ANEXO_BRAVO: 'anexo_bravo_forms'
} as const;

export const useModularSystem = () => {
  const { profile } = useAuth();

  const { data: moduleConfigs = [], isLoading } = useQuery({
    queryKey: ['module-configs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('module_configs')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      return data as ModuleConfig[];
    },
  });

  const hasModuleAccess = (moduleId: string): boolean => {
    if (!profile) return false;
    
    const moduleConfig = moduleConfigs.find(config => config.id === moduleId);
    if (!moduleConfig || !moduleConfig.is_active) return false;

    switch (moduleConfig.access_level) {
      case 'all':
        return true;
      case 'admin':
        return profile.role === 'admin' || profile.role === 'superuser';
      case 'supervisor':
        return ['admin', 'superuser', 'supervisor'].includes(profile.role);
      case 'custom':
        // Implementar lógica personalizada según necesidades
        return true;
      default:
        return false;
    }
  };

  const getActiveModules = () => {
    return moduleConfigs.filter(config => 
      config.is_active && hasModuleAccess(config.id)
    );
  };

  const getModuleFeatures = (moduleId: string): string[] => {
    const moduleConfig = moduleConfigs.find(config => config.id === moduleId);
    return moduleConfig?.features || [];
  };

  return {
    modules,
    moduleConfigs,
    isLoading,
    hasModuleAccess,
    getActiveModules,
    getModuleFeatures,
  };
};
