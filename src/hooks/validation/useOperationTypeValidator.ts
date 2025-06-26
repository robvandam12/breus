
import { useModuleAccess } from "../useModuleAccess";

interface ValidationResult {
  isValid: boolean;
  canProceed: boolean;
  warnings: string[];
  errors: string[];
  requiredModule?: string;
}

export const useOperationTypeValidator = () => {
  const { isModuleActive, getModuleAccess, modules } = useModuleAccess();

  const validateCoreOperation = (operationType: string, data?: any): ValidationResult => {
    const warnings: string[] = [];
    const errors: string[] = [];

    switch (operationType) {
      case 'create_immersion':
        const moduleAccess = getModuleAccess();
        return {
          isValid: true,
          canProceed: true,
          warnings: moduleAccess.planning 
            ? [] 
            : ['Módulo de planificación no activo - Solo inmersiones directas disponibles'],
          errors: [],
        };

      case 'create_bitacora':
        if (!data?.inmersion_id) {
          errors.push('Bitácora requiere inmersión asociada');
        }
        
        return {
          isValid: errors.length === 0,
          canProceed: true, // Core functionality
          warnings,
          errors,
        };

      default:
        return {
          isValid: true,
          canProceed: true,
          warnings: [`Tipo de operación '${operationType}' no reconocido - Usando validación por defecto`],
          errors: [],
        };
    }
  };

  const validateModularOperation = (operationType: string, data?: any): ValidationResult => {
    const warnings: string[] = [];
    const errors: string[] = [];

    switch (operationType) {
      case 'create_planned_immersion':
        if (!isModuleActive(modules.PLANNING_OPERATIONS)) {
          return {
            isValid: false,
            canProceed: false,
            warnings: [],
            errors: ['Requiere módulo de planificación de operaciones activo'],
            requiredModule: 'planning_operations'
          };
        }
        
        if (data?.operacion_id) {
          warnings.push('Inmersión planificada - Verificar documentos HPT y Anexo Bravo');
        } else {
          errors.push('Inmersión planificada requiere operación asociada');
        }
        
        return {
          isValid: errors.length === 0,
          canProceed: errors.length === 0,
          warnings,
          errors,
        };

      case 'create_operation':
      case 'create_hpt':
      case 'create_anexo_bravo':
        if (!isModuleActive(modules.PLANNING_OPERATIONS)) {
          return {
            isValid: false,
            canProceed: false,
            warnings: [],
            errors: ['Requiere módulo de planificación de operaciones activo'],
            requiredModule: 'planning_operations'
          };
        }
        
        if ((operationType === 'create_hpt' || operationType === 'create_anexo_bravo') && !data?.operacion_id) {
          errors.push('Documento requiere operación asociada');
        }
        
        return {
          isValid: errors.length === 0,
          canProceed: errors.length === 0,
          warnings,
          errors,
        };

      case 'create_maintenance_form':
        if (!isModuleActive(modules.MAINTENANCE_NETWORKS)) {
          return {
            isValid: false,
            canProceed: false,
            warnings: [],
            errors: ['Requiere módulo de mantención de redes activo'],
            requiredModule: 'maintenance_networks'
          };
        }
        
        return {
          isValid: true,
          canProceed: true,
          warnings,
          errors,
        };

      case 'access_advanced_reports':
        if (!isModuleActive(modules.ADVANCED_REPORTING)) {
          return {
            isValid: false,
            canProceed: false,
            warnings: [],
            errors: ['Requiere módulo de reportes avanzados activo'],
            requiredModule: 'advanced_reporting'
          };
        }
        
        return {
          isValid: true,
          canProceed: true,
          warnings,
          errors,
        };

      case 'use_integrations':
        if (!isModuleActive(modules.EXTERNAL_INTEGRATIONS)) {
          return {
            isValid: false,
            canProceed: false,
            warnings: [],
            errors: ['Requiere módulo de integraciones externas activo'],
            requiredModule: 'external_integrations'
          };
        }
        
        return {
          isValid: true,
          canProceed: true,
          warnings,
          errors,
        };

      default:
        return validateCoreOperation(operationType, data);
    }
  };

  return {
    validateCoreOperation,
    validateModularOperation,
  };
};
