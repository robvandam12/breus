
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle, Clock, Settings, Play, Save, Wifi, WifiOff, AlertTriangle } from "lucide-react";
import { CreateOperacionFormWithCallback } from "@/components/operaciones/CreateOperacionFormWithCallback";
import { OperacionSitioAssignment } from "@/components/operaciones/OperacionSitioAssignment";
import { EnhancedOperacionEquipoAssignment } from "@/components/operaciones/EnhancedOperacionEquipoAssignment";
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
    operacionId: wizardOperacionId,
    isLoading,
    autoSaveState, // NUEVO: Estado de auto-guardado
    goToStep,
    nextStep,
    previousStep,
    completeStep,
    refetch,
    triggerAutoSave
  } = useOperationWizardState(operacionId);

  const { notifyStepComplete } = useOperationNotifications(wizardOperacionId);

  useEffect(() => {
    if (onStepChange && currentStep) {
      onStepChange(currentStep.id);
    }
  }, [currentStep, onStepChange]);

  const handleCreateOperacion = (newOperacionId: string) => {
    console.log('Operation created in wizard:', newOperacionId);
    completeStep('operacion', { operacionId: newOperacionId });
    notifyStepComplete('Operación creada');
    toast({
      title: "Operación creada",
      description: "Operación creada exitosamente. Continuando con la asignación de sitio.",
    });
  };

  const handleSitioAssigned = (sitioId: string) => {
    console.log('Site assigned in wizard:', sitioId);
    completeStep('sitio', { sitioId });
    notifyStepComplete('Sitio asignado');
    toast({
      title: "Sitio asignado",
      description: "Sitio asignado exitosamente. Continuando con la asignación de equipo.",
    });
    refetch();
  };

  const handleEquipoAssigned = (equipoId: string, supervisorId: string) => {
    console.log('Team assigned in wizard:', { equipoId, supervisorId });
    completeStep('equipo', { equipoId, supervisorId });
    notifyStepComplete('Equipo asignado');
    toast({
      title: "Equipo asignado",
      description: "Equipo y supervisor asignados exitosamente.",
    });
    refetch();
  };

  const handleValidationComplete = () => {
    console.log('Validation completed in wizard');
    completeStep('validation', { validated: true });
    notifyStepComplete('Validación completada');
    if (onComplete) {
      onComplete();
    }
  };

  const handleCreateInmersion = () => {
    if (wizardOperacionId) {
      console.log('Redirecting to create immersion for operation:', wizardOperacionId);
      window.location.href = `/inmersiones?operacion=${wizardOperacionId}`;
    }
  };

  const getStepIcon = (status: string, index: number) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'active':
        return <Settings className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs text-gray-500">{index + 1}</div>;
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

  // MEJORA: Función para renderizar indicador de auto-guardado
  const renderAutoSaveIndicator = () => {
    const { status, lastSaved } = autoSaveState;
    
    switch (status) {
      case 'saving':
        return (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Save className="w-4 h-4 animate-spin" />
            <span>Guardando...</span>
          </div>
        );
      case 'saved':
        return (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Wifi className="w-4 h-4" />
            <span>
              Guardado {lastSaved && `a las ${lastSaved.toLocaleTimeString()}`}
            </span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <WifiOff className="w-4 h-4" />
            <span>Error de guardado</span>
          </div>
        );
      default:
        return null;
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

  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Wizard de Operación</CardTitle>
          <div className="flex items-center gap-4">
            {/* MEJORA: Indicador de auto-guardado */}
            {renderAutoSaveIndicator()}
            
            <span className="text-sm text-gray-600">
              {Math.round(progress)}% Completado
            </span>
            <Progress value={progress} className="w-32" />
          </div>
        </div>
        
        {/* MEJORA: Información de la operación si existe */}
        {operacion && (
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Operación: <strong>{operacion.codigo}</strong></span>
            <span>•</span>
            <span>{operacion.nombre}</span>
            {operacion.sitios && (
              <>
                <span>•</span>
                <span>Sitio: {operacion.sitios.nombre}</span>
              </>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* MEJORA: Progress Steps con navegación libre y mejor indicadores */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`flex flex-col items-center cursor-pointer transition-all hover:scale-105 ${
                step.canNavigate || step.status === 'completed' ? 'opacity-100' : 'opacity-50'
              } ${index === currentStepIndex ? 'scale-110' : ''}`}
              onClick={() => goToStep(index)}
              title={step.canNavigate || step.status === 'completed' ? 'Click para navegar' : 'Complete pasos anteriores'}
            >
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2 transition-all ${
                step.status === 'completed' 
                  ? 'border-green-500 bg-green-50 shadow-lg' 
                  : step.status === 'active'
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : step.status === 'error'
                  ? 'border-red-500 bg-red-50 shadow-lg'
                  : 'border-gray-300 bg-gray-50'
              } ${(step.canNavigate || step.status === 'completed') ? 'hover:shadow-xl' : ''}`}>
                {getStepIcon(step.status, index)}
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">{step.title}</div>
                <Badge className={`mt-1 ${getStepBadgeColor(step.status)}`}>
                  {step.status === 'completed' ? 'Completado' : 
                   step.status === 'active' ? 'Activo' : 
                   step.status === 'error' ? 'Error' : 'Pendiente'}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Current Step Content */}
        <div className="border rounded-lg p-6 bg-gray-50 min-h-[400px]">
          <div className="mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              {getStepIcon(currentStep?.status || 'pending', currentStepIndex)}
              {currentStep?.title}
            </h3>
            <p className="text-gray-600">{currentStep?.description}</p>
          </div>

          {/* MEJORA: Step Content con mejor manejo de estados */}
          {currentStep?.id === 'operacion' && (
            <CreateOperacionFormWithCallback 
              onClose={() => onCancel && onCancel()}
              onSuccess={handleCreateOperacion}
            />
          )}

          {currentStep?.id === 'sitio' && wizardOperacionId && (
            <OperacionSitioAssignment
              operacionId={wizardOperacionId}
              currentSitioId={operacion?.sitio_id}
              onComplete={handleSitioAssigned}
            />
          )}

          {currentStep?.id === 'equipo' && wizardOperacionId && (
            <EnhancedOperacionEquipoAssignment
              operacionId={wizardOperacionId}
              currentEquipoId={operacion?.equipo_buceo_id}
              currentSupervisorId={operacion?.supervisor_asignado_id}
              onComplete={handleEquipoAssigned}
            />
          )}

          {(currentStep?.id === 'hpt' || currentStep?.id === 'anexo-bravo' || currentStep?.id === 'validation') && wizardOperacionId && (
            <ValidationGateway
              operacionId={wizardOperacionId}
              onValidationComplete={handleValidationComplete}
            />
          )}
        </div>

        {/* MEJORA: Navigation con mejor lógica */}
        <div className="flex items-center justify-between pt-4 border-t">
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
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateInmersion}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Crear Inmersión
                </Button>
                <Button 
                  onClick={handleValidationComplete}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  Finalizar Wizard
                </Button>
              </div>
            ) : (
              <Button
                onClick={nextStep}
                disabled={currentStepIndex === steps.length - 1 || !currentStep?.canNavigate}
                className="flex items-center gap-2"
              >
                {isLastStep ? 'Finalizar Wizard' : 'Siguiente'}
                {!isLastStep && <ArrowRight className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
