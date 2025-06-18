
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useOperationWizardState } from '@/hooks/useOperationWizardState';
import { WizardHeader } from './wizard/WizardHeader';
import { WizardProgress } from './wizard/WizardProgress';
import { WizardStepsNavigation } from './wizard/WizardStepsNavigation';
import { WizardStepContent } from './wizard/WizardStepContent';
import { WizardNavigation } from './wizard/WizardNavigation';
import { toast } from '@/hooks/use-toast';

interface OperationFlowWizardProps {
  operacionId?: string;
  onComplete: () => void;
  onCancel: () => void;
  onStepChange?: (stepId: string) => void;
}

export const OperationFlowWizard = ({ 
  operacionId, 
  onComplete, 
  onCancel,
  onStepChange 
}: OperationFlowWizardProps) => {
  const {
    steps,
    currentStep,
    currentStepIndex,
    progress,
    canFinish,
    operacion,
    operacionId: wizardOperacionId,
    isLoading,
    isAutoSaving,
    lastSaveTime,
    goToStep,
    nextStep,
    previousStep,
    completeStep
  } = useOperationWizardState(operacionId);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (onStepChange && currentStep) {
      onStepChange(currentStep.id);
    }
  }, [currentStep, onStepChange]);

  const handleStepComplete = async (stepId: string, data: any) => {
    try {
      setErrors(prev => ({ ...prev, [stepId]: '' }));
      
      // Validar datos según el paso
      const validation = validateStepData(stepId, data);
      if (!validation.isValid) {
        setErrors(prev => ({ ...prev, [stepId]: validation.error }));
        toast({
          title: "Error de validación",
          description: validation.error,
          variant: "destructive"
        });
        return;
      }

      await completeStep(stepId, data);
      
      toast({
        title: "Paso completado",
        description: `${currentStep?.title} completado exitosamente.`
      });
    } catch (error) {
      console.error('Error completing step:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setErrors(prev => ({ ...prev, [stepId]: errorMessage }));
      toast({
        title: "Error",
        description: `No se pudo completar el paso: ${errorMessage}`,
        variant: "destructive"
      });
    }
  };

  const validateStepData = (stepId: string, data: any) => {
    switch (stepId) {
      case 'operacion':
        if (!data.operacionId) {
          return { isValid: false, error: 'No se pudo crear la operación. Verifique todos los campos requeridos.' };
        }
        break;
      case 'sitio':
        if (!data.sitio_id) {
          return { isValid: false, error: 'Debe seleccionar un sitio de trabajo válido.' };
        }
        break;
      case 'equipo':
        if (!data.equipo_buceo_id || !data.supervisor_asignado_id) {
          return { isValid: false, error: 'Debe asignar tanto el equipo de buceo como el supervisor.' };
        }
        break;
    }
    return { isValid: true, error: '' };
  };

  const handleFinish = async () => {
    if (!canFinish) {
      toast({
        title: "Operación incompleta",
        description: "Complete todos los pasos requeridos antes de finalizar.",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "¡Operación completada!",
        description: "La operación está lista para ejecutarse."
      });
      onComplete();
    } catch (error) {
      console.error('Error finishing wizard:', error);
      toast({
        title: "Error",
        description: "No se pudo finalizar la operación.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando asistente de operación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WizardHeader 
        operacion={operacion}
        isAutoSaving={isAutoSaving}
        lastSaveTime={lastSaveTime}
      />

      <WizardProgress progress={progress} />

      <WizardStepsNavigation 
        steps={steps}
        currentStepIndex={currentStepIndex}
        onGoToStep={goToStep}
      />

      {errors[currentStep?.id || ''] && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">
            {errors[currentStep?.id || '']}
          </AlertDescription>
        </Alert>
      )}

      <WizardStepContent 
        currentStep={currentStep}
        wizardOperacionId={wizardOperacionId}
        operacion={operacion}
        onStepComplete={handleStepComplete}
        onCancel={onCancel}
        onFinish={handleFinish}
      />

      <WizardNavigation 
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        canFinish={canFinish}
        currentStep={currentStep}
        isValidationStep={currentStep?.id === 'validation'}
        onCancel={onCancel}
        onPrevious={previousStep}
        onNext={nextStep}
        onFinish={handleFinish}
      />
    </div>
  );
};
