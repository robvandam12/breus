
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Save, FileText } from "lucide-react";
import { useMultiXWizard } from "@/hooks/useMultiX";
import { MultiXStep1 } from "./steps/MultiXStep1";
import { MultiXStep2 } from "./steps/MultiXStep2";
import { MultiXStep3 } from "./steps/MultiXStep3";

interface MultiXWizardProps {
  multiXId?: string;
  tipo: 'mantencion' | 'faena';
  onClose?: () => void;
}

export const MultiXWizard = ({ multiXId, tipo, onClose }: MultiXWizardProps) => {
  const {
    formData,
    updateFormData,
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    getTotalSteps,
    saveMultiX,
    multiXRecord,
    isLoading
  } = useMultiXWizard(multiXId, tipo);

  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  const stepTitles = {
    mantencion: [
      "Encabezado General",
      "Dotación y Roles",
      "Equipos de Superficie",
      "Faenas de Mantención",
      "Sistemas y Equipos",
      "Apoyo a Faenas",
      "Resumen de Inmersiones",
      "Firmas"
    ],
    faena: [
      "Encabezado General",
      "Dotación y Roles", 
      "Equipos de Superficie",
      "Iconografía y Simbología",
      "Matriz de Actividades",
      "Sistemas y Equipos",
      "Apoyo a Faenas",
      "Resumen de Inmersiones",
      "Firmas"
    ]
  };

  const getCurrentStepTitle = () => {
    return stepTitles[tipo][currentStep - 1] || `Paso ${currentStep}`;
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <MultiXStep1 
            formData={formData}
            updateFormData={updateFormData}
            tipo={tipo}
          />
        );
      case 2:
        return (
          <MultiXStep2 
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <MultiXStep3 
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      default:
        return (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Paso en desarrollo
            </h3>
            <p className="text-muted-foreground">
              Este paso será implementado en la siguiente fase.
            </p>
          </div>
        );
    }
  };

  const handleSave = () => {
    if (multiXId) {
      saveMultiX.mutate();
    }
  };

  const progress = (currentStep / getTotalSteps()) * 100;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando formulario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header con progreso */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {tipo === 'mantencion' ? 'Boleta de Mantención de Redes' : 'Boleta de Faena de Redes'}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {multiXRecord?.codigo || 'Nuevo formulario'} - Paso {currentStep} de {getTotalSteps()}
              </p>
            </div>
            <Badge variant={multiXRecord?.estado === 'firmado' ? 'default' : 'secondary'}>
              {multiXRecord?.estado || 'borrador'}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{getCurrentStepTitle()}</span>
              <span>{Math.round(progress)}% completado</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>
      </Card>

      {/* Navegación de pasos */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2 overflow-x-auto">
            {Array.from({ length: getTotalSteps() }, (_, i) => i + 1).map(step => (
              <Button
                key={step}
                variant={step === currentStep ? "default" : step < currentStep ? "secondary" : "outline"}
                size="sm"
                onClick={() => goToStep(step)}
                className="min-w-[80px] text-xs"
              >
                Paso {step}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contenido del paso actual */}
      <Card>
        <CardHeader>
          <CardTitle>{getCurrentStepTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderCurrentStep()}
        </CardContent>
      </Card>

      {/* Controles de navegación */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>
            
            <div className="flex gap-2">
              {multiXId && (
                <Button
                  variant="outline"
                  onClick={handleSave}
                  disabled={saveMultiX.isPending}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saveMultiX.isPending ? 'Guardando...' : 'Guardar'}
                </Button>
              )}
              
              {currentStep < getTotalSteps() ? (
                <Button
                  onClick={nextStep}
                  className="flex items-center gap-2"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={onClose}
                  className="flex items-center gap-2"
                >
                  Finalizar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
