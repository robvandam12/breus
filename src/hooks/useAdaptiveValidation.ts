
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useModuleAccess } from './useModuleAccess';
import { supabase } from '@/integrations/supabase/client';

interface ValidationContext {
  companyType: 'salmonera' | 'contratista' | null;
  companyId: string | null;
  activeModules: string[];
  requiresDocuments: boolean;
  allowsDirectOperations: boolean;
}

interface DocumentValidation {
  hptRequired: boolean;
  anexoBravoRequired: boolean;
  hptExists: boolean;
  anexoBravoExists: boolean;
  hptSigned: boolean;
  anexoBravoSigned: boolean;
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

export const useAdaptiveValidation = () => {
  const { profile } = useAuth();
  const { isModuleActive, modules } = useModuleAccess();
  const [validationContext, setValidationContext] = useState<ValidationContext>({
    companyType: null,
    companyId: null,
    activeModules: [],
    requiresDocuments: false,
    allowsDirectOperations: true,
  });

  // Establecer contexto de validación basado en el perfil del usuario
  useEffect(() => {
    if (profile) {
      const companyType = profile.salmonera_id ? 'salmonera' : 'contratista';
      const companyId = profile.salmonera_id || profile.servicio_id;
      
      // Determinar módulos activos para la empresa
      const activeModules = [
        'core_immersions', // Siempre activo
        ...(isModuleActive(modules.PLANNING_OPERATIONS) ? ['planning_operations'] : []),
        ...(isModuleActive(modules.MAINTENANCE_NETWORKS) ? ['maintenance_networks'] : []),
        ...(isModuleActive(modules.ADVANCED_REPORTING) ? ['advanced_reporting'] : []),
        ...(isModuleActive(modules.EXTERNAL_INTEGRATIONS) ? ['external_integrations'] : []),
      ];

      // Determinar si requiere documentos según el módulo de planificación
      const requiresDocuments = isModuleActive(modules.PLANNING_OPERATIONS);
      
      setValidationContext({
        companyType,
        companyId,
        activeModules,
        requiresDocuments,
        allowsDirectOperations: !requiresDocuments, // Si no requiere documentos, permite operaciones directas
      });
    }
  }, [profile, isModuleActive, modules]);

  // Validar documentos para una operación específica
  const validateOperationDocuments = async (operacionId: string): Promise<DocumentValidation> => {
    const warnings: string[] = [];
    const errors: string[] = [];

    // Si no requiere documentos, todo es válido
    if (!validationContext.requiresDocuments) {
      return {
        hptRequired: false,
        anexoBravoRequired: false,
        hptExists: false,
        anexoBravoExists: false,
        hptSigned: false,
        anexoBravoSigned: false,
        isValid: true,
        warnings: ['Validación de documentos no requerida - Módulo de planificación no activo'],
        errors: [],
      };
    }

    try {
      // Verificar HPT
      const { data: hptData } = await supabase
        .from('hpt')
        .select('id, firmado, estado')
        .eq('operacion_id', operacionId)
        .single();

      // Verificar Anexo Bravo
      const { data: anexoData } = await supabase
        .from('anexo_bravo')
        .select('id, firmado, estado')
        .eq('operacion_id', operacionId)
        .single();

      const hptExists = !!hptData;
      const anexoBravoExists = !!anexoData;
      const hptSigned = hptExists && hptData.firmado && hptData.estado === 'firmado';
      const anexoBravoSigned = anexoBravoExists && anexoData.firmado && anexoData.estado === 'firmado';

      // Generar advertencias y errores
      if (!hptExists) {
        errors.push('HPT no encontrado para esta operación');
      } else if (!hptSigned) {
        warnings.push('HPT existe pero no está firmado');
      }

      if (!anexoBravoExists) {
        errors.push('Anexo Bravo no encontrado para esta operación');
      } else if (!anexoBravoSigned) {
        warnings.push('Anexo Bravo existe pero no está firmado');
      }

      const isValid = hptSigned && anexoBravoSigned;

      return {
        hptRequired: true,
        anexoBravoRequired: true,
        hptExists,
        anexoBravoExists,
        hptSigned,
        anexoBravoSigned,
        isValid,
        warnings,
        errors,
      };

    } catch (error) {
      console.error('Error validating operation documents:', error);
      return {
        hptRequired: true,
        anexoBravoRequired: true,
        hptExists: false,
        anexoBravoExists: false,
        hptSigned: false,
        anexoBravoSigned: false,
        isValid: false,
        warnings: [],
        errors: ['Error al validar documentos de la operación'],
      };
    }
  };

  // Determinar si se puede crear una inmersión directamente
  const canCreateDirectImmersion = () => {
    return validationContext.allowsDirectOperations;
  };

  // Obtener configuración de validación para un tipo de formulario
  const getFormValidationConfig = (formType: 'hpt' | 'anexo_bravo' | 'inmersion' | 'bitacora') => {
    const baseConfig = {
      requiresApproval: validationContext.requiresDocuments,
      allowsDirectSubmission: validationContext.allowsDirectOperations,
      activeModules: validationContext.activeModules,
    };

    switch (formType) {
      case 'hpt':
      case 'anexo_bravo':
        return {
          ...baseConfig,
          isRequired: validationContext.requiresDocuments,
          canSkip: !validationContext.requiresDocuments,
        };
      
      case 'inmersion':
        return {
          ...baseConfig,
          requiresPriorDocuments: validationContext.requiresDocuments,
          allowsIndependent: validationContext.allowsDirectOperations,
        };
      
      case 'bitacora':
        return {
          ...baseConfig,
          alwaysAllowed: true, // Las bitácoras siempre se pueden crear
        };
      
      default:
        return baseConfig;
    }
  };

  return {
    validationContext,
    validateOperationDocuments,
    canCreateDirectImmersion,
    getFormValidationConfig,
    isModularSystem: validationContext.activeModules.length > 1,
    hasPlanning: validationContext.activeModules.includes('planning_operations'),
    hasNetworkMaintenance: validationContext.activeModules.includes('maintenance_networks'),
  };
};
