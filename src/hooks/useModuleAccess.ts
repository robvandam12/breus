
import { useModularSystem } from "./useModularSystem";

// Re-exportar todo desde useModularSystem para mantener compatibilidad
export const useModuleAccess = () => {
  const modularSystem = useModularSystem();
  
  // Mantener la interfaz anterior para compatibilidad
  return {
    ...modularSystem,
    
    // Aliases para compatibilidad con código existente
    isModuleActive: modularSystem.hasModuleAccess,
    toggleModule: modularSystem.toggleModule,
    isToggling: modularSystem.isToggling,
    
    // Helpers específicos mantenidos
    canPlanOperations: modularSystem.canPlanOperations,
    canManageNetworks: modularSystem.canManageNetworks,
    canAccessReports: modularSystem.canAccessAdvancedReports,
    canUseIntegrations: modularSystem.canUseIntegrations,
    
    // Helpers específicos por módulo
    canMaintainNetworks: modularSystem.canManageNetworks,
    canOperateNetworks: modularSystem.canManageNetworks,
    canGenerateAdvancedReports: modularSystem.canAccessAdvancedReports,
    canManageIntegrations: modularSystem.canUseIntegrations,
  };
};
