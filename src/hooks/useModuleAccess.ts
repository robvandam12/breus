
import { useAuth } from './useAuth';

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

  return {
    getModuleAccess,
    hasModuleAccess
  };
};
