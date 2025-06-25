
export interface ValidationResult {
  isValid: boolean;
  message?: string;
  warnings?: string[];
}

export const useOperationalContext = () => {
  const operationalContext = {
    mode: 'full_planning',
    permissions: [],
    activeModules: []
  };

  const validateOperationDependencies = (operationType: string): ValidationResult => {
    console.log('Validating operation dependencies for:', operationType);
    return {
      isValid: true,
      message: 'Validation passed'
    };
  };

  const canCreateDirectImmersions = () => {
    return true;
  };

  return {
    operationalContext,
    validateOperationDependencies,
    canCreateDirectImmersions
  };
};
