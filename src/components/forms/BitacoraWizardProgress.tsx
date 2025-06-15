
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle } from "lucide-react";

interface Step {
  title: string;
  completed?: boolean;
}

interface BitacoraWizardProgressProps {
  currentStep: number;
  totalSteps: number;
  steps?: Step[];
  showPercentage?: boolean;
  className?: string;
}

export const BitacoraWizardProgress: React.FC<BitacoraWizardProgressProps> = ({
  currentStep,
  totalSteps,
  steps,
  showPercentage = true,
  className = ''
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-zinc-700">
          Paso {currentStep} de {totalSteps}
        </h3>
        {showPercentage && (
          <span className="text-xs text-zinc-500">
            {Math.round(progress)}% completado
          </span>
        )}
      </div>

      <Progress value={progress} className="w-full h-2" />

      {steps && (
        <div className="flex justify-between items-center mt-4">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep || step.completed;
            
            return (
              <div key={index} className="flex flex-col items-center space-y-1">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                  isCompleted 
                    ? 'bg-green-100 border-green-500 text-green-700'
                    : isActive 
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-zinc-100 border-zinc-300 text-zinc-500'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </div>
                <span className={`text-xs text-center max-w-16 leading-tight ${
                  isActive ? 'text-blue-700 font-medium' : 'text-zinc-500'
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
