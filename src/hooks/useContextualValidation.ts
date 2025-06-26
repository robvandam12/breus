
import { useOperationTypeValidator } from "./validation/useOperationTypeValidator";
import { useModuleAccess } from "./useModuleAccess";

interface ValidationContext {
  requiresOperations: boolean;
  requiresDocuments: boolean;
  requiresTeam: boolean;
  allowDirectCreation: boolean;
  moduleAccess: {
    planning: boolean;
    maintenance: boolean;
    reporting: boolean;
    integrations: boolean;
  };
}

interface ValidationResult {
  isValid: boolean;
  canProceed: boolean;
  warnings: string[];
  errors: string[];
  context: ValidationContext;
  requiredModule?: string;
}

export const useContextualValidation = () => {
  const { getModuleAccess } = useModuleAccess();
  const { validateCoreOperation, validateModularOperation } = useOperationTypeValidator();

  // Obtener contexto modular actualizado
  const getModularContext = (): ValidationContext => {
    const moduleAccess = getModuleAccess();

    return {
      requiresOperations: moduleAccess.planning,
      requiresDocuments: moduleAccess.planning,
      requiresTeam: moduleAccess.planning,
      allowDirectCreation: true, // CORE: Siempre permitir creación directa
      moduleAccess
    };
  };

  // Validación mejorada por tipo de operación
  const validateOperationByType = (operationType: string, data?: any): ValidationResult => {
    const context = getModularContext();
    
    // Determinar si es operación core o modular
    const coreOperations = ['create_immersion', 'create_bitacora'];
    const isCore = coreOperations.includes(operationType);
    
    const result = isCore 
      ? validateCoreOperation(operationType, data)
      : validateModularOperation(operationType, data);

    return {
      ...result,
      context
    };
  };

  // Validar creación de inmersión según contexto modular (mantenido para compatibilidad)
  const validateInmersionCreation = async (data?: any): Promise<ValidationResult> => {
    if (data?.operacion_id) {
      // Si tiene operación, es planificada
      return validateOperationByType('create_planned_immersion', data);
    } else {
      // Sin operación, es directa (core)
      return validateOperationByType('create_immersion', data);
    }
  };

  // Validar creación de bitácora (mantenido para compatibilidad)
  const validateBitacoraCreation = async (inmersionId: string): Promise<ValidationResult> => {
    return validateOperationByType('create_bitacora', { inmersion_id: inmersionId });
  };

  // Validar acceso a módulo específico
  const validateModuleAccess = (moduleId: string): ValidationResult => {
    const context = getModularContext();
    const moduleMap: Record<string, boolean> = {
      'planning_operations': context.moduleAccess.planning,
      'maintenance_networks': context.moduleAccess.maintenance,
      'advanced_reporting': context.moduleAccess.reporting,
      'external_integrations': context.moduleAccess.integrations,
    };

    const hasAccess = moduleMap[moduleId] ?? false;

    return {
      isValid: hasAccess,
      canProceed: hasAccess,
      warnings: hasAccess ? [] : [`Módulo '${moduleId}' no está activo para esta empresa`],
      errors: hasAccess ? [] : [`Acceso denegado al módulo '${moduleId}'`],
      context,
      requiredModule: hasAccess ? undefined : moduleId
    };
  };

  return {
    validateOperationByType,
    validateInmersionCreation,
    validateBitacoraCreation,
    validateModuleAccess,
    getModularContext,
  };
};
