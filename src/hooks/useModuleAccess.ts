
import { useModularSystem } from "./useModularSystem";

interface ModuleAccess {
  planning: boolean;
  maintenance: boolean;
  reporting: boolean;
  integrations: boolean;
}

export const useModuleAccess = () => {
  const { hasModuleAccess, modules } = useModularSystem();

  const isModuleActive = (moduleId: string): boolean => {
    return hasModuleAccess(moduleId);
  };

  const getModuleAccess = (): ModuleAccess => {
    return {
      planning: isModuleActive(modules.PLANNING_OPERATIONS),
      maintenance: isModuleActive(modules.MAINTENANCE_NETWORKS),
      reporting: isModuleActive(modules.ADVANCED_REPORTING),
      integrations: isModuleActive(modules.EXTERNAL_INTEGRATIONS),
    };
  };

  return {
    isModuleActive,
    getModuleAccess,
    modules,
  };
};
