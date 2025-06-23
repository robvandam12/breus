
import { useEffect, useState } from 'react';
import { useContextualOperations, type ContextualValidationResult } from './useContextualOperations';

export interface ValidationState {
  isValidating: boolean;
  result: ContextualValidationResult | null;
  lastValidated: string | null;
}

export const useContextualValidator = (operacionId?: string) => {
  const [validationState, setValidationState] = useState<ValidationState>({
    isValidating: false,
    result: null,
    lastValidated: null,
  });

  const { validateInmersionCreation, getOperacionContext } = useContextualOperations();

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
      const result = await getOperacionContext(opId);
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
          contexto: null,
          requiere_documentos: true,
          requiere_hpt: true,
          requiere_anexo_bravo: true,
          es_operativa_directa: false,
          es_legacy: true,
          warnings: [],
          errors: ['Error al validar operación']
        },
        lastValidated: opId,
      });
    }
  };

  const validateForInmersion = async (opId: string): Promise<ContextualValidationResult> => {
    setValidationState(prev => ({ ...prev, isValidating: true }));
    
    try {
      // Use getOperacionContext instead of validateInmersionCreation for contextual validation
      const result = await getOperacionContext(opId);
      setValidationState({
        isValidating: false,
        result,
        lastValidated: opId,
      });
      return result;
    } catch (error) {
      console.error('Error validating for immersion:', error);
      const errorResult: ContextualValidationResult = {
        isValid: false,
        contexto: null,
        requiere_documentos: true,
        requiere_hpt: true,
        requiere_anexo_bravo: true,
        es_operativa_directa: false,
        es_legacy: true,
        warnings: [],
        errors: ['Error al validar para inmersión']
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
    isOperativaDirecta: validationState.result?.es_operativa_directa ?? false,
    requiereDocumentos: validationState.result?.requiere_documentos ?? true,
    warnings: validationState.result?.warnings ?? [],
    errors: validationState.result?.errors ?? [],
    isValidating: validationState.isValidating,
  };
};
