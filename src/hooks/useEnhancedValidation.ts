import { useModularSystem } from './useModularSystem';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ValidationOptions {
  showToast?: boolean;
  silent?: boolean;
}

interface ValidationResult {
  isValid: boolean;
  canProceed: boolean;
  warnings: string[];
  errors: string[];
  context: {
    moduleAccess: {
      planning: boolean;
      maintenance: boolean;
      reporting: boolean;
      integrations: boolean;
    };
    requiresDocuments: boolean;
    allowDirectCreation: boolean;
  };
  requiredModule?: string;
}

interface ValidationResponse {
  success: boolean;
  result?: ValidationResult;
  message?: string;
}

export const useEnhancedValidation = () => {
  const { hasModuleAccess, modules, getUserContext } = useModularSystem();
  const { profile } = useAuth();

  const validateWithErrorHandling = async (
    operationType: string,
    data?: any,
    options: ValidationOptions = {}
  ): Promise<ValidationResponse> => {
    const { showToast = true, silent = false } = options;
    
    try {
      const userContext = getUserContext();
      const warnings: string[] = [];
      const errors: string[] = [];

      const context = {
        moduleAccess: {
          planning: hasModuleAccess(modules.PLANNING_OPERATIONS),
          maintenance: hasModuleAccess(modules.MAINTENANCE_NETWORKS),
          reporting: hasModuleAccess(modules.ADVANCED_REPORTING),
          integrations: hasModuleAccess(modules.EXTERNAL_INTEGRATIONS),
        },
        requiresDocuments: hasModuleAccess(modules.PLANNING_OPERATIONS) && userContext.isSalmonera,
        allowDirectCreation: true, // Core siempre disponible
      };

      switch (operationType) {
        case 'create_independent_immersion':
          // Validación para inmersiones independientes
          if (!data?.operacion_descripcion) {
            errors.push('Debe especificar el código o descripción de la operación');
          }
          
          if (data?.operacion_descripcion && data.operacion_descripcion.length < 3) {
            errors.push('El código de operación debe tener al menos 3 caracteres');
          }

          // Si es contratista y la salmonera tiene planning, sugerir asociación
          if (userContext.isContratista && context.moduleAccess.planning) {
            warnings.push('Tu salmonera tiene el módulo de planificación activo. Considera asociar esta inmersión a una operación planificada.');
          }

          break;

        case 'create_planned_immersion':
          if (!context.moduleAccess.planning) {
            errors.push('Requiere módulo de planificación de operaciones activo');
            return {
              success: false,
              message: 'Módulo de planificación no disponible'
            };
          }

          if (!data?.operacion_id) {
            errors.push('Inmersión planificada requiere operación asociada');
          }

          break;

        case 'create_operation':
          if (!userContext.canCreateOperations) {
            errors.push('Solo las salmoneras pueden crear operaciones');
            return {
              success: false,
              message: 'Sin permisos para crear operaciones'
            };
          }

          if (!context.moduleAccess.planning) {
            errors.push('Requiere módulo de planificación de operaciones activo');
            return {
              success: false,
              message: 'Módulo de planificación no disponible'
            };
          }

          break;

        case 'access_maintenance_forms':
          if (!context.moduleAccess.maintenance) {
            errors.push('Requiere módulo de mantención de redes activo');
            return {
              success: false,
              message: 'Módulo de mantención no disponible'
            };
          }

          break;

        default:
          warnings.push(`Tipo de operación '${operationType}' no reconocido`);
      }

      const result: ValidationResult = {
        isValid: errors.length === 0,
        canProceed: errors.length === 0,
        warnings,
        errors,
        context,
        requiredModule: errors.length > 0 ? getRequiredModule(operationType) : undefined,
      };

      // Mostrar toasts si está habilitado
      if (showToast && !silent) {
        if (errors.length > 0) {
          toast({
            title: "Validación Fallida",
            description: errors[0],
            variant: "destructive",
          });
        } else if (warnings.length > 0) {
          toast({
            title: "Advertencia",
            description: warnings[0],
            variant: "default",
          });
        }
      }

      return {
        success: errors.length === 0,
        result,
        message: errors.length > 0 ? errors[0] : warnings.length > 0 ? warnings[0] : 'Validación exitosa'
      };

    } catch (error) {
      console.error('Error in validation:', error);
      
      if (showToast && !silent) {
        toast({
          title: "Error de Validación",
          description: "Ocurrió un error durante la validación",
          variant: "destructive",
        });
      }

      return {
        success: false,
        message: 'Error interno de validación'
      };
    }
  };

  const getRequiredModule = (operationType: string): string | undefined => {
    const moduleMap: Record<string, string> = {
      'create_planned_immersion': modules.PLANNING_OPERATIONS,
      'create_operation': modules.PLANNING_OPERATIONS,
      'access_maintenance_forms': modules.MAINTENANCE_NETWORKS,
      'access_advanced_reports': modules.ADVANCED_REPORTING,
      'use_integrations': modules.EXTERNAL_INTEGRATIONS,
    };

    return moduleMap[operationType];
  };

  // Validación específica para códigos de operación
  const validateOperationCode = async (code: string): Promise<{ isValid: boolean; suggestions?: string[] }> => {
    if (!code || code.length < 3) {
      return { isValid: false };
    }

    try {
      // Buscar operaciones similares para sugerencias
      const { data: similarOperations } = await supabase
        .from('operacion')
        .select('codigo, nombre')
        .ilike('codigo', `%${code}%`)
        .limit(5);

      return {
        isValid: true,
        suggestions: similarOperations?.map(op => `${op.codigo} - ${op.nombre}`) || []
      };
    } catch (error) {
      console.error('Error validating operation code:', error);
      return { isValid: true };
    }
  };

  return {
    validateWithErrorHandling,
    validateOperationCode,
  };
};
