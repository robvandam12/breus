
import { useState, useCallback } from 'react';
import { useEnterpriseContext, EnterpriseSelectionResult } from './useEnterpriseContext';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface ValidationContext {
  operationId?: string;
  inmersionId?: string;
  enterpriseContext?: EnterpriseSelectionResult;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  contextData?: any;
  canProceed?: boolean;
}

interface ContextualValidatorState {
  isValid: boolean;
  canProceed: boolean;
  moduleActive: boolean;
  warnings: string[];
  errors: string[];
  isValidating: boolean;
  isOperativaDirecta: boolean;
  validationState: 'pending' | 'valid' | 'invalid';
}

export const useContextualValidator = (operationId?: string) => {
  const { profile } = useAuth();
  const { actions } = useEnterpriseContext();
  const [validationHistory, setValidationHistory] = useState<ValidationResult[]>([]);
  const [state, setState] = useState<ContextualValidatorState>({
    isValid: false,
    canProceed: false,
    moduleActive: true, // Asumimos que está activo por defecto
    warnings: [],
    errors: [],
    isValidating: false,
    isOperativaDirecta: false,
    validationState: 'pending'
  });

  const validateEnterpriseConsistency = useCallback((
    enterpriseContext: EnterpriseSelectionResult,
    targetData: any
  ): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validar consistencia de salmonera
    if (targetData.salmonera_id && targetData.salmonera_id !== enterpriseContext.salmonera_id) {
      errors.push('La salmonera seleccionada no coincide con el contexto empresarial');
    }

    // Validar consistencia de contratista
    if (enterpriseContext.contratista_id && targetData.contratista_id) {
      if (targetData.contratista_id !== enterpriseContext.contratista_id) {
        errors.push('El contratista seleccionado no coincide con el contexto empresarial');
      }
    }

    // Validar permisos de rol
    switch (profile?.role) {
      case 'admin_salmonera':
        if (enterpriseContext.salmonera_id !== profile.salmonera_id) {
          errors.push('No tiene permisos para crear registros en esta salmonera');
        }
        break;
      
      case 'admin_servicio':
      case 'supervisor':
        if (enterpriseContext.contratista_id !== profile.servicio_id) {
          errors.push('No tiene permisos para crear registros en este contratista');
        }
        break;
      
      case 'buzo':
        if (targetData.type !== 'bitacora_buzo') {
          errors.push('Solo puede crear bitácoras personales');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      canProceed: errors.length === 0,
      errors,
      warnings,
      contextData: {
        enterpriseContext,
        userRole: profile?.role,
        validatedAt: new Date().toISOString()
      }
    };
  }, [profile]);

  const validateOperationAccess = useCallback((
    operationId: string,
    enterpriseContext: EnterpriseSelectionResult
  ): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!operationId) {
      errors.push('ID de operación requerido');
    }

    if (!enterpriseContext.salmonera_id) {
      errors.push('Contexto de salmonera requerido');
    }

    return {
      isValid: errors.length === 0,
      canProceed: errors.length === 0,
      errors,
      warnings,
      contextData: {
        operationId,
        enterpriseContext,
        validatedAt: new Date().toISOString()
      }
    };
  }, []);

  const validateFormData = useCallback((
    formType: string,
    formData: any,
    enterpriseContext?: EnterpriseSelectionResult
  ): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validaciones específicas por tipo de formulario
    switch (formType) {
      case 'operacion':
        if (!formData.codigo) errors.push('Código de operación requerido');
        if (!formData.nombre) errors.push('Nombre de operación requerido');
        if (!formData.fecha_inicio) errors.push('Fecha de inicio requerida');
        break;

      case 'cuadrilla':
        if (!formData.nombre) errors.push('Nombre de cuadrilla requerido');
        if (!enterpriseContext?.salmonera_id) errors.push('Salmonera requerida');
        break;

      case 'hpt':
      case 'create_hpt':
        if (!formData.codigo) errors.push('Código HPT requerido');
        if (!formData.operacion_id) errors.push('Operación asociada requerida');
        if (!formData.supervisor) errors.push('Supervisor requerido');
        break;

      case 'anexo_bravo':
      case 'create_anexo_bravo':
        if (!formData.codigo) errors.push('Código Anexo Bravo requerido');
        if (!formData.operacion_id) errors.push('Operación asociada requerida');
        if (!formData.supervisor) errors.push('Supervisor requerido');
        break;

      case 'bitacora_supervisor':
        if (!formData.codigo) errors.push('Código de bitácora requerido');
        if (!formData.inmersion_id) errors.push('Inmersión asociada requerida');
        if (!formData.supervisor) errors.push('Supervisor requerido');
        break;

      case 'bitacora_buzo':
        if (!formData.codigo) errors.push('Código de bitácora requerido');
        if (!formData.buzo) errors.push('Buzo requerido');
        if (!formData.trabajos_realizados) errors.push('Trabajos realizados requeridos');
        break;

      default:
        warnings.push(`Tipo de formulario '${formType}' no reconocido para validación específica`);
    }

    // Validar contexto empresarial si está presente
    if (enterpriseContext) {
      const contextValidation = validateEnterpriseConsistency(enterpriseContext, formData);
      errors.push(...contextValidation.errors);
      warnings.push(...contextValidation.warnings);
    }

    const result: ValidationResult = {
      isValid: errors.length === 0,
      canProceed: errors.length === 0,
      errors,
      warnings,
      contextData: {
        formType,
        enterpriseContext,
        userRole: profile?.role,
        validatedAt: new Date().toISOString()
      }
    };

    // Guardar en historial
    setValidationHistory(prev => [...prev.slice(-9), result]);

    // Actualizar estado
    setState(prev => ({
      ...prev,
      isValid: result.isValid,
      canProceed: result.canProceed || false,
      errors,
      warnings,
      validationState: result.isValid ? 'valid' : 'invalid'
    }));

    return result;
  }, [profile, validateEnterpriseConsistency]);

  const validateBeforeSubmit = useCallback((
    formType: string,
    formData: any,
    enterpriseContext?: EnterpriseSelectionResult
  ): Promise<ValidationResult> => {
    setState(prev => ({ ...prev, isValidating: true }));
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = validateFormData(formType, formData, enterpriseContext);
        setState(prev => ({ ...prev, isValidating: false }));
        resolve(result);
      }, 100);
    });
  }, [validateFormData]);

  const validateForInmersion = useCallback(async (operationId: string): Promise<ValidationResult> => {
    setState(prev => ({ ...prev, isValidating: true }));
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const result: ValidationResult = {
          isValid: !!operationId,
          canProceed: !!operationId,
          errors: operationId ? [] : ['ID de operación requerido'],
          warnings: [],
          contextData: { operationId }
        };
        
        setState(prev => ({ 
          ...prev, 
          isValidating: false,
          isValid: result.isValid,
          canProceed: result.canProceed || false,
          errors: result.errors,
          warnings: result.warnings
        }));
        
        resolve(result);
      }, 100);
    });
  }, []);

  return {
    // Propiedades del estado
    ...state,
    
    // Métodos de validación
    validateEnterpriseConsistency,
    validateOperationAccess,
    validateFormData,
    validateBeforeSubmit,
    validateForInmersion,
    validationHistory,
    clearValidationHistory: () => setValidationHistory([])
  };
};
