
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Save, FileText, Shield, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useHPTWizard, HPTWizardData } from "@/hooks/useHPTWizard";

// Importando los componentes de cada paso
import { HPTStep1 } from "./steps/HPTStep1";
import { HPTStep2 } from "./steps/HPTStep2";
import { HPTStep3 } from "./steps/HPTStep3";
import { HPTStep4 } from "./steps/HPTStep4";
import { HPTStep5 } from "./steps/HPTStep5";
import { HPTStep6 } from "./steps/HPTStep6";

interface HPTWizardProps {
  operacionId?: string;
  hptId?: string;
  onComplete?: (hptId: string) => void;
  onCancel?: () => void;
  operaciones?: any[];
  selectedOperacion?: any;
  setSelectedOperacion?: (operacion: any) => void;
}

export const HPTWizard = ({ 
  operacionId, 
  hptId, 
  onComplete, 
  onCancel,
  operaciones = [],
  selectedOperacion,
  setSelectedOperacion = () => {}
}: HPTWizardProps) => {
  const { toast } = useToast();
  const {
    currentStep,
    data,
    steps,
    updateData,
    nextStep,
    prevStep,
    submitHPT,
    isFormComplete,
    progress,
    isLoading,
    autoSaveEnabled,
    setAutoSaveEnabled
  } = useHPTWizard(operacionId, hptId);

  const handleNext = () => {
    const currentStepData = steps[currentStep - 1];
    if (!currentStepData.isValid) {
      toast({
        title: "Paso incompleto",
        description: "Complete todos los campos requeridos para continuar",
        variant: "destructive",
      });
      return;
    }
    nextStep();
  };

  const handleSubmit = async () => {
    try {
      const finalHptId = await submitHPT();
      if (finalHptId && onComplete) {
        onComplete(finalHptId);
      }
    } catch (error) {
      console.error('Error submitting HPT:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <HPTStep1 
            data={data} 
            updateData={updateData}
            operaciones={operaciones}
            selectedOperacion={selectedOperacion}
            setSelectedOperacion={setSelectedOperacion}
          />
        );
      case 2:
        return <HPTStep2 data={data} onUpdate={updateData} operacionId={operacionId || ''} />;
      case 3:
        return <HPTStep3 data={data} onUpdate={updateData} />;
      case 4:
        return <HPTStep4 data={data} onUpdate={updateData} />;
      case 5:
        return <HPTStep5 data={data} onUpdate={updateData} />;
      case 6:
        return <HPTStep6 data={data} onUpdate={updateData} />;
      default:
        return null;
    }
  };

  const getStepIcon = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return <FileText className="w-5 h-5" />;
      case 2:
        return <Shield className="w-5 h-5" />;
      case 3:
        return <AlertTriangle className="w-5 h-5" />;
      case 4:
        return <Shield className="w-5 h-5" />;
      case 5:
        return <AlertTriangle className="w-5 h-5" />;
      case 6:
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="h-full max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-4 md:p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg">
              {getStepIcon(currentStep)}
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl text-gray-900">
                Hoja de Planificación de Tarea (HPT)
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Paso {currentStep} de {steps.length}: {currentStepData?.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge 
              variant={autoSaveEnabled ? "default" : "secondary"}
              className={autoSaveEnabled ? "bg-green-100 text-green-700" : ""}
            >
              {autoSaveEnabled ? "Auto-guardado ON" : "Auto-guardado OFF"}
            </Badge>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mt-6">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`flex-1 ${index < steps.length - 1 ? 'mr-2' : ''}`}
            >
              <div className={`h-2 rounded-full ${
                step.id < currentStep ? 'bg-green-500' : 
                step.id === currentStep ? 'bg-blue-500' : 
                'bg-gray-200'
              }`} />
              <div className="mt-2 text-xs text-center">
                <span className={`${
                  step.id === currentStep ? 'text-blue-600 font-medium' : 
                  step.id < currentStep ? 'text-green-600' : 
                  'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-teal-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                {getStepIcon(currentStep)}
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900">
                  {currentStepData?.title}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {currentStepData?.description}
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 md:p-8">
            {renderStep()}
          </CardContent>
        </Card>
      </div>

      {/* Navigation - Fixed at bottom */}
      <div className="flex-shrink-0 flex justify-between items-center p-4 md:p-6 gap-4 border-t bg-white">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
            className="min-w-[100px]"
          >
            Cancelar
          </Button>
          <Button
            variant="outline"
            onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
            disabled={isLoading}
            className="min-w-[140px]"
          >
            {autoSaveEnabled ? "Desactivar" : "Activar"} Auto-guardado
          </Button>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || isLoading}
            className="flex items-center gap-2 min-w-[100px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>
          
          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              disabled={!currentStepData?.isValid || isLoading}
              className="flex items-center gap-2 min-w-[100px] bg-blue-600 hover:bg-blue-700"
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isFormComplete || isLoading}
              className="flex items-center gap-2 min-w-[120px] bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Enviando...' : 'Enviar HPT'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
