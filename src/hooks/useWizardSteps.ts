
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
      // Habilitar siguiente paso
      const equipoStep = updatedSteps.find(s => s.id === 'equipo');
      if (equipoStep && equipoStep.status === 'pending') {
        equipoStep.status = 'active';
        equipoStep.canNavigate = true;
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
      // Habilitar siguiente paso
      const hptStep = updatedSteps.find(s => s.id === 'hpt');
      if (hptStep && hptStep.status === 'pending') {
        hptStep.status = 'active';
        hptStep.canNavigate = true;
      }
    }

    // HPT completado
    if (documentStatus?.hptReady) {
      const hptStep = updatedSteps.find(s => s.id === 'hpt');
      if (hptStep) {
        hptStep.status = 'completed';
        hptStep.canNavigate = true;
      }
      // Habilitar siguiente paso
      const anexoStep = updatedSteps.find(s => s.id === 'anexo-bravo');
      if (anexoStep && anexoStep.status === 'pending') {
        anexoStep.status = 'active';
        anexoStep.canNavigate = true;
      }
    }

    // Anexo Bravo completado
    if (documentStatus?.anexoBravoReady) {
      const anexoStep = updatedSteps.find(s => s.id === 'anexo-bravo');
      if (anexoStep) {
        anexoStep.status = 'completed';
        anexoStep.canNavigate = true;
      }
      // Habilitar validación
      const validationStep = updatedSteps.find(s => s.id === 'validation');
      if (validationStep && validationStep.status === 'pending') {
        validationStep.status = 'active';
        validationStep.canNavigate = true;
      }
    }

    // IMPORTANTE: Permitir navegación hacia atrás a pasos completados
    updatedSteps.forEach((step, index) => {
      if (step.status === 'completed') {
        step.canNavigate = true;
      }
      // Permitir ir a paso activo actual
      if (step.status === 'active') {
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
    console.log('Attempting to go to step:', stepIndex, targetStep);
    
    if (targetStep?.canNavigate) {
      console.log('Navigation allowed, changing to step:', stepIndex);
      setCurrentStepIndex(stepIndex);
    } else {
      console.log('Navigation not allowed to step:', stepIndex, 'canNavigate:', targetStep?.canNavigate);
    }
  }, [currentSteps]);

  const nextStep = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    console.log('Next step requested. Current:', currentStepIndex, 'Next:', nextIndex);
    
    if (nextIndex < currentSteps.length) {
      const nextStepData = currentSteps[nextIndex];
      console.log('Next step data:', nextStepData);
      
      if (nextStepData?.canNavigate) {
        console.log('Moving to next step:', nextIndex);
        setCurrentStepIndex(nextIndex);
      } else {
        console.log('Cannot navigate to next step:', nextIndex, 'Step not ready');
      }
    } else {
      console.log('Already at last step');
    }
  }, [currentStepIndex, currentSteps]);

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      console.log('Moving to previous step:', prevIndex);
      setCurrentStepIndex(prevIndex);
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
