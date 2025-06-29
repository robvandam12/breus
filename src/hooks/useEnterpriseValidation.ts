
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
          validationMessage: 'Debe seleccionar una empresa válida'
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
        validationMessage: 'No se pudo determinar la empresa'
      });
      return;
    }

    setLoading(true);

    try {
      const modules = await getModulesForCompany(targetCompanyId, targetCompanyType);
      
      const hasAnyModule = modules.modules.length > 0;
      const hasPlanning = modules.hasPlanning;
      const hasMaintenance = modules.hasMaintenance;
      const hasReporting = modules.hasReporting;

      setValidation({
        canCreateOperations: hasPlanning, // Solo si tiene módulo de planning activo
        canAccessPlanning: hasPlanning,
        canAccessMaintenance: hasMaintenance,
        canAccessReporting: hasReporting,
        hasActiveModules: hasAnyModule,
        validationMessage: !hasAnyModule ? 'Esta empresa no tiene módulos activos' : undefined
      });
    } catch (error) {
      console.error('Error validating enterprise access:', error);
      setValidation({
        canCreateOperations: false,
        canAccessPlanning: false,
        canAccessMaintenance: false,
        canAccessReporting: false,
        hasActiveModules: false,
        validationMessage: 'Error al verificar los permisos de la empresa'
      });
    } finally {
      setLoading(false);
    }
  };

  const validateOperation = (operationType: string): { isValid: boolean; message?: string } => {
    switch (operationType) {
      case 'planning':
        return {
          isValid: validation.canAccessPlanning,
          message: !validation.canAccessPlanning ? 'Esta empresa no tiene el módulo de Planning activo' : undefined
        };
      case 'maintenance':
        return {
          isValid: validation.canAccessMaintenance,
          message: !validation.canAccessMaintenance ? 'Esta empresa no tiene el módulo de Mantenimiento activo' : undefined
        };
      case 'multix':
        return {
          isValid: validation.canAccessMaintenance,
          message: !validation.canAccessMaintenance ? 'MultiX requiere el módulo de Mantenimiento de Redes activo' : undefined
        };
      default:
        return { isValid: true };
    }
  };

  return {
    validation,
    loading,
    validateOperation,
    refresh: validateEnterpriseAccess
  };
};
