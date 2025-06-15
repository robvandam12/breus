
import React from 'react';

const STEPS = ["Información", "Personal", "Condiciones", "Revisar"];

export const ProgressBar = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="flex items-center mb-8 w-full max-w-2xl mx-auto">
      {STEPS.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                index < currentStep - 1 ? 'bg-green-500 text-white' : 
                index === currentStep - 1 ? 'bg-blue-600 text-white ring-4 ring-blue-200' : 
                'bg-gray-200 text-gray-500'
              }`}
            >
              {index < currentStep - 1 ? '✓' : index + 1}
            </div>
            <p className={`mt-2 text-xs text-center font-semibold ${index <= currentStep - 1 ? 'text-blue-600' : 'text-gray-500'}`}>
              {step}
            </p>
          </div>
          {index < STEPS.length - 1 && (
            <div className={`flex-1 h-1 transition-colors duration-300 ${index < currentStep - 1 ? 'bg-green-500' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
