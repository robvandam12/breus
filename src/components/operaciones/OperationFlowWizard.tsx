
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle, Clock, Settings } from "lucide-react";
import { CreateOperacionFormWithCallback } from "@/components/operaciones/CreateOperacionFormWithCallback";
import { OperacionSitioAssignment } from "@/components/operaciones/OperacionSitioAssignment";
import { OperacionEquipoAssignment } from "@/components/operaciones/OperacionEquipoAssignment";
import { ValidationGateway } from "@/components/operaciones/ValidationGateway";
import { useOperationWizardState } from "@/hooks/useOperationWizardState";
import { useOperationNotifications } from "@/hooks/useOperationNotifications";
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
  const {
    steps,
    currentStep,
    currentStepIndex,
    progress,
    canFinish,
    operacion,
    isLoading,
    stepData,
    persistedOperacionId,
    goToStep,
    nextStep,
    previousStep,
    completeStep,
    refetch
  } = useOperationWizardState(operacionId);

  const { notifyStepComplete } = useOperationNotifications(persistedOperacionId);
  const [formCache, setFormCache] = useState<Record<string, any>>({});

  useEffect(() => {
    if (onStepChange && currentStep) {
      onStepChange(currentStep.id);
    }
  }, [currentStep, onStepChange]);

  const handleCreateOperacion = (newOperacionId: string) => {
    completeStep('operacion', { operacionId: newOperacionId });
    notifyStepComplete('Operación creada');
    toast({
      title: "Operación creada",
      description: "Puede continuar con el siguiente paso.",
    });
  };

  const handleSitioAssigned = (sitioId: string) => {
    completeStep('sitio', { sitioId });
    notifyStepComplete('Sitio asignado');
    refetch();
  };

  const handleEquipoAssigned = (equipoId: string, supervisorId: string) => {
    completeStep('equipo', { equipoId, supervisorId });
    notifyStepComplete('Equipo asignado');
    refetch();
  };

  const handleValidationComplete = () => {
    completeStep('validation', { validated: true });
    notifyStepComplete('Validación completada');
    if (onComplete) {
      onComplete();
    }
  };

  const handleHPTCreated = () => {
    completeStep('hpt', { hptCreated: true });
    notifyStepComplete('HPT completado');
    refetch();
  };

  const handleAnexoBravoCreated = () => {
    completeStep('anexo-bravo', { anexoBravoCreated: true });
    notifyStepComplete('Anexo Bravo completado');
    refetch();
  };

  const handleFormDataChange = (stepId: string, data: any) => {
    setFormCache(prev => ({
      ...prev,
      [stepId]: { ...prev[stepId], ...data }
    }));
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'active':
        return <Settings className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center">Cargando wizard...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Wizard de Operación</CardTitle>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {Math.round(progress)}% Completado
            </span>
            <Progress value={progress} className="w-32" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`flex flex-col items-center cursor-pointer transition-all ${
                index <= currentStepIndex ? 'opacity-100' : 'opacity-50'
              }`}
              onClick={() => goToStep(index)}
            >
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2 ${
                step.status === 'completed' 
                  ? 'border-green-500 bg-green-50' 
                  : step.status === 'active'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-gray-50'
              }`}>
                {getStepIcon(step.status)}
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">{step.title}</div>
                <Badge className={`mt-1 ${getStepBadgeColor(step.status)}`}>
                  {step.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Current Step Content */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <div className="mb-4">
            <h3 className="text-xl font-semibold">{currentStep?.title}</h3>
            <p className="text-gray-600">{currentStep?.description}</p>
          </div>

          {/* Step Content */}
          {currentStep?.id === 'operacion' && (
            <CreateOperacionFormWithCallback 
              onClose={() => onCancel && onCancel()}
              onSuccess={handleCreateOperacion}
              initialData={formCache.operacion || {}}
              onDataChange={(data) => handleFormDataChange('operacion', data)}
            />
          )}

          {currentStep?.id === 'sitio' && persistedOperacionId && (
            <OperacionSitioAssignment
              operacionId={persistedOperacionId}
              currentSitioId={operacion?.sitio_id}
              onComplete={handleSitioAssigned}
            />
          )}

          {currentStep?.id === 'equipo' && persistedOperacionId && (
            <OperacionEquipoAssignment
              operacionId={persistedOperacionId}
              currentEquipoId={operacion?.equipo_buceo_id}
              currentSupervisorId={operacion?.supervisor_asignado_id}
              onComplete={handleEquipoAssigned}
            />
          )}

          {(currentStep?.id === 'hpt' || currentStep?.id === 'anexo-bravo' || currentStep?.id === 'validation') && persistedOperacionId && (
            <ValidationGateway
              operacionId={persistedOperacionId}
              onValidationComplete={handleValidationComplete}
              onHPTCreated={handleHPTCreated}
              onAnexoBravoCreated={handleAnexoBravoCreated}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={previousStep}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>

          <div className="flex items-center gap-2">
            {onCancel && (
              <Button variant="ghost" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            
            {canFinish ? (
              <Button 
                onClick={handleValidationComplete}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Finalizar
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={currentStepIndex === steps.length - 1 || currentStep?.status !== 'completed'}
                className="flex items-center gap-2"
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
