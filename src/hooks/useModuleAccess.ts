
import { useAuth } from './useAuth';

// Constantes de módulos
export const MODULES = {
  PLANNING_OPERATIONS: 'planning_operations',
  MAINTENANCE_NETWORKS: 'maintenance_networks', 
  ADVANCED_REPORTING: 'advanced_reporting',
  EXTERNAL_INTEGRATIONS: 'external_integrations'
} as const;

export const useModuleAccess = () => {
  const { profile } = useAuth();

  const getModuleAccess = () => {
    // Por defecto, todos los módulos están activos para simplificar
    // En una implementación real, esto vendría de la base de datos
    return {
      planning: true,
      maintenance: true,
      reporting: true,  
      integrations: true
    };
  };

  const hasModuleAccess = (moduleId: string): boolean => {
    const access = getModuleAccess();
    
    switch (moduleId) {
      case 'planning_operations':
        return access.planning;
      case 'maintenance_networks':
        return access.maintenance;
      case 'advanced_reporting':
        return access.reporting;
      case 'external_integrations':
        return access.integrations;
      default:
        return false;
    }
  };

  // Funciones auxiliares para compatibilidad
  const isModuleActive = (moduleId: string): boolean => {
    return hasModuleAccess(moduleId);
  };

  const canPlanOperations = (): boolean => {
    return hasModuleAccess(MODULES.PLANNING_OPERATIONS);
  };

  return {
    getModuleAccess,
    hasModuleAccess,
    isModuleActive,
    canPlanOperations,
    modules: MODULES
  };
};
