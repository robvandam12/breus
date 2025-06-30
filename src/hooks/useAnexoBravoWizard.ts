
import { useState, useCallback } from 'react';

interface AnexoBravoWizardData {
  // Step 1 - Basic Info
  codigo?: string;
  fecha?: string;
  empresa_nombre?: string;
  lugar_faena?: string;
  
  // Step 2 - Personnel
  supervisor?: string;
  jefe_centro?: string;
  actividad?: string;
  
  // Step 3 - Emergency
  equipo_emergencia?: string;
  procedimiento_emergencia?: string;
  
  // Step 4 - Risk Management
  riesgos_tarea?: string;
  medidas_preventivas?: string;
  
  // Step 5 - Final Details
  lista_verificacion?: string;
  observaciones?: string;
  
  // Additional fields
  operacion_id?: string;
  [key: string]: any;
}

export const useAnexoBravoWizard = (operacionId?: string) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<AnexoBravoWizardData>({
    operacion_id: operacionId
  });

  const updateData = useCallback((newData: Partial<AnexoBravoWizardData>) => {
    setData(prev => ({ ...prev, ...newData }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const isLastStep = currentStep === 5;

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        return !!(data.codigo && data.fecha);
      case 2:
        return !!(data.supervisor);
      case 3:
        return true; // Optional step
      case 4:
        return true; // Optional step
      case 5:
        return true; // Final step
      default:
        return false;
    }
  }, [currentStep, data]);

  return {
    currentStep,
    data,
    updateData,
    nextStep,
    prevStep,
    isLastStep,
    canProceed: canProceed()
  };
};
