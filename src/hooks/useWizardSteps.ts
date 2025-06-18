
import { useState, useCallback, useMemo } from 'react';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  required: boolean;
  canNavigate?: boolean;
}

export const useWizardSteps = (operacion: any, documentStatus: any, wizardOperacionId?: string) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const baseSteps: WizardStep[] = [
    {
      id: 'operacion',
      title: 'Información General',
      description: 'Datos básicos de la operación',
      status: wizardOperacionId ? 'completed' : 'active',
      required: true,
      canNavigate: true
    },
    {
      id: 'sitio',
      title: 'Ubicación de Trabajo',
      description: 'Seleccionar sitio de la operación',
      status: 'pending',
      required: true,
      canNavigate: false
    },
    {
      id: 'equipo',
      title: 'Equipo y Personal',
      description: 'Asignar equipo de buceo y supervisor',
      status: 'pending',
      required: true,
      canNavigate: false
    },
    {
      id: 'hpt',
      title: 'Análisis de Riesgos',
      description: 'Completar documento HPT',
      status: 'pending',
      required: true,
      canNavigate: false
    },
    {
      id: 'anexo-bravo',
      title: 'Protocolo de Seguridad',
      description: 'Completar Anexo Bravo',
      status: 'pending',
      required: true,
      canNavigate: false
    },
    {
      id: 'validation',
      title: 'Validación y Aprobación',
      description: 'Verificar completitud y aprobar',
      status: 'pending',
      required: true,
      canNavigate: false
    }
  ];

  const calculateStepsStatus = useCallback(() => {
    if (!operacion) return baseSteps;

    const updatedSteps = [...baseSteps];
    
    // Operación creada
    if (wizardOperacionId) {
      const operacionStep = updatedSteps.find(s => s.id === 'operacion');
      if (operacionStep) {
        operacionStep.status = 'completed';
        operacionStep.canNavigate = true;
      }
    }

    // Sitio asignado
    if (operacion.sitio_id) {
      const sitioStep = updatedSteps.find(s => s.id === 'sitio');
      if (sitioStep) {
        sitioStep.status = 'completed';
        sitioStep.canNavigate = true;
      }
    } else if (wizardOperacionId) {
      const sitioStep = updatedSteps.find(s => s.id === 'sitio');
      if (sitioStep) {
        sitioStep.status = 'active';
        sitioStep.canNavigate = true;
      }
    }

    // Equipo y supervisor asignados
    if (operacion.equipo_buceo_id && operacion.supervisor_asignado_id) {
      const equipoStep = updatedSteps.find(s => s.id === 'equipo');
      if (equipoStep) {
        equipoStep.status = 'completed';
        equipoStep.canNavigate = true;
      }
    } else if (operacion.sitio_id) {
      const equipoStep = updatedSteps.find(s => s.id === 'equipo');
      if (equipoStep) {
        equipoStep.status = 'active';
        equipoStep.canNavigate = true;
      }
    }

    // HPT completado
    if (documentStatus?.hptReady) {
      const hptStep = updatedSteps.find(s => s.id === 'hpt');
      if (hptStep) {
        hptStep.status = 'completed';
        hptStep.canNavigate = true;
      }
    } else if (operacion.equipo_buceo_id && operacion.supervisor_asignado_id) {
      const hptStep = updatedSteps.find(s => s.id === 'hpt');
      if (hptStep) {
        hptStep.status = 'active';
        hptStep.canNavigate = true;
      }
    }

    // Anexo Bravo completado
    if (documentStatus?.anexoBravoReady) {
      const anexoStep = updatedSteps.find(s => s.id === 'anexo-bravo');
      if (anexoStep) {
        anexoStep.status = 'completed';
        anexoStep.canNavigate = true;
      }
    } else if (documentStatus?.hptReady) {
      const anexoStep = updatedSteps.find(s => s.id === 'anexo-bravo');
      if (anexoStep) {
        anexoStep.status = 'active';
        anexoStep.canNavigate = true;
      }
    }

    // Validación
    const allPrevCompleted = updatedSteps.slice(0, -1).every(s => s.status === 'completed');
    if (allPrevCompleted) {
      const validationStep = updatedSteps.find(s => s.id === 'validation');
      if (validationStep) {
        validationStep.status = 'active';
        validationStep.canNavigate = true;
      }
    }

    // Permitir navegación a pasos completados o activos
    updatedSteps.forEach(step => {
      if (step.status === 'completed' || step.status === 'active') {
        step.canNavigate = true;
      }
    });

    return updatedSteps;
  }, [operacion, documentStatus, wizardOperacionId, baseSteps]);

  const currentSteps = useMemo(() => calculateStepsStatus(), [calculateStepsStatus]);
  const currentStep = currentSteps[currentStepIndex];
  const completedSteps = currentSteps.filter(s => s.status === 'completed').length;
  const progress = (completedSteps / currentSteps.length) * 100;
  const canFinish = currentSteps.every(s => !s.required || s.status === 'completed');

  const goToStep = useCallback((stepIndex: number) => {
    const targetStep = currentSteps[stepIndex];
    if (targetStep?.canNavigate) {
      setCurrentStepIndex(stepIndex);
    }
  }, [currentSteps]);

  const nextStep = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < currentSteps.length) {
      const nextStepData = currentSteps[nextIndex];
      if (nextStepData?.canNavigate) {
        setCurrentStepIndex(nextIndex);
      }
    }
  }, [currentStepIndex, currentSteps]);

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  return {
    steps: currentSteps,
    currentStep,
    currentStepIndex,
    progress,
    canFinish,
    goToStep,
    nextStep,
    previousStep,
    setCurrentStepIndex
  };
};
