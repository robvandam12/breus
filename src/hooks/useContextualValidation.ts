
import { useModuleAccess } from "./useModuleAccess";
import { supabase } from "@/integrations/supabase/client";

interface ValidationContext {
  requiresOperations: boolean;
  requiresDocuments: boolean;
  requiresTeam: boolean;
  allowDirectCreation: boolean;
}

interface ValidationResult {
  isValid: boolean;
  canProceed: boolean;
  warnings: string[];
  errors: string[];
  context: ValidationContext;
}

export const useContextualValidation = () => {
  const { isModuleActive, modules } = useModuleAccess();

  // Validar creación de inmersión según contexto modular
  const validateInmersionCreation = async (data?: any): Promise<ValidationResult> => {
    const hasPlanningModule = isModuleActive(modules.PLANNING_OPERATIONS);
    const warnings: string[] = [];
    const errors: string[] = [];

    const context: ValidationContext = {
      requiresOperations: hasPlanningModule,
      requiresDocuments: hasPlanningModule,
      requiresTeam: hasPlanningModule,
      allowDirectCreation: !hasPlanningModule,
    };

    // Si tiene módulo de planificación, aplicar validaciones tradicionales
    if (hasPlanningModule && data?.operacion_id) {
      try {
        // Verificar operación existe
        const { data: operacion } = await supabase
          .from('operacion')
          .select('id, equipo_buceo_id')
          .eq('id', data.operacion_id)
          .single();

        if (!operacion) {
          errors.push('La operación seleccionada no existe');
        } else if (!operacion.equipo_buceo_id) {
          warnings.push('La operación no tiene equipo de buceo asignado');
        }

        // Verificar documentos si es requerido
        const [hptCheck, anexoCheck] = await Promise.all([
          supabase
            .from('hpt')
            .select('id, firmado')
            .eq('operacion_id', data.operacion_id)
            .eq('firmado', true)
            .single(),
          supabase
            .from('anexo_bravo')
            .select('id, firmado')
            .eq('operacion_id', data.operacion_id)
            .eq('firmado', true)
            .single()
        ]);

        if (!hptCheck.data) {
          warnings.push('No existe HPT firmado para esta operación');
        }
        if (!anexoCheck.data) {
          warnings.push('No existe Anexo Bravo firmado para esta operación');
        }

      } catch (error) {
        console.error('Error validating operation context:', error);
        warnings.push('Error al validar el contexto de la operación');
      }
    }

    // Si no tiene módulo de planificación, permitir creación directa
    if (!hasPlanningModule) {
      warnings.push('Módulo de planificación no activo - Creación directa de inmersión permitida');
    }

    const isValid = errors.length === 0;
    const canProceed = isValid; // Siempre puede proceder si no hay errores críticos

    return {
      isValid,
      canProceed,
      warnings,
      errors,
      context
    };
  };

  // Validar creación de bitácora
  const validateBitacoraCreation = async (inmersionId: string): Promise<ValidationResult> => {
    const warnings: string[] = [];
    const errors: string[] = [];

    try {
      // Verificar que la inmersión existe - usar columna correcta
      const { data: inmersion } = await supabase
        .from('inmersion')
        .select('inmersion_id, estado')
        .eq('inmersion_id', inmersionId)
        .single();

      if (!inmersion) {
        errors.push('La inmersión seleccionada no existe');
      } else if (inmersion.estado === 'planificada') {
        warnings.push('La inmersión aún no ha sido ejecutada');
      }

    } catch (error) {
      console.error('Error validating bitacora context:', error);
      errors.push('Error al validar el contexto de la inmersión');
    }

    const context: ValidationContext = {
      requiresOperations: false,
      requiresDocuments: false,
      requiresTeam: false,
      allowDirectCreation: true,
    };

    return {
      isValid: errors.length === 0,
      canProceed: errors.length === 0,
      warnings,
      errors,
      context
    };
  };

  return {
    validateInmersionCreation,
    validateBitacoraCreation,
  };
};
