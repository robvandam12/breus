
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  required: boolean;
  data?: any;
}

export const useOperationWizardState = (operacionId?: string) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepData, setStepData] = useState<Record<string, any>>({});
  const [persistedOperacionId, setPersistedOperacionId] = useState<string | undefined>(operacionId);

  const steps: WizardStep[] = [
    {
      id: 'operacion',
      title: 'Operación',
      description: 'Crear operación básica',
      status: persistedOperacionId ? 'completed' : 'active',
      required: true
    },
    {
      id: 'sitio',
      title: 'Sitio',
      description: 'Asignar sitio de trabajo',
      status: 'pending',
      required: true
    },
    {
      id: 'equipo',
      title: 'Equipo',
      description: 'Asignar equipo de buceo y supervisor',
      status: 'pending',
      required: true
    },
    {
      id: 'hpt',
      title: 'HPT',
      description: 'Completar Herramientas y Procedimientos',
      status: 'pending',
      required: true
    },
    {
      id: 'anexo-bravo',
      title: 'Anexo Bravo',
      description: 'Completar análisis de seguridad',
      status: 'pending',
      required: true
    },
    {
      id: 'validation',
      title: 'Validación',
      description: 'Validar completitud de la operación',
      status: 'pending',
      required: true
    }
  ];

  const { data: operacion, isLoading, refetch } = useQuery({
    queryKey: ['operacion-wizard', persistedOperacionId],
    queryFn: async () => {
      if (!persistedOperacionId) return null;
      
      const { data, error } = await supabase
        .from('operacion')
        .select(`
          *,
          sitios:sitio_id(nombre, codigo),
          equipos_buceo:equipo_buceo_id(nombre),
          usuario_supervisor:supervisor_asignado_id(nombre, apellido)
        `)
        .eq('id', persistedOperacionId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!persistedOperacionId
  });

  // Función para verificar documentos
  const checkDocuments = useCallback(async () => {
    if (!persistedOperacionId) return;

    try {
      const [hptResult, anexoResult] = await Promise.all([
        supabase.from('hpt').select('*').eq('operacion_id', persistedOperacionId).eq('firmado', true).maybeSingle(),
        supabase.from('anexo_bravo').select('*').eq('operacion_id', persistedOperacionId).eq('firmado', true).maybeSingle()
      ]);

      const updatedSteps = [...steps];
      
      // Actualizar estado de los pasos basado en la operación actual
      if (operacion?.sitio_id) {
        const sitioStep = updatedSteps.find(s => s.id === 'sitio');
        if (sitioStep) sitioStep.status = 'completed';
      }

      if (operacion?.equipo_buceo_id && operacion?.supervisor_asignado_id) {
        const equipoStep = updatedSteps.find(s => s.id === 'equipo');
        if (equipoStep) equipoStep.status = 'completed';
      }

      if (hptResult.data) {
        const hptStep = updatedSteps.find(s => s.id === 'hpt');
        if (hptStep) hptStep.status = 'completed';
      }

      if (anexoResult.data) {
        const anexoStep = updatedSteps.find(s => s.id === 'anexo-bravo');
        if (anexoStep) anexoStep.status = 'completed';
      }

      const allPrevCompleted = updatedSteps.slice(0, -1).every(s => s.status === 'completed');
      if (allPrevCompleted) {
        const validationStep = updatedSteps.find(s => s.id === 'validation');
        if (validationStep) validationStep.status = 'active';
      }

      return updatedSteps;
    } catch (error) {
      console.error('Error checking documents:', error);
      return steps;
    }
  }, [persistedOperacionId, operacion]);

  useEffect(() => {
    if (operacion) {
      checkDocuments();
    }
  }, [operacion, checkDocuments]);

  const currentStep = steps[currentStepIndex];
  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const progress = (completedSteps / steps.length) * 100;
  const canFinish = steps.every(s => !s.required || s.status === 'completed');

  const goToStep = useCallback((stepIndex: number) => {
    setCurrentStepIndex(stepIndex);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [currentStepIndex, steps.length]);

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const completeStep = useCallback((stepId: string, data: any) => {
    setStepData(prev => ({
      ...prev,
      [stepId]: data
    }));

    if (stepId === 'operacion' && data.operacionId) {
      setPersistedOperacionId(data.operacionId);
    }

    const stepIndex = steps.findIndex(s => s.id === stepId);
    if (stepIndex !== -1) {
      steps[stepIndex].status = 'completed';
      steps[stepIndex].data = data;
    }

    // Auto-advance to next step if not at the end
    if (stepIndex < steps.length - 1) {
      const nextStepIndex = stepIndex + 1;
      steps[nextStepIndex].status = 'active';
      setCurrentStepIndex(nextStepIndex);
    }
  }, [steps]);

  return {
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
  };
};
