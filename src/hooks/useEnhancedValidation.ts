
import { useState, useCallback } from 'react';
import { useContextualValidator } from './useContextualValidator';
import { EnterpriseSelectionResult } from './useEnterpriseContext';
import { toast } from './use-toast';

export interface ValidationConfig {
  showToasts?: boolean;
  strictMode?: boolean;
  validateOnChange?: boolean;
}

interface EnhancedValidationResult {
  success: boolean;
  result?: {
    isValid: boolean;
    canProceed: boolean;
    errors: string[];
    warnings: string[];
    context?: any; // Add context property
  };
}

export const useEnhancedValidation = (config: ValidationConfig = {}) => {
  const {
    showToasts = true,
    strictMode = false,
    validateOnChange = false
  } = config;

  const contextualValidator = useContextualValidator();
  const [isValidating, setIsValidating] = useState(false);
  const [lastValidationResult, setLastValidationResult] = useState<any>(null);

  const validateWithErrorHandling = useCallback(async (
    formType: string,
    formData: any,
    enterpriseContextOrOptions?: EnterpriseSelectionResult | { showToast?: boolean }
  ): Promise<EnhancedValidationResult> => {
    setIsValidating(true);
    
    try {
      // Determinar si el tercer parámetro es enterpriseContext o opciones
      let enterpriseContext: EnterpriseSelectionResult | undefined;
      let options: { showToast?: boolean } = { showToast: showToasts };
      
      if (enterpriseContextOrOptions && 'salmonera_id' in enterpriseContextOrOptions) {
        enterpriseContext = enterpriseContextOrOptions;
      } else if (enterpriseContextOrOptions && 'showToast' in enterpriseContextOrOptions) {
        options = { ...options, ...enterpriseContextOrOptions };
      }

      const result = await contextualValidator.validateBeforeSubmit(
        formType,
        formData,
        enterpriseContext
      );
      
      setLastValidationResult(result);
      
      if (!result.isValid && strictMode) {
        throw new Error(`Validación falló: ${result.errors.join(', ')}`);
      }
      
      return {
        success: true,
        result: {
          isValid: result.isValid,
          canProceed: result.canProceed || result.isValid,
          errors: result.errors,
          warnings: result.warnings,
          context: result.contextData // Include context from the validation result
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de validación';
      
      if (showToasts) {
        toast({
          title: "Error de Validación",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      return {
        success: false,
        result: {
          isValid: false,
          canProceed: false,
          errors: [errorMessage],
          warnings: [],
          context: undefined // Provide context even in error case
        }
      };
    } finally {
      setIsValidating(false);
    }
  }, [contextualValidator, strictMode, showToasts]);

  const validateOperationCode = useCallback((code: string): boolean => {
    const codePattern = /^[A-Z]{2,3}-\d{4}-\d{3,4}$/;
    return codePattern.test(code);
  }, []);

  const validateRUT = useCallback((rut: string): boolean => {
    const rutPattern = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
    return rutPattern.test(rut);
  }, []);

  const validateEmail = useCallback((email: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }, []);

  const validateRequired = useCallback((value: any): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  }, []);

  const validateNumericRange = useCallback((
    value: number,
    min?: number,
    max?: number
  ): boolean => {
    if (isNaN(value)) return false;
    if (min !== undefined && value < min) return false;
    if (max !== undefined && value > max) return false;
    return true;
  }, []);

  const validateDate = useCallback((dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }, []);

  const validateTime = useCallback((timeString: string): boolean => {
    const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timePattern.test(timeString);
  }, []);

  return {
    // Validación contextual principal
    validateWithErrorHandling,
    contextualValidator,
    
    // Validadores específicos
    validateOperationCode,
    validateRUT,
    validateEmail,
    validateRequired,
    validateNumericRange,
    validateDate,
    validateTime,
    
    // Estado
    isValidating,
    lastValidationResult,
    
    // Utilidades
    clearLastResult: () => setLastValidationResult(null)
  };
};
