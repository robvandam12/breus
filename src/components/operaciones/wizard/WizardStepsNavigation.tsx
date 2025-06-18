
import React from 'react';
import { CheckCircle, Circle, AlertCircle, Clock } from 'lucide-react';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  required: boolean;
  canNavigate?: boolean;
}

interface WizardStepsNavigationProps {
  steps: WizardStep[];
  currentStepIndex: number;
  onGoToStep: (stepIndex: number) => void;
}

export const WizardStepsNavigation = ({ steps, currentStepIndex, onGoToStep }: WizardStepsNavigationProps) => {
  const getStepIcon = (step: WizardStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'active':
        return <Circle className="w-5 h-5 text-blue-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="grid grid-cols-6 gap-2">
      {steps.map((step, index) => (
        <button
          key={step.id}
          onClick={() => onGoToStep(index)}
          disabled={!step.canNavigate && step.status !== 'completed'}
          className={`p-3 rounded-lg text-xs font-medium transition-all duration-200 ${
            index === currentStepIndex
              ? 'bg-blue-100 text-blue-800 border-2 border-blue-300 shadow-md'
              : step.status === 'completed'
              ? 'bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer'
              : step.canNavigate
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            {getStepIcon(step)}
            <span className="text-xs font-bold">{index + 1}</span>
          </div>
          <div className="truncate text-center">{step.title}</div>
        </button>
      ))}
    </div>
  );
};
