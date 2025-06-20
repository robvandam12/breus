
import { useModules } from './useModules';
import { supabase } from '@/integrations/supabase/client';

export interface ValidationContext {
  hasModuloPlanificacion: boolean;
  hasModuloMantencion: boolean;
  hasModuloFaena: boolean;
  requiredValidations: ValidationRule[];
}

export interface ValidationRule {
  type: 'hpt' | 'anexo_bravo' | 'personal' | 'sitio' | 'basic_info';
  required: boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  canProceed: boolean;
  errors: string[];
  warnings: string[];
  context: ValidationContext;
}

export const useContextualValidation = () => {
  const { isModuleActive } = useModules();

  const getValidationContext = (): ValidationContext => {
    const hasModuloPlanificacion = isModuleActive('planificacion');
    const hasModuloMantencion = isModuleActive('mantencion_redes');
    const hasModuloFaena = isModuleActive('faena_redes');

    const requiredValidations: ValidationRule[] = [
      {
        type: 'basic_info',
        required: true,
        message: 'Información básica de la inmersión requerida'
      }
    ];

    // Solo requerir documentos si el módulo de planificación está activo
    if (hasModuloPlanificacion) {
      requiredValidations.push(
        {
          type: 'hpt',
          required: true,
          message: 'HPT firmado requerido para operaciones planificadas'
        },
        {
          type: 'anexo_bravo',
          required: true,
          message: 'Anexo Bravo firmado requerido para operaciones planificadas'
        }
      );
    }

    // Personal siempre requerido (core)
    requiredValidations.push({
      type: 'personal',
      required: true,
      message: 'Personal de buceo asignado requerido'
    });

    return {
      hasModuloPlanificacion,
      hasModuloMantencion,
      hasModuloFaena,
      requiredValidations
    };
  };

  const validateForImmersion = async (data: {
    operacion_id?: string;
    salmonera_id?: string;
    contratista_id?: string;
    sitio_id?: string;
    buzo_principal?: string;
    supervisor?: string;
  }): Promise<ValidationResult> => {
    const context = getValidationContext();
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Validación básica siempre requerida
      if (!data.buzo_principal) {
        errors.push('Buzo principal requerido');
      }
      if (!data.supervisor) {
        errors.push('Supervisor requerido');
      }

      // Si hay módulo de planificación, validar operación y documentos
      if (context.hasModuloPlanificacion && data.operacion_id) {
        console.log('Validating with planning module active...');
        
        // Verificar HPT
        const { data: hpt } = await supabase
          .from('hpt')
          .select('id, firmado, estado')
          .eq('operacion_id', data.operacion_id)
          .maybeSingle();

        if (!hpt) {
          errors.push('HPT no encontrado para la operación');
        } else if (!hpt.firmado || hpt.estado !== 'firmado') {
          errors.push('HPT debe estar firmado');
        }

        // Verificar Anexo Bravo
        const { data: anexo } = await supabase
          .from('anexo_bravo')
          .select('id, firmado, estado')
          .eq('operacion_id', data.operacion_id)
          .maybeSingle();

        if (!anexo) {
          errors.push('Anexo Bravo no encontrado para la operación');
        } else if (!anexo.firmado || anexo.estado !== 'firmado') {
          errors.push('Anexo Bravo debe estar firmado');
        }
      }

      // Si NO hay módulo de planificación, validar información mínima para inmersión independiente
      if (!context.hasModuloPlanificacion) {
        console.log('Validating without planning module...');
        
        if (!data.salmonera_id) {
          errors.push('Salmonera requerida para inmersión independiente');
        }
        if (!data.contratista_id) {
          warnings.push('Se recomienda especificar el contratista');
        }
        if (!data.sitio_id) {
          warnings.push('Se recomienda especificar el sitio de trabajo');
        }
      }

      const isValid = errors.length === 0;
      const canProceed = isValid; // En esta fase, si es válido puede proceder

      return {
        isValid,
        canProceed,
        errors,
        warnings,
        context
      };

    } catch (error) {
      console.error('Error in contextual validation:', error);
      return {
        isValid: false,
        canProceed: false,
        errors: ['Error al validar prerequisitos'],
        warnings,
        context
      };
    }
  };

  return {
    getValidationContext,
    validateForImmersion,
  };
};
