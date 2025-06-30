
import { useCallback, useEffect, useState } from 'react';
import { useInmersionFormData } from './useInmersionFormData';
import { useInmersionFormValidation } from './useInmersionFormValidation';
import { useEnterpriseFormContext } from './useEnterpriseFormContext';

export const useInmersionFormLogic = (initialData?: any) => {
  const [loading, setLoading] = useState(false);
  
  const {
    selectedCuadrillaId,
    setSelectedCuadrillaId,
    formData,
    setFormData,
    operaciones,
    centros,
    loadOperaciones,
    loadCentros
  } = useInmersionFormData(initialData);

  const { validateForm, buildInmersionData } = useInmersionFormValidation();

  const {
    formValidationState,
    setFormValidationState,
    selectedEnterprise,
    profile,
    loadEnterpriseModules
  } = useEnterpriseFormContext(initialData);

  // Cargar operaciones cuando sea necesario
  useEffect(() => {
    if (formValidationState.canShowPlanningToggle && formValidationState.isPlanned && selectedEnterprise) {
      const companyId = selectedEnterprise.salmonera_id || selectedEnterprise.contratista_id;
      const companyType = selectedEnterprise.salmonera_id ? 'salmonera' : 'contratista';
      loadOperaciones(companyId, companyType);
    }
  }, [formValidationState.canShowPlanningToggle, formValidationState.isPlanned, selectedEnterprise, loadOperaciones]);

  // Auto-cargar centros cuando el contexto empresarial esté disponible
  useEffect(() => {
    if (selectedEnterprise) {
      const companyId = selectedEnterprise.salmonera_id || selectedEnterprise.contratista_id;
      const companyType = selectedEnterprise.salmonera_id ? 'salmonera' : 'contratista';
      
      loadCentros(companyId, companyType);
    }
  }, [selectedEnterprise, loadCentros]);

  const handleValidateForm = useCallback(() => {
    return validateForm(formValidationState, formData);
  }, [validateForm, formValidationState, formData]);

  const handleBuildInmersionData = useCallback((companyId: string, enterpriseContext: any) => {
    return buildInmersionData(formData, formValidationState, selectedCuadrillaId, companyId, enterpriseContext, initialData);
  }, [buildInmersionData, formData, formValidationState, selectedCuadrillaId, initialData]);

  return {
    formValidationState,
    setFormValidationState,
    loading,
    setLoading,
    selectedCuadrillaId,
    setSelectedCuadrillaId,
    formData,
    setFormData,
    operaciones,
    centros,
    selectedEnterprise,
    validateForm: handleValidateForm,
    buildInmersionData: handleBuildInmersionData,
    profile
  };
};
