
interface ValidationResult {
  isValid: boolean;
  canProceed: boolean;
  warnings: string[];
  errors: string[];
}

export const useOperationTypeValidator = () => {
  const validateCoreOperation = (operationType: string, data?: any): ValidationResult => {
    // Las operaciones core siempre pueden proceder
    return {
      isValid: true,
      canProceed: true,
      warnings: [],
      errors: []
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
      errors
    };
  };

  return {
    validateCoreOperation,
    validateModularOperation
  };
};
