
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useEnterpriseModuleAccess } from './useEnterpriseModuleAccess';

export interface EnterpriseValidationResult {
  canCreateOperations: boolean;
  canAccessPlanning: boolean;
  canAccessMaintenance: boolean;
  canAccessReporting: boolean;
  hasActiveModules: boolean;
  validationMessage?: string;
  moduleStatus?: {
    planning: 'active' | 'inactive' | 'not_available';
    maintenance: 'active' | 'inactive' | 'not_available';
    reporting: 'active' | 'inactive' | 'not_available';
  };
}

export const useEnterpriseValidation = (companyId?: string, companyType?: 'salmonera' | 'contratista') => {
  const { profile } = useAuth();
  const { getModulesForCompany } = useEnterpriseModuleAccess();
  const [validation, setValidation] = useState<EnterpriseValidationResult>({
    canCreateOperations: false,
    canAccessPlanning: false,
    canAccessMaintenance: false,
    canAccessReporting: false,
    hasActiveModules: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    validateEnterpriseAccess();
  }, [companyId, companyType, profile]);

  const validateEnterpriseAccess = async () => {
    // Si es superuser, siempre validar la empresa específica
    if (profile?.role === 'superuser') {
      if (!companyId || !companyType) {
        setValidation({
          canCreateOperations: false,
          canAccessPlanning: false,
          canAccessMaintenance: false,
          canAccessReporting: false,
          hasActiveModules: false,
          validationMessage: 'Debe seleccionar una empresa válida para continuar'
        });
        return;
      }
    }

    // Para usuarios normales, usar su empresa asociada
    const targetCompanyId = companyId || profile?.salmonera_id || profile?.servicio_id;
    const targetCompanyType = companyType || (profile?.salmonera_id ? 'salmonera' : 'contratista');

    if (!targetCompanyId || !targetCompanyType) {
      setValidation({
        canCreateOperations: false,
        canAccessPlanning: false,
        canAccessMaintenance: false,
        canAccessReporting: false,
        hasActiveModules: false,
        validationMessage: 'No se pudo determinar la empresa asociada al usuario'
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Validating enterprise access for:', targetCompanyId, targetCompanyType);
      const modules = await getModulesForCompany(targetCompanyId, targetCompanyType);
      
      const hasAnyModule = modules.modules.length > 0;
      const hasPlanning = modules.hasPlanning;
      const hasMaintenance = modules.hasMaintenance;
      const hasReporting = modules.hasReporting;

      // Contar módulos activos (excluyendo core)
      const activeNonCoreModules = modules.modules.filter(m => 
        m.is_active && m.module_name !== 'core_immersions'
      ).length;

      // Determinar estado específico de cada módulo
      const moduleStatus = {
        planning: hasPlanning ? 'active' : 'inactive',
        maintenance: hasMaintenance ? 'active' : 'inactive', 
        reporting: hasReporting ? 'active' : 'inactive'
      } as const;

      let validationMessage: string | undefined;
      
      // CRÍTICO: Solo empresas con planning_operations pueden crear operaciones
      if (!hasPlanning) {
        validationMessage = `Esta empresa no tiene el módulo Planning activo. Solo puede realizar inmersiones independientes.`;
      }

      const result: EnterpriseValidationResult = {
        canCreateOperations: hasPlanning, // Solo si tiene módulo de planning activo
        canAccessPlanning: hasPlanning,
        canAccessMaintenance: hasMaintenance,
        canAccessReporting: hasReporting,
        hasActiveModules: hasAnyModule,
        validationMessage,
        moduleStatus
      };

      console.log('Enterprise validation result:', {
        ...result,
        activeModules: modules.modules.filter(m => m.is_active).map(m => m.module_name),
        totalActiveNonCore: activeNonCoreModules,
        companyId: targetCompanyId,
        companyType: targetCompanyType
      });
      
      setValidation(result);
      
    } catch (error) {
      console.error('Error validating enterprise access:', error);
      setValidation({
        canCreateOperations: false,
        canAccessPlanning: false,
        canAccessMaintenance: false,
        canAccessReporting: false,
        hasActiveModules: false,
        validationMessage: 'Error al verificar los permisos de la empresa. Inténtelo nuevamente.',
        moduleStatus: {
          planning: 'not_available',
          maintenance: 'not_available',
          reporting: 'not_available'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const validateOperation = (operationType: string): { isValid: boolean; message?: string } => {
    console.log('Validating operation type:', operationType, 'with validation:', validation);
    
    switch (operationType) {
      case 'planning':
      case 'create_operation':
        return {
          isValid: validation.canAccessPlanning,
          message: !validation.canAccessPlanning 
            ? 'El módulo de Planning no está activo para esta empresa. Solo puede crear inmersiones independientes.'
            : undefined
        };
        
      case 'maintenance':
      case 'multix':
        return {
          isValid: validation.canAccessMaintenance,
          message: !validation.canAccessMaintenance 
            ? 'El módulo de Mantenimiento de Redes no está activo para esta empresa.'
            : undefined
        };
        
      case 'reporting':
        return {
          isValid: validation.canAccessReporting,
          message: !validation.canAccessReporting 
            ? 'El módulo de Reportes Avanzados no está activo para esta empresa.'
            : undefined
        };
        
      default:
        return { isValid: true };
    }
  };

  const getModuleStatusMessage = (moduleName: string): string => {
    const status = validation.moduleStatus;
    if (!status) return 'Estado desconocido';
    
    switch (moduleName) {
      case 'planning':
        if (status.planning === 'active') return 'Módulo Planning: Activo ✅';
        if (status.planning === 'inactive') return 'Módulo Planning: Desactivado ❌';
        return 'Módulo Planning: No disponible';
        
      case 'maintenance':
        if (status.maintenance === 'active') return 'Módulo Mantenimiento: Activo ✅';
        if (status.maintenance === 'inactive') return 'Módulo Mantenimiento: Desactivado ❌';
        return 'Módulo Mantenimiento: No disponible';
        
      case 'reporting':
        if (status.reporting === 'active') return 'Módulo Reportes: Activo ✅';
        if (status.reporting === 'inactive') return 'Módulo Reportes: Desactivado ❌';
        return 'Módulo Reportes: No disponible';
        
      default:
        return 'Estado desconocido';
    }
  };

  return {
    validation,
    loading,
    validateOperation,
    getModuleStatusMessage,
    refresh: validateEnterpriseAccess
  };
};
