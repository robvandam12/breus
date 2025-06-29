
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useOperaciones } from '@/hooks/useOperaciones';
import { useEquiposBuceoEnhanced } from '@/hooks/useEquiposBuceoEnhanced';
import { useContextualValidator } from '@/hooks/useContextualValidator';
import { useEnhancedValidation } from '@/hooks/useEnhancedValidation';
import { toast } from '@/hooks/use-toast';

import { ProgressBar } from './wizard-steps/ProgressBar';
import { StepInfo } from './wizard-steps/StepInfo';
import { StepPersonal } from './wizard-steps/StepPersonal';
import { StepCondiciones } from './wizard-steps/StepCondiciones';
import { StepResumen } from './wizard-steps/StepResumen';

interface InmersionFormWizardProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  handleSubmit: () => void;
  handleBack: () => void;
  isLoading: boolean;
  isFormValid: () => boolean;
  selectedOperacionId?: string;
}

export const InmersionFormWizard: React.FC<InmersionFormWizardProps> = ({
  formData,
  handleInputChange,
  handleSubmit,
  handleBack,
  isLoading,
  isFormValid,
  selectedOperacionId,
}) => {
  const [formStep, setFormStep] = useState(1);
  const { operaciones } = useOperaciones();
  const { equipos } = useEquiposBuceoEnhanced();
  
  // Usar validación contextual para la operación seleccionada
  const { 
    isValid: operationIsValid, 
    canProceed: operationCanProceed,
    isOperativaDirecta,
    moduleActive,
    warnings,
    errors
  } = useContextualValidator(selectedOperacionId);

  const { validateWithErrorHandling } = useEnhancedValidation();

  const selectedOperation = operaciones.find(op => op.id === selectedOperacionId);
  
  // Determinar campos deshabilitados según contexto
  const isFieldDisabled = (fieldName: string) => {
    // CORE: En modo directo, todos los campos son editables
    // PLANNING: Los campos se auto-populan desde la selección de equipos en el wizard
    return false;
  };

  // Validación de paso con contexto
  const validateStep = async () => {
    console.log(`Validating step ${formStep} with contextual validation`);
    
    if (formStep === 1) {
      if (!formData.codigo || !formData.fecha_inmersion || !formData.hora_inicio || !formData.objetivo) {
        toast({ 
          title: "Campos requeridos", 
          description: "Por favor, complete toda la información básica.", 
          variant: "destructive" 
        });
        return false;
      }

      // Validar contexto de operación si está seleccionada
      if (selectedOperacionId) {
        const { success } = await validateWithErrorHandling(
          'create_planned_immersion',
          { operacion_id: selectedOperacionId },
          { showToast: true }
        );
        if (!success) return false;
      }
    }
    
    if (formStep === 2) {
      if (!formData.supervisor || !formData.buzo_principal) {
        toast({ 
          title: "Campos requeridos", 
          description: "Debe especificar el supervisor y el buzo principal.", 
          variant: "destructive" 
        });
        return false;
      }
    }
    
    return true;
  };

  const nextStep = async () => {
    if (await validateStep()) {
      setFormStep(prev => prev + 1);
    }
  };

  const prevStep = () => setFormStep(prev => prev - 1);

  // Validación final contextual antes de envío
  const handleContextualSubmit = async () => {
    console.log('Starting contextual submit validation');
    
    if (!isFormValid()) {
      toast({
        title: "Formulario incompleto",
        description: "Por favor, complete todos los campos requeridos.",
        variant: "destructive"
      });
      return;
    }

    // Validación específica según tipo de inmersión
    const operationType = selectedOperacionId ? 'create_planned_immersion' : 'create_immersion';
    const validationData = selectedOperacionId 
      ? { operacion_id: selectedOperacionId, ...formData }
      : formData;

    const { success } = await validateWithErrorHandling(
      operationType,
      validationData,
      { showToast: true }
    );

    if (success) {
      handleSubmit();
    }
  };
  
  return (
    <div className="space-y-6">
      <ProgressBar currentStep={formStep} />
      
      {/* Mostrar información contextual */}
      {selectedOperacionId && (
        <div className="bg-blue-50 p-3 rounded-lg mb-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">
              {isOperativaDirecta ? 'Inmersión Directa' : 'Inmersión Planificada'}
            </span>
            {!moduleActive && (
              <span className="text-orange-600">(Modo Core)</span>
            )}
          </div>
          {warnings.length > 0 && (
            <div className="mt-2">
              {warnings.map((warning, index) => (
                <p key={index} className="text-xs text-amber-600">• {warning}</p>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-center">
        {formStep === 1 && (
          <StepInfo 
            formData={formData} 
            handleInputChange={handleInputChange} 
            isFieldDisabled={isFieldDisabled} 
          />
        )}
        {formStep === 2 && (
          <StepPersonal 
            formData={formData} 
            handleInputChange={handleInputChange} 
            isFieldDisabled={isFieldDisabled} 
          />
        )}
        {formStep === 3 && (
          <StepCondiciones 
            formData={formData} 
            handleInputChange={handleInputChange} 
          />
        )}
        {formStep === 4 && (
          <StepResumen 
            formData={formData} 
            selectedOperation={selectedOperation}
          />
        )}
      </div>

      <div className="flex justify-between pt-6 border-t">
        <div>
          {formStep > 1 ? (
            <Button variant="outline" onClick={prevStep}>Anterior</Button>
          ) : (
            <Button variant="outline" onClick={handleBack}>Volver</Button>
          )}
        </div>
        <div className="flex gap-2">
          {formStep < 4 && (
            <Button onClick={nextStep}>Siguiente</Button>
          )}
          {formStep === 4 && (
            <Button 
              onClick={handleContextualSubmit} 
              disabled={isLoading || (selectedOperacionId && !operationCanProceed)} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Creando..." : "Crear Inmersión"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
