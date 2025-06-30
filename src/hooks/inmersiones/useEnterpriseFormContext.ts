
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEnterpriseModuleAccess } from '@/hooks/useEnterpriseModuleAccess';
import type { FormValidationState } from '@/types/inmersionForms';

export const useEnterpriseFormContext = (initialData?: any) => {
  const { profile } = useAuth();
  const { getModulesForCompany } = useEnterpriseModuleAccess();
  
  // Auto-detectar el contexto empresarial según el rol del usuario
  const selectedEnterprise = useMemo(() => {
    if (!profile) return null;
    
    if (profile.role === 'superuser') {
      return null; // Superuser necesita seleccionar empresa manualmente
    }
    
    if (profile.salmonera_id) {
      return {
        salmonera_id: profile.salmonera_id,
        context_metadata: {
          selection_mode: 'salmonera_admin',
          empresa_origen_tipo: 'salmonera'
        }
      };
    }
    
    if (profile.servicio_id) {
      return {
        contratista_id: profile.servicio_id,
        context_metadata: {
          selection_mode: 'contratista_admin',
          empresa_origen_tipo: 'contratista'
        }
      };
    }
    
    return null;
  }, [profile]);
  
  const [formValidationState, setFormValidationState] = useState<FormValidationState>({
    hasPlanning: false,
    canShowPlanningToggle: false,
    isPlanned: false,
    enterpriseModules: null
  });

  const loadEnterpriseModules = useCallback(async (companyId: string, companyType: 'salmonera' | 'contratista') => {
    try {
      const modules = await getModulesForCompany(companyId, companyType);
      const hasPlanning = Boolean(modules?.hasPlanning === true || String(modules?.hasPlanning) === 'true');
      
      setFormValidationState({
        hasPlanning,
        canShowPlanningToggle: hasPlanning,
        isPlanned: hasPlanning && Boolean(initialData?.operacion_id),
        enterpriseModules: modules
      });
    } catch (error) {
      console.error('Error loading enterprise modules:', error);
      setFormValidationState({
        hasPlanning: false,
        canShowPlanningToggle: false,
        isPlanned: false,
        enterpriseModules: null
      });
    }
  }, [getModulesForCompany, initialData]);

  // Auto-cargar datos cuando el contexto empresarial esté disponible
  useEffect(() => {
    if (selectedEnterprise) {
      const companyId = selectedEnterprise.salmonera_id || selectedEnterprise.contratista_id;
      const companyType = selectedEnterprise.salmonera_id ? 'salmonera' : 'contratista';
      
      loadEnterpriseModules(companyId, companyType);
    }
  }, [selectedEnterprise, loadEnterpriseModules]);

  return {
    formValidationState,
    setFormValidationState,
    selectedEnterprise,
    profile,
    loadEnterpriseModules
  };
};
