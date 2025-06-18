
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useOperaciones } from '@/hooks/useOperaciones';
import { useEquiposBuceoEnhanced } from '@/hooks/useEquiposBuceoEnhanced';
import { toast } from '@/hooks/use-toast';

import { ProgressBar } from './wizard-steps/ProgressBar';
import { StepInfo } from './wizard-steps/StepInfo';
import { StepPersonal } from './wizard-steps/StepPersonal';
import { StepCondiciones } from './wizard-steps/StepCondiciones';
import { StepResumen } from './wizard-steps/StepResumen';

interface ValidationStatus {
  hptReady: boolean;
  anexoBravoReady: boolean;
  canExecute: boolean;
  message?: string;
}

export interface InmersionFormWizardProps {
  formData: any;
  handleInputChange: any;
  handleSubmit: any;
  handleBack: any;
  isLoading: any;
  isFormValid: any;
  selectedOperacionId: any;
  validationStatus?: ValidationStatus;
}

export const InmersionFormWizard: React.FC<InmersionFormWizardProps> = ({
  formData,
  handleInputChange,
  handleSubmit,
  handleBack,
  isLoading,
  isFormValid,
  selectedOperacionId,
  validationStatus
}) => {
  const [formStep, setFormStep] = useState(1);
  const { operaciones } = useOperaciones();
  const { equipos } = useEquiposBuceoEnhanced();

  const selectedOperation = operaciones.find(op => op.id === selectedOperacionId);
  const assignedTeam = selectedOperation?.equipo_buceo_id 
    ? equipos.find(eq => eq.id === selectedOperation.equipo_buceo_id)
    : null;
  
  const isFieldDisabled = (fieldName: string) => {
    if (!assignedTeam) return false;
    const autoPopulatedFields = ['supervisor', 'buzo_principal', 'buzo_asistente', 'objetivo', 'codigo'];
    return autoPopulatedFields.includes(fieldName);
  };

  const validateStep = () => {
    if (formStep === 1) {
      if (!formData.codigo || !formData.fecha_inmersion || !formData.hora_inicio || !formData.objetivo) {
        toast({ title: "Campos requeridos", description: "Por favor, complete toda la información básica.", variant: "destructive" });
        return false;
      }
    }
    if (formStep === 2) {
      if (!formData.supervisor || !formData.buzo_principal) {
        toast({ title: "Campos requeridos", description: "Debe especificar el supervisor y el buzo principal.", variant: "destructive" });
        return false;
      }
    }
    return true;
  }

  const nextStep = () => {
    if (validateStep()) {
      setFormStep(prev => prev + 1);
    }
  };
  const prevStep = () => setFormStep(prev => prev - 1);
  
  return (
    <div className="space-y-6">
      <ProgressBar currentStep={formStep} />
      
      <div className="flex justify-center">
        {formStep === 1 && <StepInfo formData={formData} handleInputChange={handleInputChange} isFieldDisabled={isFieldDisabled} />}
        {formStep === 2 && <StepPersonal formData={formData} handleInputChange={handleInputChange} isFieldDisabled={isFieldDisabled} />}
        {formStep === 3 && <StepCondiciones formData={formData} handleInputChange={handleInputChange} />}
        {formStep === 4 && <StepResumen formData={formData} selectedOperation={selectedOperation} />}
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
          {formStep < 4 && <Button onClick={nextStep}>Siguiente</Button>}
          {formStep === 4 && (
            <Button onClick={handleSubmit} disabled={!isFormValid() || isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? "Creando..." : "Crear Inmersión"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
