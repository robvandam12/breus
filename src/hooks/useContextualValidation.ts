
import { useModuleAccess } from "./useModuleAccess";
import { supabase } from "@/integrations/supabase/client";

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
  context: ValidationContext;
  requiredModule?: string;
}

export const useContextualValidation = () => {
  const { isModuleActive, modules } = useModuleAccess();

  // Obtener contexto modular actualizado
  const getModularContext = (): ValidationContext => {
    const hasPlanningModule = isModuleActive(modules.PLANNING_OPERATIONS);
    const hasMaintenanceModule = isModuleActive(modules.MAINTENANCE_NETWORKS);
    const hasReportingModule = isModuleActive(modules.ADVANCED_REPORTING);
    const hasIntegrationsModule = isModuleActive(modules.EXTERNAL_INTEGRATIONS);

    return {
      requiresOperations: hasPlanningModule,
      requiresDocuments: hasPlanningModule,
      requiresTeam: hasPlanningModule,
      allowDirectCreation: true, // CORE: Siempre permitir creación directa
      moduleAccess: {
        planning: hasPlanningModule,
        maintenance: hasMaintenanceModule,
        reporting: hasReportingModule,
        integrations: hasIntegrationsModule,
      }
    };
  };

  // Validación mejorada por tipo de operación
  const validateOperationByType = (operationType: string, data?: any): ValidationResult => {
    const context = getModularContext();
    const warnings: string[] = [];
    const errors: string[] = [];

    switch (operationType) {
      case 'create_immersion':
        // CORE: Inmersiones siempre permitidas (funcionalidad base)
        return {
          isValid: true,
          canProceed: true,
          warnings: context.moduleAccess.planning 
            ? [] 
            : ['Módulo de planificación no activo - Solo inmersiones directas disponibles'],
          errors: [],
          context
        };

      case 'create_planned_immersion':
        // PLANNING: Solo con módulo activo
        if (!context.moduleAccess.planning) {
          return {
            isValid: false,
            canProceed: false,
            warnings: [],
            errors: ['Requiere módulo de planificación de operaciones activo'],
            context,
            requiredModule: 'planning_operations'
          };
        }
        
        // Validar que hay operación
        if (data?.operacion_id) {
          warnings.push('Inmersión planificada - Verificar documentos HPT y Anexo Bravo');
        } else {
          errors.push('Inmersión planificada requiere operación asociada');
        }
        
        return {
          isValid: errors.length === 0,
          canProceed: errors.length === 0,
          warnings,
          errors,
          context
        };

      case 'create_operation':
        // PLANNING: Solo con módulo activo
        if (!context.moduleAccess.planning) {
          return {
            isValid: false,
            canProceed: false,
            warnings: [],
            errors: ['Requiere módulo de planificación de operaciones activo'],
            context,
            requiredModule: 'planning_operations'
          };
        }
        
        return {
          isValid: true,
          canProceed: true,
          warnings: [],
          errors: [],
          context
        };

      case 'create_hpt':
      case 'create_anexo_bravo':
        // PLANNING: Documentos solo con módulo activo
        if (!context.moduleAccess.planning) {
          return {
            isValid: false,
            canProceed: false,
            warnings: [],
            errors: ['Requiere módulo de planificación de operaciones activo'],
            context,
            requiredModule: 'planning_operations'
          };
        }
        
        if (!data?.operacion_id) {
          errors.push('Documento requiere operación asociada');
        }
        
        return {
          isValid: errors.length === 0,
          canProceed: errors.length === 0,
          warnings,
          errors,
          context
        };

      case 'create_maintenance_form':
        // MAINTENANCE: Solo con módulo activo
        if (!context.moduleAccess.maintenance) {
          return {
            isValid: false,
            canProceed: false,
            warnings: [],
            errors: ['Requiere módulo de mantención de redes activo'],
            context,
            requiredModule: 'maintenance_networks'
          };
        }
        
        return {
          isValid: true,
          canProceed: true,
          warnings: [],
          errors: [],
          context
        };

      case 'create_bitacora':
        // CORE: Bitácoras siempre permitidas
        if (!data?.inmersion_id) {
          errors.push('Bitácora requiere inmersión asociada');
        }
        
        return {
          isValid: errors.length === 0,
          canProceed: true, // Siempre puede proceder (core)
          warnings,
          errors,
          context
        };

      case 'access_advanced_reports':
        // REPORTING: Solo con módulo activo
        if (!context.moduleAccess.reporting) {
          return {
            isValid: false,
            canProceed: false,
            warnings: [],
            errors: ['Requiere módulo de reportes avanzados activo'],
            context,
            requiredModule: 'advanced_reporting'
          };
        }
        
        return {
          isValid: true,
          canProceed: true,
          warnings: [],
          errors: [],
          context
        };

      case 'use_integrations':
        // INTEGRATIONS: Solo con módulo activo
        if (!context.moduleAccess.integrations) {
          return {
            isValid: false,
            canProceed: false,
            warnings: [],
            errors: ['Requiere módulo de integraciones externas activo'],
            context,
            requiredModule: 'external_integrations'
          };
        }
        
        return {
          isValid: true,
          canProceed: true,
          warnings: [],
          errors: [],
          context
        };

      default:
        return {
          isValid: true,
          canProceed: true,
          warnings: [`Tipo de operación '${operationType}' no reconocido - Usando validación por defecto`],
          errors: [],
          context
        };
    }
  };

  // Validar creación de inmersión según contexto modular (mantenido para compatibilidad)
  const validateInmersionCreation = async (data?: any): Promise<ValidationResult> => {
    if (data?.operacion_id) {
      // Si tiene operación, es planificada
      return validateOperationByType('create_planned_immersion', data);
    } else {
      // Sin operación, es directa (core)
      return validateOperationByType('create_immersion', data);
    }
  };

  // Validar creación de bitácora (mantenido para compatibilidad)
  const validateBitacoraCreation = async (inmersionId: string): Promise<ValidationResult> => {
    return validateOperationByType('create_bitacora', { inmersion_id: inmersionId });
  };

  // Validar acceso a módulo específico
  const validateModuleAccess = (moduleId: string): ValidationResult => {
    const context = getModularContext();
    const moduleMap: Record<string, boolean> = {
      'planning_operations': context.moduleAccess.planning,
      'maintenance_networks': context.moduleAccess.maintenance,
      'advanced_reporting': context.moduleAccess.reporting,
      'external_integrations': context.moduleAccess.integrations,
    };

    const hasAccess = moduleMap[moduleId] ?? false;

    return {
      isValid: hasAccess,
      canProceed: hasAccess,
      warnings: hasAccess ? [] : [`Módulo '${moduleId}' no está activo para esta empresa`],
      errors: hasAccess ? [] : [`Acceso denegado al módulo '${moduleId}'`],
      context,
      requiredModule: hasAccess ? undefined : moduleId
    };
  };

  return {
    validateOperationByType,
    validateInmersionCreation,
    validateBitacoraCreation,
    validateModuleAccess,
    getModularContext,
  };
};
