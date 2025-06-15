
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save, X } from "lucide-react";

interface BitacoraFormActionsProps {
  type: 'wizard' | 'form' | 'simple';
  onCancel: () => void;
  onSubmit?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  
  // Estados
  isLoading?: boolean;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  
  // Textos personalizables
  cancelText?: string;
  submitText?: string;
  nextText?: string;
  previousText?: string;
  
  // Clases adicionales
  className?: string;
}

export const BitacoraFormActions: React.FC<BitacoraFormActionsProps> = ({
  type,
  onCancel,
  onSubmit,
  onNext,
  onPrevious,
  isLoading = false,
  canGoNext = true,
  canGoPrevious = true,
  isFirstStep = false,
  isLastStep = false,
  cancelText = 'Cancelar',
  submitText = 'Guardar',
  nextText = 'Siguiente',
  previousText = 'Anterior',
  className = ''
}) => {
  if (type === 'simple') {
    return (
      <div className={`flex gap-3 ${className}`}>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          {cancelText}
        </Button>
        <Button 
          type="button" 
          onClick={onSubmit}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {isLoading ? 'Guardando...' : submitText}
        </Button>
      </div>
    );
  }

  if (type === 'wizard') {
    return (
      <div className={`flex justify-between ${className}`}>
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstStep || !canGoPrevious}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {previousText}
        </Button>

        <Button type="button" variant="outline" onClick={onCancel}>
          {cancelText}
        </Button>

        {isLastStep ? (
          <Button 
            type="button" 
            onClick={onSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isLoading ? 'Completando...' : 'Completar'}
          </Button>
        ) : (
          <Button 
            type="button" 
            onClick={onNext}
            disabled={!canGoNext}
          >
            {nextText}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    );
  }

  // type === 'form'
  return (
    <div className={`flex gap-3 ${className}`}>
      <Button type="button" variant="outline" onClick={onCancel}>
        {cancelText}
      </Button>
      <Button 
        type="button" 
        onClick={onSubmit}
        disabled={isLoading}
        className="flex-1"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
        ) : (
          <Save className="w-4 h-4 mr-2" />
        )}
        {isLoading ? 'Guardando...' : submitText}
      </Button>
    </div>
  );
};
