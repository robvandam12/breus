
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface WizardProgressProps {
  progress: number;
}

export const WizardProgress = ({ progress }: WizardProgressProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">Progreso del Asistente</span>
        <span className="font-bold text-blue-600">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-3" />
      <div className="text-xs text-gray-500 text-center">
        Complete todos los pasos para finalizar la operación
      </div>
    </div>
  );
};
