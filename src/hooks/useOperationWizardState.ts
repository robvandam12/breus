
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

  const steps: WizardStep[] = [
    {
      id: 'operacion',
      title: 'Operación',
      description: 'Crear operación básica',
      status: operacionId ? 'completed' : 'active',
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

  // Obtener datos de la operación
  const { data: operacion, isLoading } = useQuery({
    queryKey: ['operacion-wizard', operacionId],
    queryFn: async () => {
      if (!operacionId) return null;
      
      const { data, error } = await supabase
        .from('operacion')
        .select(`
          *,
          sitios:sitio_id(nombre, codigo),
          equipos_buceo:equipo_buceo_id(nombre),
          usuario_supervisor:supervisor_asignado_id(nombre, apellido)
        `)
        .eq('id', operacionId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!operacionId
  });

  // Calcular estado de los pasos basado en la operación actual
  useEffect(() => {
    if (!operacion) return;

    const updatedSteps = [...steps];
    
    if (operacion.sitio_id) {
      const sitioStep = updatedSteps.find(s => s.id === 'sitio');
      if (sitioStep) sitioStep.status = 'completed';
    }

    if (operacion.equipo_buceo_id && operacion.supervisor_asignado_id) {
      const equipoStep = updatedSteps.find(s => s.id === 'equipo');
      if (equipoStep) equipoStep.status = 'completed';
    }

    // Verificar HPT y Anexo Bravo
    const checkDocuments = async () => {
      const [hptResult, anexoResult] = await Promise.all([
        supabase.from('hpt').select('*').eq('operacion_id', operacionId).eq('firmado', true).maybeSingle(),
        supabase.from('anexo_bravo').select('*').eq('operacion_id', operacionId).eq('firmado', true).maybeSingle()
      ]);

      if (hptResult.data) {
        const hptStep = updatedSteps.find(s => s.id === 'hpt');
        if (hptStep) hptStep.status = 'completed';
      }

      if (anexoResult.data) {
        const anexoStep = updatedSteps.find(s => s.id === 'anexo-bravo');
        if (anexoStep) anexoStep.status = 'completed';
      }

      // Si todos los pasos anteriores están completos, marcar validación como activa
      const allPrevCompleted = updatedSteps.slice(0, -1).every(s => s.status === 'completed');
      if (allPrevCompleted) {
        const validationStep = updatedSteps.find(s => s.id === 'validation');
        if (validationStep) validationStep.status = 'active';
      }
    };

    checkDocuments();
  }, [operacion, operacionId]);

  // Encontrar el paso actual activo
  const currentStep = steps[currentStepIndex];

  // Calcular progreso
  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const progress = (completedSteps / steps.length) * 100;

  // Verificar si se puede finalizar
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

    const stepIndex = steps.findIndex(s => s.id === stepId);
    if (stepIndex !== -1) {
      steps[stepIndex].status = 'completed';
      steps[stepIndex].data = data;
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
    goToStep,
    nextStep,
    previousStep,
    completeStep
  };
};
