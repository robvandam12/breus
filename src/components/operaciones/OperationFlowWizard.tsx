
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle2, 
  Circle, 
  FileText, 
  Shield, 
  Settings, 
  Users, 
  MapPin,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Play,
  ExternalLink
} from "lucide-react";
import { CreateOperacionForm } from "./CreateOperacionForm";
import { ValidationGateway } from "./ValidationGateway";
import { OperacionSitioAssignment } from "./OperacionSitioAssignment";
import { OperacionEquipoAssignment } from "./OperacionEquipoAssignment";
import { useOperationWizardState } from "@/hooks/useOperationWizardState";
import { useRouter } from "@/hooks/useRouter";
import { toast } from "@/hooks/use-toast";

interface OperationFlowWizardProps {
  operacionId?: string;
  onStepChange?: (stepId: string) => void;
  onComplete?: () => void;
  onCancel?: () => void;
}

export const OperationFlowWizard = ({ 
  operacionId, 
  onStepChange, 
  onComplete,
  onCancel 
}: OperationFlowWizardProps) => {
  const [currentOperacionId, setCurrentOperacionId] = useState(operacionId);
  const { navigateTo } = useRouter();
  
  const {
    steps,
    currentStep,
    currentStepIndex,
    completedSteps,
    totalSteps,
    progress,
    canProceed,
    canFinish,
    operacion,
    isLoading,
    goToStep,
    nextStep,
    previousStep,
    completeStep,
  } = useOperationWizardState(currentOperacionId);

  useEffect(() => {
    if (currentStep) {
      onStepChange?.(currentStep.id);
    }
  }, [currentStep, onStepChange]);

  const handleOperacionCreated = (newOperacionId: string) => {
    setCurrentOperacionId(newOperacionId);
    completeStep('operacion', { operacionId: newOperacionId });
    toast({
      title: "Operación creada",
      description: "Avanzando al siguiente paso...",
    });
  };

  const handleSitioAssigned = (sitioId: string) => {
    completeStep('sitio', { sitioId });
  };

  const handleEquipoAssigned = (equipoId: string, supervisorId: string) => {
    completeStep('equipo', { equipoId, supervisorId });
  };

  const handleValidationComplete = () => {
    if (canFinish) {
      toast({
        title: "¡Operación completada!",
        description: "La operación está lista para ejecutarse",
      });
      onComplete?.();
    }
  };

  const handleCreateHPT = () => {
    if (currentOperacionId) {
      navigateTo(`/formularios/hpt?operacion=${currentOperacionId}`);
    }
  };

  const handleCreateAnexoBravo = () => {
    if (currentOperacionId) {
      navigateTo(`/formularios/anexo-bravo?operacion=${currentOperacionId}`);
    }
  };

  const getStepIcon = (step: any) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'active':
        return <Circle className="w-5 h-5 text-blue-600 fill-current" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepBadge = (step: any) => {
    switch (step.status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completado</Badge>;
      case 'active':
        return <Badge className="bg-blue-100 text-blue-800">En Progreso</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case 'pending':
        return step.required ? 
          <Badge className="bg-gray-100 text-gray-800">Pendiente</Badge> :
          <Badge className="bg-yellow-100 text-yellow-800">Opcional</Badge>;
      default:
        return null;
    }
  };

  const renderStepContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Cargando...</span>
        </div>
      );
    }

    if (!currentStep) return null;

    switch (currentStep.id) {
      case 'operacion':
        if (currentOperacionId) {
          return (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 mx-auto text-green-600 mb-4" />
              <h3 className="text-lg font-medium mb-2">Operación Creada</h3>
              <p className="text-gray-600 mb-6">
                {operacion?.nombre} ({operacion?.codigo})
              </p>
              <Button onClick={nextStep}>
                Continuar al Siguiente Paso
              </Button>
            </div>
          );
        }
        return (
          <CreateOperacionForm 
            onClose={() => onCancel?.()}
            onSuccess={handleOperacionCreated}
          />
        );

      case 'sitio':
        if (!currentOperacionId) {
          return (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Primero debe crear la operación antes de continuar.
              </AlertDescription>
            </Alert>
          );
        }
        return (
          <OperacionSitioAssignment
            operacionId={currentOperacionId}
            currentSitioId={currentStep.data?.sitioId}
            onComplete={handleSitioAssigned}
          />
        );

      case 'equipo':
        if (!currentOperacionId) {
          return (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Primero debe crear la operación antes de continuar.
              </AlertDescription>
            </Alert>
          );
        }
        return (
          <OperacionEquipoAssignment
            operacionId={currentOperacionId}
            currentEquipoId={currentStep.data?.equipoId}
            currentSupervisorId={currentStep.data?.supervisorId}
            onComplete={handleEquipoAssigned}
          />
        );

      case 'hpt':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Herramientas y Procedimientos de Trabajo (HPT)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentStep.data?.signed ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-16 h-16 mx-auto text-green-600 mb-4" />
                  <h3 className="text-lg font-medium mb-2">HPT Completado y Firmado</h3>
                  <p className="text-gray-600 mb-6">
                    El documento HPT ha sido creado y firmado correctamente.
                  </p>
                  <Button onClick={nextStep}>
                    Continuar al Siguiente Paso
                  </Button>
                </div>
              ) : currentStep.data?.exists ? (
                <div className="text-center py-6">
                  <AlertTriangle className="w-16 h-16 mx-auto text-yellow-600 mb-4" />
                  <h3 className="text-lg font-medium mb-2">HPT Creado pero no Firmado</h3>
                  <p className="text-gray-600 mb-6">
                    El documento HPT existe pero necesita ser firmado antes de continuar.
                  </p>
                  <Button onClick={handleCreateHPT} className="mr-2">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Completar HPT
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Crear HPT</h3>
                  <p className="text-gray-600 mb-6">
                    Debe crear y firmar el documento HPT antes de continuar.
                  </p>
                  <Button onClick={handleCreateHPT}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Crear HPT
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'anexo-bravo':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Anexo Bravo - Análisis de Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentStep.data?.signed ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-16 h-16 mx-auto text-green-600 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Anexo Bravo Completado y Firmado</h3>
                  <p className="text-gray-600 mb-6">
                    El documento Anexo Bravo ha sido creado y firmado correctamente.
                  </p>
                  <Button onClick={nextStep}>
                    Continuar al Siguiente Paso
                  </Button>
                </div>
              ) : currentStep.data?.exists ? (
                <div className="text-center py-6">
                  <AlertTriangle className="w-16 h-16 mx-auto text-yellow-600 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Anexo Bravo Creado pero no Firmado</h3>
                  <p className="text-gray-600 mb-6">
                    El documento Anexo Bravo existe pero necesita ser firmado antes de continuar.
                  </p>
                  <Button onClick={handleCreateAnexoBravo}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Completar Anexo Bravo
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Shield className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Crear Anexo Bravo</h3>
                  <p className="text-gray-600 mb-6">
                    Debe crear y firmar el documento Anexo Bravo antes de continuar.
                  </p>
                  <Button onClick={handleCreateAnexoBravo}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Crear Anexo Bravo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'validation':
        if (!currentOperacionId) {
          return (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Primero debe crear la operación antes de continuar.
              </AlertDescription>
            </Alert>
          );
        }
        return (
          <ValidationGateway 
            operacionId={currentOperacionId}
            onValidationComplete={handleValidationComplete}
          />
        );

      default:
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              {currentStep.id === 'sitio' && <MapPin className="w-8 h-8 text-blue-600" />}
              {currentStep.id === 'equipo' && <Users className="w-8 h-8 text-blue-600" />}
              {currentStep.id === 'hpt' && <Settings className="w-8 h-8 text-blue-600" />}
              {currentStep.id === 'anexo-bravo' && <Shield className="w-8 h-8 text-blue-600" />}
            </div>
            <h3 className="text-lg font-medium mb-2">{currentStep.title}</h3>
            <p className="text-gray-600 mb-6">{currentStep.description}</p>
            <Button onClick={nextStep} disabled={currentStepIndex === steps.length - 1}>
              Continuar
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Wizard de Creación de Operación
            </div>
            <div className="text-sm text-gray-600">
              {completedSteps} de {totalSteps} completados
            </div>
          </CardTitle>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Lista de Pasos */}
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer ${
                  index === currentStepIndex 
                    ? 'border-blue-500 bg-blue-50' 
                    : step.status === 'completed'
                    ? 'border-green-200 bg-green-50 hover:bg-green-100'
                    : step.status === 'error'
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  // Solo permitir navegar a pasos completados o el actual
                  if (step.status === 'completed' || index <= currentStepIndex) {
                    goToStep(index);
                  }
                }}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.status === 'completed' 
                    ? 'bg-green-100' 
                    : step.status === 'error'
                    ? 'bg-red-100'
                    : index === currentStepIndex
                    ? 'bg-blue-100'
                    : 'bg-gray-100'
                }`}>
                  {getStepIcon(step)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{step.title}</h4>
                    {getStepBadge(step)}
                  </div>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>

                {step.required && step.status === 'pending' && (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                )}
              </div>
            ))}
          </div>

          {/* Navegación */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={previousStep}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </Button>
            
            {canFinish ? (
              <Button
                onClick={handleValidationComplete}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Play className="w-4 h-4" />
                Finalizar Operación
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={currentStepIndex === steps.length - 1 || !canProceed}
                className="flex items-center gap-2"
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Alertas */}
          {steps.some(step => step.required && step.status === 'pending') && !canFinish && (
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                Hay pasos obligatorios pendientes que deben completarse antes de finalizar la operación.
              </AlertDescription>
            </Alert>
          )}

          {canFinish && (
            <Alert>
              <CheckCircle2 className="w-4 h-4" />
              <AlertDescription>
                ¡Excelente! La operación está completamente configurada y lista para ejecutarse.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Contenido del paso actual */}
      <Card>
        <CardHeader>
          <CardTitle>{currentStep?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>
    </div>
  );
};
