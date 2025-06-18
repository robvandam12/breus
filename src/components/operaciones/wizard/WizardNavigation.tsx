
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface WizardNavigationProps {
  currentStepIndex: number;
  totalSteps: number;
  canFinish: boolean;
  currentStep: any;
  isValidationStep: boolean;
  onCancel: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
}

export const WizardNavigation = ({
  currentStepIndex,
  totalSteps,
  canFinish,
  currentStep,
  isValidationStep,
  onCancel,
  onPrevious,
  onNext,
  onFinish
}: WizardNavigationProps) => {
  return (
    <div className="flex justify-between">
      <Button
        variant="outline"
        onClick={currentStepIndex === 0 ? onCancel : onPrevious}
        className="flex items-center gap-2"
      >
        {currentStepIndex === 0 ? 'Cancelar' : '← Anterior'}
      </Button>
      
      <div className="flex gap-2">
        {currentStepIndex < totalSteps - 1 && (
          <Button
            onClick={onNext}
            disabled={!currentStep?.canNavigate && currentStep?.status !== 'completed'}
            className="flex items-center gap-2"
          >
            Siguiente →
          </Button>
        )}
        
        {canFinish && isValidationStep && (
          <Button
            onClick={onFinish}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Finalizar Operación
          </Button>
        )}
      </div>
    </div>
  );
};
