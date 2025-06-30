
import { useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import type { InmersionFormData, FormValidationState } from '@/types/inmersionForms';

export const useInmersionFormValidation = () => {
  const validateForm = useCallback((
    formValidationState: FormValidationState, 
    formData: InmersionFormData
  ): boolean => {
    if (formValidationState.isPlanned && !formData.operacion_id) {
      toast({
        title: "Error", 
        description: "Debe seleccionar una operación para inmersiones planificadas",
        variant: "destructive",
      });
      return false;
    }

    if (!formValidationState.isPlanned && !formData.external_operation_code) {
      toast({
        title: "Error",
        description: "Debe ingresar un código de operación externa para inmersiones independientes", 
        variant: "destructive",
      });
      return false;
    }

    if (!formData.centro_id) {
      toast({
        title: "Error",
        description: "Debe seleccionar un centro para la inmersión",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.objetivo.trim()) {
      toast({
        title: "Error",
        description: "Debe especificar el objetivo de la inmersión",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.fecha_inmersion) {
      toast({
        title: "Error",
        description: "Debe seleccionar la fecha de inmersión",
        variant: "destructive",
      });
      return false;
    }

    if (!formValidationState.isPlanned && (!formData.profundidad_max || parseFloat(formData.profundidad_max) <= 0)) {
      toast({
        title: "Error",
        description: "Debe especificar una profundidad máxima válida para inmersiones independientes",
        variant: "destructive",
      });
      return false;
    }

    return true;
  }, []);

  const buildInmersionData = useCallback((
    formData: InmersionFormData,
    formValidationState: FormValidationState,
    selectedCuadrillaId: string | null,
    companyId: string,
    enterpriseContext: any,
    initialData?: any
  ) => {
    const currentMetadata = initialData?.metadata ? 
      (typeof initialData.metadata === 'string' ? JSON.parse(initialData.metadata) : initialData.metadata) : 
      {};

    const baseData = {
      ...formData,
      profundidad_max: formData.profundidad_max ? parseFloat(formData.profundidad_max) : (formValidationState.isPlanned ? null : 0),
      is_independent: !formValidationState.isPlanned,
      estado: initialData?.estado || 'planificada',
      company_id: companyId,
      requiere_validacion_previa: formValidationState.isPlanned,
      anexo_bravo_validado: Boolean(!formValidationState.isPlanned),
      hpt_validado: Boolean(!formValidationState.isPlanned),
      centro_id: formData.centro_id,
      codigo: formData.codigo,
      contexto_operativo: formValidationState.isPlanned ? 'planificada' : 'independiente',
      temperatura_agua: null,
      visibilidad: null,
      corriente: null,
      buzo_principal: null,
      supervisor: null,
      hora_inicio: null,
      metadata: {
        ...currentMetadata,
        cuadrilla_id: selectedCuadrillaId,
        enterprise_context: enterpriseContext
      }
    };

    if (formValidationState.isPlanned && formData.operacion_id) {
      return {
        ...baseData,
        operacion_id: formData.operacion_id,
        external_operation_code: null
      };
    }

    return {
      ...baseData,
      external_operation_code: formData.external_operation_code
    };
  }, []);

  return {
    validateForm,
    buildInmersionData
  };
};
