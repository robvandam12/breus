
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
  context?: ValidationContext;
}

export const useOperationTypeValidator = () => {
  const getDefaultContext = (): ValidationContext => ({
    requiresOperations: false,
    requiresDocuments: false,
    requiresTeam: false,
    allowDirectCreation: true,
    moduleAccess: {
      planning: true,
      maintenance: true,
      reporting: true,
      integrations: true
    }
  });

  const validateCoreOperation = (operationType: string, data?: any): ValidationResult => {
    // Las operaciones core siempre pueden proceder
    return {
      isValid: true,
      canProceed: true,
      warnings: [],
      errors: [],
      context: getDefaultContext()
    };
  };

  const validateModularOperation = (operationType: string, data?: any): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validaciones específicas para operaciones modulares
    switch (operationType) {
      case 'create_hpt':
        if (!data?.operacion_id) {
          errors.push('HPT requiere una operación asociada');
        }
        break;
      
      case 'create_anexo_bravo':
        if (!data?.operacion_id) {
          errors.push('Anexo Bravo requiere una operación asociada');
        }
        break;
      
      default:
        warnings.push(`Tipo de operación '${operationType}' no reconocido`);
    }

    return {
      isValid: errors.length === 0,
      canProceed: errors.length === 0,
      warnings,
      errors,
      context: getDefaultContext()
    };
  };

  return {
    validateCoreOperation,
    validateModularOperation
  };
};
