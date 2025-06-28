
import { useAuth } from './useAuth';
import { useEnterpriseModuleAccess } from './useEnterpriseModuleAccess';

// Constantes de módulos
export const MODULES = {
  PLANNING_OPERATIONS: 'planning_operations',
  MAINTENANCE_NETWORKS: 'maintenance_networks', 
  ADVANCED_REPORTING: 'advanced_reporting',
  EXTERNAL_INTEGRATIONS: 'external_integrations'
} as const;

export const useModuleAccess = () => {
  const { profile } = useAuth();
  const { hasModuleAccess: hasEnterpriseModuleAccess } = useEnterpriseModuleAccess();

  const getModuleAccess = () => {
    // Si es superuser, todos los módulos están disponibles
    if (profile?.role === 'superuser') {
      return {
        planning: true,
        maintenance: true,
        reporting: true,  
        integrations: true
      };
    }

    // Para usuarios normales, necesitamos verificar módulos por empresa
    // Esto requiere contexto empresarial, por lo que devolvemos false por defecto
    // Los componentes deben usar useEnterpriseModuleAccess directamente para validaciones específicas
    return {
      planning: false,
      maintenance: false,
      reporting: false,  
      integrations: false
    };
  };

  const hasModuleAccess = (moduleId: string): boolean => {
    // Si es superuser, siempre tiene acceso
    if (profile?.role === 'superuser') {
      return true;
    }

    // Para otros usuarios, esto es un fallback básico
    // Los componentes deben usar useEnterpriseModuleAccess para validaciones reales
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
