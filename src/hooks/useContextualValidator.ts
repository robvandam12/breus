
import { useEffect, useState } from 'react';
import { useContextualValidation } from './useContextualValidation';
import { useEnhancedValidation } from './useEnhancedValidation';

export interface ValidationState {
  isValidating: boolean;
  result: ValidationResult | null;
  lastValidated: string | null;
}

interface ValidationResult {
  isValid: boolean;
  canProceed: boolean;
  warnings: string[];
  errors: string[];
  requiredModule?: string;
  context: {
    moduleActive: boolean;
    requiresDocuments: boolean;
    allowDirectCreation: boolean;
  };
  // Propiedades para compatibilidad con componentes existentes
  es_legacy?: boolean;
  isOperativaDirecta?: boolean;
}

export const useContextualValidator = (operacionId?: string) => {
  const [validationState, setValidationState] = useState<ValidationState>({
    isValidating: false,
    result: null,
    lastValidated: null,
  });

  const { validateOperationByType } = useContextualValidation();
  const { validateWithErrorHandling } = useEnhancedValidation();

  // Validar automáticamente cuando cambia la operación
  useEffect(() => {
    if (!operacionId) {
      setValidationState({
        isValidating: false,
        result: null,
        lastValidated: null,
      });
      return;
    }

    validateOperation(operacionId);
  }, [operacionId]);

  const validateOperation = async (opId: string) => {
    setValidationState(prev => ({ ...prev, isValidating: true }));
    
    try {
      // Usar el nuevo sistema de validación contextual
      const contextualResult = validateOperationByType('create_planned_immersion', { 
        operacion_id: opId 
      });
      
      const result: ValidationResult = {
        isValid: contextualResult.isValid,
        canProceed: contextualResult.canProceed,
        warnings: contextualResult.warnings,
        errors: contextualResult.errors,
        requiredModule: contextualResult.requiredModule,
        context: {
          moduleActive: contextualResult.context.moduleAccess.planning,
          requiresDocuments: contextualResult.context.requiresDocuments,
          allowDirectCreation: contextualResult.context.allowDirectCreation,
        },
        // Compatibilidad: determinar si es operativa directa
        isOperativaDirecta: contextualResult.context.allowDirectCreation && !contextualResult.context.requiresDocuments,
        es_legacy: false // No tenemos operaciones legacy en el nuevo sistema
      };

      setValidationState({
        isValidating: false,
        result,
        lastValidated: opId,
      });
    } catch (error) {
      console.error('Error validating operation:', error);
      setValidationState({
        isValidating: false,
        result: {
          isValid: false,
          canProceed: false,
          warnings: [],
          errors: ['Error al validar operación'],
          context: {
            moduleActive: false,
            requiresDocuments: true,
            allowDirectCreation: true, // CORE: Siempre permitir fallback
          },
          isOperativaDirecta: true, // Fallback seguro
          es_legacy: false
        },
        lastValidated: opId,
      });
    }
  };

  const validateForInmersion = async (opId: string): Promise<ValidationResult> => {
    setValidationState(prev => ({ ...prev, isValidating: true }));
    
    try {
      // Usar validateWithErrorHandling para manejo automático de errores
      const { success, result } = await validateWithErrorHandling(
        'create_planned_immersion',
        { operacion_id: opId },
        { showToast: false } // No mostrar toast aquí, manejado por el componente
      );

      const validationResult: ValidationResult = {
        isValid: success && result?.isValid,
        canProceed: success && result?.canProceed,
        warnings: result?.warnings || [],
        errors: result?.errors || [],
        requiredModule: result?.requiredModule,
        context: {
          moduleActive: result?.context?.moduleAccess?.planning || false,
          requiresDocuments: result?.context?.requiresDocuments || false,
          allowDirectCreation: result?.context?.allowDirectCreation || true,
        },
        // Compatibilidad
        isOperativaDirecta: (result?.context?.allowDirectCreation || true) && !(result?.context?.requiresDocuments || false),
        es_legacy: false
      };

      setValidationState({
        isValidating: false,
        result: validationResult,
        lastValidated: opId,
      });
      
      return validationResult;
    } catch (error) {
      console.error('Error validating for immersion:', error);
      const errorResult: ValidationResult = {
        isValid: false,
        canProceed: false,
        warnings: [],
        errors: ['Error al validar para inmersión'],
        context: {
          moduleActive: false,
          requiresDocuments: true,
          allowDirectCreation: true, // CORE: Fallback seguro
        },
        isOperativaDirecta: true, // Fallback seguro
        es_legacy: false
      };
      
      setValidationState({
        isValidating: false,
        result: errorResult,
        lastValidated: opId,
      });
      
      return errorResult;
    }
  };

  const refresh = () => {
    if (operacionId) {
      validateOperation(operacionId);
    }
  };

  return {
    validationState,
    validateForInmersion,
    refresh,
    // Helpers para acceso rápido
    isValid: validationState.result?.isValid ?? false,
    canProceed: validationState.result?.canProceed ?? false,
    requiereDocumentos: validationState.result?.context?.requiresDocuments ?? true,
    moduleActive: validationState.result?.context?.moduleActive ?? false,
    warnings: validationState.result?.warnings ?? [],
    errors: validationState.result?.errors ?? [],
    isValidating: validationState.isValidating,
    // Propiedades de compatibilidad
    isOperativaDirecta: validationState.result?.isOperativaDirecta ?? false,
  };
};
