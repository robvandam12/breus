
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Save, FileCheck } from 'lucide-react';
import { MultiXStep1 } from './steps/MultiXStep1';
import { MultiXStep2 } from './steps/MultiXStep2';
import { MultiXStep3 } from './steps/MultiXStep3';
import { MultiXStep4Mantencion } from './steps/MultiXStep4Mantencion';
import { MultiXStep4Iconografia } from './steps/MultiXStep4Iconografia';
import { MultiXStep5Sistemas } from './steps/MultiXStep5Sistemas';
import { useMultiX } from '@/hooks/useMultiX';
import { MultiXData } from '@/types/multix';
import { toast } from '@/hooks/use-toast';

interface MultiXWizardProps {
  operacionId?: string;
  tipo: 'mantencion' | 'faena';
  multiXId?: string;
  onComplete?: () => void;
  onCancel?: () => void;
}

export const MultiXWizard: React.FC<MultiXWizardProps> = ({
  operacionId,
  tipo,
  multiXId,
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { data, updateField, saveMultiX, isLoading, errors } = useMultiX(operacionId, tipo, multiXId);

  // Determinar los pasos según el tipo
  const getStepsForType = () => {
    const baseSteps = [
      { number: 1, title: 'Información General', component: 'step1' },
      { number: 2, title: 'Dotación', component: 'step2' },
      { number: 3, title: 'Equipos de Superficie', component: 'step3' }
    ];

    if (tipo === 'mantencion') {
      return [
        ...baseSteps,
        { number: 4, title: 'Faenas de Mantención', component: 'step4-mantencion' },
        { number: 5, title: 'Sistemas y Equipos', component: 'step5' }
      ];
    } else {
      return [
        ...baseSteps,
        { number: 4, title: 'Iconografía y Simbología', component: 'step4-iconografia' },
        { number: 5, title: 'Sistemas y Equipos', component: 'step5' }
      ];
    }
  };

  const steps = getStepsForType();
  const totalSteps = steps.length;

  const validateCurrentStep = (): boolean => {
    // Validaciones básicas por paso
    switch (currentStep) {
      case 1:
        return !!(data.lugar_trabajo && data.fecha && data.hora_inicio && data.hora_termino);
      case 2:
        return data.dotacion && data.dotacion.length > 0;
      case 3:
        return true; // Equipos de superficie es opcional
      case 4:
        if (tipo === 'mantencion') {
          return data.faenas_mantencion && data.faenas_mantencion.length > 0;
        } else {
          return data.iconografia_simbologia && data.iconografia_simbologia.length > 0;
        }
      case 5:
        return data.sistemas_equipos && data.sistemas_equipos.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast({
        title: "Campos requeridos",
        description: "Por favor, completa los campos obligatorios antes de continuar",
        variant: "destructive"
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    try {
      await saveMultiX();
      toast({
        title: "Guardado exitoso",
        description: "Los cambios han sido guardados correctamente"
      });
    } catch (error) {
      toast({
        title: "Error al guardar",
        description: "No se pudieron guardar los cambios",
        variant: "destructive"
      });
    }
  };

  const handleComplete = async () => {
    if (validateCurrentStep()) {
      try {
        await saveMultiX();
        toast({
          title: "Formulario completado",
          description: "El formulario MultiX ha sido completado exitosamente"
        });
        onComplete?.();
      } catch (error) {
        toast({
          title: "Error al completar",
          description: "No se pudo completar el formulario",
          variant: "destructive"
        });
      }
    }
  };

  const renderCurrentStep = () => {
    const stepComponent = steps[currentStep - 1]?.component;
    
    switch (stepComponent) {
      case 'step1':
        return <MultiXStep1 data={data} onUpdate={updateField} tipo={tipo} />;
      case 'step2':
        return <MultiXStep2 data={data} onUpdate={updateField} />;
      case 'step3':
        return <MultiXStep3 data={data} onUpdate={updateField} />;
      case 'step4-mantencion':
        return <MultiXStep4Mantencion data={data} onUpdate={updateField} />;
      case 'step4-iconografia':
        return <MultiXStep4Iconografia data={data} onUpdate={updateField} />;
      case 'step5':
        return <MultiXStep5Sistemas data={data} onUpdate={updateField} />;
      default:
        return <div>Paso no encontrado</div>;
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5" />
                Formulario MultiX - {tipo === 'mantencion' ? 'Mantención' : 'Faena'}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Paso {currentStep} de {totalSteps}: {steps[currentStep - 1]?.title}
              </p>
            </div>
            <Badge variant={data.estado === 'firmado' ? 'default' : 'secondary'}>
              {data.estado === 'firmado' ? 'Firmado' : 'Borrador'}
            </Badge>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Steps Navigation */}
      <div className="flex justify-center">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {steps.map((step) => (
            <button
              key={step.number}
              onClick={() => setCurrentStep(step.number)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentStep === step.number
                  ? 'bg-primary text-primary-foreground'
                  : currentStep > step.number
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {step.number}. {step.title}
            </button>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <Card>
        <CardContent className="p-6">
          {renderCurrentStep()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Guardar
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <FileCheck className="w-4 h-4" />
                  Completar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Button */}
      {onCancel && (
        <div className="text-center">
          <Button variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
};
