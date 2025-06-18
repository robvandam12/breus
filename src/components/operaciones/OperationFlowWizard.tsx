
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, AlertCircle, Clock, Workflow, Save, Wifi, WifiOff } from 'lucide-react';
import { useOperationWizardState } from '@/hooks/useOperationWizardState';
import { CreateOperacionForm } from './CreateOperacionForm';
import { OperacionSitioAssignment } from './OperacionSitioAssignment';
import { EnhancedOperacionEquipoAssignment } from './EnhancedOperacionEquipoAssignment';
import { ValidationGateway } from './ValidationGateway';
import { DocumentValidationStatus } from './DocumentValidationStatus';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OperationFlowWizardProps {
  operacionId?: string;
  onComplete: () => void;
  onCancel: () => void;
  onStepChange?: (stepId: string) => void;
}

export const OperationFlowWizard = ({ 
  operacionId, 
  onComplete, 
  onCancel,
  onStepChange 
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
    isAutoSaving,
    lastSaveTime,
    goToStep,
    nextStep,
    previousStep,
    completeStep
  } = useOperationWizardState(operacionId);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (onStepChange && currentStep) {
      onStepChange(currentStep.id);
    }
  }, [currentStep, onStepChange]);

  const handleStepComplete = async (stepId: string, data: any) => {
    try {
      setErrors(prev => ({ ...prev, [stepId]: '' }));
      
      // Validar datos según el paso
      const validation = validateStepData(stepId, data);
      if (!validation.isValid) {
        setErrors(prev => ({ ...prev, [stepId]: validation.error }));
        toast({
          title: "Error de validación",
          description: validation.error,
          variant: "destructive"
        });
        return;
      }

      await completeStep(stepId, data);
      
      toast({
        title: "Paso completado",
        description: `${currentStep?.title} completado exitosamente.`,
        duration: 2000
      });
    } catch (error) {
      console.error('Error completing step:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setErrors(prev => ({ ...prev, [stepId]: errorMessage }));
      toast({
        title: "Error",
        description: `No se pudo completar el paso: ${errorMessage}`,
        variant: "destructive"
      });
    }
  };

  const validateStepData = (stepId: string, data: any) => {
    switch (stepId) {
      case 'operacion':
        if (!data.operacionId) {
          return { isValid: false, error: 'No se pudo crear la operación' };
        }
        break;
      case 'sitio':
        if (!data.sitio_id) {
          return { isValid: false, error: 'Debe seleccionar un sitio' };
        }
        break;
      case 'equipo':
        if (!data.equipo_buceo_id || !data.supervisor_asignado_id) {
          return { isValid: false, error: 'Debe asignar equipo y supervisor' };
        }
        break;
    }
    return { isValid: true, error: '' };
  };

  const handleFinish = async () => {
    if (!canFinish) {
      toast({
        title: "Operación incompleta",
        description: "Complete todos los pasos requeridos antes de finalizar.",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "¡Operación completada!",
        description: "La operación está lista para ejecutarse."
      });
      onComplete();
    } catch (error) {
      console.error('Error finishing wizard:', error);
      toast({
        title: "Error",
        description: "No se pudo finalizar la operación.",
        variant: "destructive"
      });
    }
  };

  const getStepIcon = (step: any) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'active':
        return <Circle className="w-5 h-5 text-blue-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const renderStepContent = () => {
    if (!currentStep) return null;

    switch (currentStep.id) {
      case 'operacion':
        return (
          <CreateOperacionForm
            onSubmitOverride={async (data) => {
              await handleStepComplete('operacion', { operacionId: data.id });
            }}
            onClose={onCancel}
            hideButtons={true}
          />
        );
      case 'sitio':
        return (
          <OperacionSitioAssignment
            operacionId={wizardOperacionId}
            onComplete={(data) => handleStepComplete('sitio', data)}
          />
        );
      case 'equipo':
        return (
          <EnhancedOperacionEquipoAssignment
            operacionId={wizardOperacionId!}
            currentEquipoId={operacion?.equipo_buceo_id}
            currentSupervisorId={operacion?.supervisor_asignado_id}
            onComplete={(equipoId, supervisorId) => 
              handleStepComplete('equipo', { 
                equipo_buceo_id: equipoId, 
                supervisor_asignado_id: supervisorId 
              })
            }
          />
        );
      case 'hpt':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Crear Documento HPT
              </h3>
              <p className="text-blue-700 mb-4">
                Abra el HPT en una nueva pestaña para completar el documento.
              </p>
              <Button
                onClick={() => window.open(`/hpt?operacion=${wizardOperacionId}`, '_blank')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Abrir HPT
              </Button>
            </div>
            <DocumentValidationStatus 
              operacionId={wizardOperacionId!}
              onDocumentCreate={(type) => {
                if (type === 'hpt') {
                  window.open(`/hpt?operacion=${wizardOperacionId}`, '_blank');
                }
              }}
            />
          </div>
        );
      case 'anexo-bravo':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Crear Anexo Bravo
              </h3>
              <p className="text-green-700 mb-4">
                Abra el Anexo Bravo en una nueva pestaña para completar el documento.
              </p>
              <Button
                onClick={() => window.open(`/anexo-bravo?operacion=${wizardOperacionId}`, '_blank')}
                className="bg-green-600 hover:bg-green-700"
              >
                Abrir Anexo Bravo
              </Button>
            </div>
            <DocumentValidationStatus 
              operacionId={wizardOperacionId!}
              onDocumentCreate={(type) => {
                if (type === 'anexo') {
                  window.open(`/anexo-bravo?operacion=${wizardOperacionId}`, '_blank');
                }
              }}
            />
          </div>
        );
      case 'validation':
        return (
          <ValidationGateway
            operacionId={wizardOperacionId!}
            onValidationComplete={handleFinish}
          />
        );
      default:
        return <div>Paso no implementado</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando asistente de operación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estado de auto-guardado prominente */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Workflow className="w-6 h-6 text-blue-600" />
            Asistente de Operación
          </h2>
          {operacion && (
            <p className="text-gray-600 mt-1">
              {operacion.codigo} - {operacion.nombre}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Estado de auto-guardado más visible */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50">
            {isAutoSaving ? (
              <>
                <Save className="w-4 h-4 text-blue-600 animate-pulse" />
                <span className="text-sm text-blue-600 font-medium">Guardando...</span>
              </>
            ) : lastSaveTime ? (
              <>
                <Wifi className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">
                  Guardado {lastSaveTime.toLocaleTimeString()}
                </span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Sin guardar</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progreso</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {/* Steps Navigation - Mejorado */}
      <div className="grid grid-cols-6 gap-2">
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => goToStep(index)}
            disabled={!step.canNavigate && step.status !== 'completed'}
            className={`p-3 rounded-lg text-xs font-medium transition-all duration-200 ${
              index === currentStepIndex
                ? 'bg-blue-100 text-blue-800 border-2 border-blue-300 shadow-md'
                : step.status === 'completed'
                ? 'bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer'
                : step.canNavigate
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              {getStepIcon(step)}
              <span className="text-xs font-bold">{index + 1}</span>
            </div>
            <div className="truncate text-center">{step.title}</div>
          </button>
        ))}
      </div>

      {/* Current Step Error */}
      {errors[currentStep?.id || ''] && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">
            {errors[currentStep?.id || '']}
          </AlertDescription>
        </Alert>
      )}

      {/* Step Content */}
      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStepIcon(currentStep)}
            {currentStep?.title}
          </CardTitle>
          <p className="text-sm text-gray-600">{currentStep?.description}</p>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation - Mejorado */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={currentStepIndex === 0 ? onCancel : previousStep}
          className="flex items-center gap-2"
        >
          {currentStepIndex === 0 ? 'Cancelar' : '← Anterior'}
        </Button>
        
        <div className="flex gap-2">
          {currentStepIndex < steps.length - 1 && (
            <Button
              onClick={nextStep}
              disabled={!currentStep?.canNavigate && currentStep?.status !== 'completed'}
              className="flex items-center gap-2"
            >
              Siguiente →
            </Button>
          )}
          
          {canFinish && currentStep?.id === 'validation' && (
            <Button
              onClick={handleFinish}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Finalizar Operación
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
