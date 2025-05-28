
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useHPTWizard } from '@/hooks/useHPTWizard';
import { HPTWizardStep1 } from './HPTWizardStep1';
import { HPTWizardStep2 } from './HPTWizardStep2';
import { HPTWizardStep3 } from './HPTWizardStep3';
import { HPTWizardStep4 } from './HPTWizardStep4';
import { HPTWizardStep5 } from './HPTWizardStep5';
import { CheckCircle, Circle, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { useAuthRoles } from '@/hooks/useAuthRoles';

interface HPTWizardCompleteProps {
  operacionId: string;
  hptId?: string;
  onComplete?: (hptId: string) => void;
  onCancel?: () => void;
}

export const HPTWizardComplete: React.FC<HPTWizardCompleteProps> = ({
  operacionId,
  hptId,
  onComplete,
  onCancel
}) => {
  const { permissions } = useAuthRoles();
  const {
    currentStep,
    data,
    steps,
    updateData,
    nextStep,
    prevStep,
    goToStep,
    saveDraft,
    submitHPT,
    isFormComplete,
    progress,
    isLoading,
    autoSaveEnabled,
    setAutoSaveEnabled
  } = useHPTWizard(operacionId, hptId);

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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <HPTWizardStep1 data={data} updateData={updateData} />;
      case 2:
        return <HPTWizardStep2 data={data} updateData={updateData} />;
      case 3:
        return <HPTWizardStep3 data={data} updateData={updateData} />;
      case 4:
        return <HPTWizardStep4 data={data} updateData={updateData} />;
      case 5:
        return <HPTWizardStep5 data={data} updateData={updateData} />;
      case 6:
        return <HPTWizardStep5 data={data} updateData={updateData} />;
      default:
        return <div>Paso no encontrado</div>;
    }
  };

  if (!permissions.create_hpt) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Acceso Denegado
            </h3>
            <p className="text-gray-600">
              No tiene permisos para crear o editar HPT.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header con progreso */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {hptId ? 'Editar' : 'Crear'} Hoja de Planificación de Tarea (HPT)
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Paso {currentStep} de {steps.length}: {steps[currentStep - 1]?.title}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={autoSaveEnabled ? "default" : "secondary"}>
                Auto-save {autoSaveEnabled ? 'ON' : 'OFF'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
              >
                Toggle
              </Button>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Navegación de pasos */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {steps.map((step) => (
              <Button
                key={step.id}
                variant={step.id === currentStep ? "default" : "outline"}
                size="sm"
                onClick={() => goToStep(step.id)}
                className="h-auto p-2 flex flex-col items-center gap-1"
              >
                <div className="flex items-center gap-1">
                  {step.isValid ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                  <span className="font-semibold">{step.id}</span>
                </div>
                <span className="text-xs text-center leading-tight">
                  {step.title}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contenido del paso actual */}
      {renderStepContent()}

      {/* Navegación inferior */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
              
              <Button
                variant="outline"
                onClick={saveDraft}
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Guardando...' : 'Guardar Borrador'}
              </Button>
            </div>

            <div className="flex gap-2">
              {onCancel && (
                <Button variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
              
              {currentStep < steps.length ? (
                <Button
                  onClick={nextStep}
                  disabled={!steps[currentStep - 1]?.isValid}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isFormComplete || isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? 'Enviando...' : 'Completar HPT'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
