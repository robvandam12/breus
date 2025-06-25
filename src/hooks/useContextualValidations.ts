
import { useOperationalContext } from './useOperationalContext';
import { useModularSystem } from './useModularSystem';

export interface ValidationResult {
  canProceed: boolean;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  requiresModules: string[];
  context: {
    workflowType: 'planned' | 'direct' | 'mixed';
    hasRequiredModules: boolean;
    missingModules: string[];
  };
}

export const useContextualValidations = () => {
  const { 
    getWorkflowType, 
    canCreateOperations, 
    canCreateMaintenanceForms,
    requiresDocuments,
    requiresPlanning 
  } = useOperationalContext();
  
  const { hasModuleAccess, modules } = useModularSystem();

  // Validación para crear inmersiones (siempre permitido - core)
  const validateInmersionCreation = (data?: {
    operacion_id?: string;
    is_independent?: boolean;
  }): ValidationResult => {
    const workflowType = getWorkflowType();
    const warnings: string[] = [];
    const errors: string[] = [];

    // Verificar si está intentando asociar a una operación sin tener el módulo
    if (data?.operacion_id && !canCreateOperations()) {
      warnings.push('Operación especificada pero módulo de planificación no está activo');
    }

    // Dar contexto sobre el modo de operación
    if (workflowType === 'direct') {
      warnings.push('Modo directo: inmersión independiente sin planificación');
    } else if (workflowType === 'mixed' && !data?.operacion_id) {
      warnings.push('Modo mixto: puedes asociar esta inmersión a una operación si lo deseas');
    }

    return {
      canProceed: true, // Inmersiones siempre permitidas
      isValid: true,
      errors,
      warnings,
      requiresModules: [],
      context: {
        workflowType,
        hasRequiredModules: true, // Core no requiere módulos
        missingModules: [],
      },
    };
  };

  // Validación para crear bitácoras (siempre permitido - core)
  const validateBitacoraCreation = (inmersionId: string): ValidationResult => {
    const workflowType = getWorkflowType();

    return {
      canProceed: true, // Bitácoras siempre permitidas
      isValid: true,
      errors: [],
      warnings: [],
      requiresModules: [],
      context: {
        workflowType,
        hasRequiredModules: true, // Core no requiere módulos
        missingModules: [],
      },
    };
  };

  // Validación para crear operaciones (requiere módulo planning)
  const validateOperationCreation = (): ValidationResult => {
    const workflowType = getWorkflowType();
    const hasPlanning = hasModuleAccess(modules.PLANNING_OPERATIONS);
    const errors: string[] = [];
    const missingModules: string[] = [];

    if (!hasPlanning) {
      errors.push('El módulo de planificación de operaciones es requerido para crear operaciones');
      missingModules.push(modules.PLANNING_OPERATIONS);
    }

    return {
      canProceed: hasPlanning,
      isValid: hasPlanning,
      errors,
      warnings: [],
      requiresModules: [modules.PLANNING_OPERATIONS],
      context: {
        workflowType,
        hasRequiredModules: hasPlanning,
        missingModules,
      },
    };
  };

  // Validación para formularios de mantención (requiere módulo maintenance)
  const validateMaintenanceFormCreation = (): ValidationResult => {
    const workflowType = getWorkflowType();
    const hasMaintenance = hasModuleAccess(modules.MAINTENANCE_NETWORKS);
    const errors: string[] = [];
    const missingModules: string[] = [];

    if (!hasMaintenance) {
      errors.push('El módulo de mantención de redes es requerido para crear formularios de mantención');
      missingModules.push(modules.MAINTENANCE_NETWORKS);
    }

    return {
      canProceed: hasMaintenance,
      isValid: hasMaintenance,
      errors,
      warnings: [],
      requiresModules: [modules.MAINTENANCE_NETWORKS],
      context: {
        workflowType,
        hasRequiredModules: hasMaintenance,
        missingModules,
      },
    };
  };

  // Validación de documentos (HPT, Anexo Bravo) - solo si planning está activo
  const validateDocumentRequirement = (operacionId?: string): ValidationResult => {
    const workflowType = getWorkflowType();
    const warnings: string[] = [];
    
    // Si no hay módulo de planificación, los documentos no son necesarios
    if (!hasModuleAccess(modules.PLANNING_OPERATIONS)) {
      warnings.push('Módulo de planificación no activo - documentos no requeridos');
      return {
        canProceed: true,
        isValid: true,
        errors: [],
        warnings,
        requiresModules: [],
        context: {
          workflowType,
          hasRequiredModules: true,
          missingModules: [],
        },
      };
    }

    // Si hay planning pero no operación, dar contexto
    if (!operacionId) {
      warnings.push('Sin operación asociada - documentos no aplicables');
    } else if (requiresDocuments()) {
      warnings.push('Documentos HPT y Anexo Bravo requeridos para esta operación');
    }

    return {
      canProceed: true,
      isValid: true,
      errors: [],
      warnings,
      requiresModules: [],
      context: {
        workflowType,
        hasRequiredModules: true,
        missingModules: [],
      },
    };
  };

  return {
    validateInmersionCreation,
    validateBitacoraCreation,
    validateOperationCreation,
    validateMaintenanceFormCreation,
    validateDocumentRequirement,
    
    // Helpers de estado
    workflowType: getWorkflowType(),
    coreModulesAlwaysAvailable: true,
  };
};
