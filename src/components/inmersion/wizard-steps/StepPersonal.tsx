
import React from 'react';
import { StepPersonalEnhanced } from './StepPersonalEnhanced';

interface StepPersonalProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  isFieldDisabled: (field: string) => boolean;
}

export const StepPersonal = ({ formData, handleInputChange, isFieldDisabled }: StepPersonalProps) => {
  return (
    <StepPersonalEnhanced 
      formData={formData}
      handleInputChange={handleInputChange}
      isFieldDisabled={isFieldDisabled}
    />
  );
};
