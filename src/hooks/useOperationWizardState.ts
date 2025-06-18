
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  required: boolean;
  data?: any;
  canNavigate?: boolean;
}

export const useOperationWizardState = (operacionId?: string) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepData, setStepData] = useState<Record<string, any>>({});
  const [wizardOperacionId, setWizardOperacionId] = useState<string | undefined>(operacionId);
  const queryClient = useQueryClient();

  const steps: WizardStep[] = [
    {
      id: 'operacion',
      title: 'Operación',
      description: 'Crear operación básica',
      status: wizardOperacionId ? 'completed' : 'active',
      required: true,
      canNavigate: true
    },
    {
      id: 'sitio',
      title: 'Sitio',
      description: 'Asignar sitio de trabajo',
      status: 'pending',
      required: true,
      canNavigate: false
    },
    {
      id: 'equipo',
      title: 'Equipo',
      description: 'Asignar equipo de buceo y supervisor',
      status: 'pending',
      required: true,
      canNavigate: false
    },
    {
      id: 'hpt',
      title: 'HPT',
      description: 'Completar Herramientas y Procedimientos',
      status: 'pending',
      required: true,
      canNavigate: false
    },
    {
      id: 'anexo-bravo',
      title: 'Anexo Bravo',
      description: 'Completar análisis de seguridad',
      status: 'pending',
      required: true,
      canNavigate: false
    },
    {
      id: 'validation',
      title: 'Validación',
      description: 'Validar completitud de la operación',
      status: 'pending',
      required: true,
      canNavigate: false
    }
  ];

  // Obtener datos de la operación en tiempo real
  const { data: operacion, isLoading, refetch } = useQuery({
    queryKey: ['operacion-wizard', wizardOperacionId],
    queryFn: async () => {
      if (!wizardOperacionId) return null;
      
      const { data, error } = await supabase
        .from('operacion')
        .select(`
          *,
          sitios:sitio_id(nombre, codigo),
          equipos_buceo:equipo_buceo_id(nombre),
          usuario_supervisor:supervisor_asignado_id(nombre, apellido)
        `)
        .eq('id', wizardOperacionId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!wizardOperacionId,
    refetchInterval: 3000 // Refrescar cada 3 segundos para estado en tiempo real
  });

  // Verificar documentos en tiempo real
  const { data: documentStatus } = useQuery({
    queryKey: ['operation-documents', wizardOperacionId],
    queryFn: async () => {
      if (!wizardOperacionId) return { hptReady: false, anexoBravoReady: false };
      
      const [hptResult, anexoResult] = await Promise.all([
        supabase.from('hpt').select('id, firmado').eq('operacion_id', wizardOperacionId).eq('firmado', true).maybeSingle(),
        supabase.from('anexo_bravo').select('id, firmado').eq('operacion_id', wizardOperacionId).eq('firmado', true).maybeSingle()
      ]);

      return {
        hptReady: !!hptResult.data,
        anexoBravoReady: !!anexoResult.data
      };
    },
    enabled: !!wizardOperacionId,
    refetchInterval: 2000 // Refrescar documentos frecuentemente
  });

  // Calcular estado de los pasos dinámicamente
  const calculateStepsStatus = useCallback(() => {
    if (!operacion) return steps;

    const updatedSteps = [...steps];
    
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
    }

    // Equipo y supervisor asignados
    if (operacion.equipo_buceo_id && operacion.supervisor_asignado_id) {
      const equipoStep = updatedSteps.find(s => s.id === 'equipo');
      if (equipoStep) {
        equipoStep.status = 'completed';
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
    }

    // Anexo Bravo completado
    if (documentStatus?.anexoBravoReady) {
      const anexoStep = updatedSteps.find(s => s.id === 'anexo-bravo');
      if (anexoStep) {
        anexoStep.status = 'completed';
        anexoStep.canNavigate = true;
      }
    }

    // Validación - si todos los anteriores están completos
    const allPrevCompleted = updatedSteps.slice(0, -1).every(s => s.status === 'completed');
    if (allPrevCompleted) {
      const validationStep = updatedSteps.find(s => s.id === 'validation');
      if (validationStep) {
        validationStep.status = 'active';
        validationStep.canNavigate = true;
      }
    }

    // Marcar próximo paso disponible como activo
    const firstIncomplete = updatedSteps.find(s => s.status === 'pending');
    if (firstIncomplete) {
      firstIncomplete.status = 'active';
      firstIncomplete.canNavigate = true;
    }

    return updatedSteps;
  }, [operacion, documentStatus, wizardOperacionId]);

  const currentSteps = calculateStepsStatus();
  const currentStep = currentSteps[currentStepIndex];

  // Calcular progreso dinámico
  const completedSteps = currentSteps.filter(s => s.status === 'completed').length;
  const progress = (completedSteps / currentSteps.length) * 100;

  // Verificar si se puede finalizar
  const canFinish = currentSteps.every(s => !s.required || s.status === 'completed');

  const goToStep = useCallback((stepIndex: number) => {
    const targetStep = currentSteps[stepIndex];
    if (targetStep?.canNavigate || targetStep?.status === 'completed') {
      setCurrentStepIndex(stepIndex);
    } else {
      toast({
        title: "Paso no disponible",
        description: "Complete los pasos anteriores para acceder a este paso.",
        variant: "destructive"
      });
    }
  }, [currentSteps]);

  const nextStep = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < currentSteps.length) {
      const nextStepData = currentSteps[nextIndex];
      if (nextStepData?.canNavigate || nextStepData?.status === 'completed') {
        setCurrentStepIndex(nextIndex);
      }
    }
  }, [currentStepIndex, currentSteps]);

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

    // Si es el paso de operación, guardar el ID
    if (stepId === 'operacion' && data.operacionId) {
      setWizardOperacionId(data.operacionId);
    }

    // Refrescar queries para actualizar estado
    queryClient.invalidateQueries({ queryKey: ['operacion-wizard'] });
    queryClient.invalidateQueries({ queryKey: ['operation-documents'] });
    queryClient.invalidateQueries({ queryKey: ['operaciones'] });

    // Avanzar al siguiente paso automáticamente si no estamos en el último
    if (currentStepIndex < currentSteps.length - 1) {
      setTimeout(() => {
        nextStep();
      }, 500);
    }
  }, [currentStepIndex, currentSteps.length, nextStep, queryClient]);

  // Actualizar operacionId cuando cambie el prop
  useEffect(() => {
    if (operacionId && operacionId !== wizardOperacionId) {
      setWizardOperacionId(operacionId);
    }
  }, [operacionId, wizardOperacionId]);

  // Auto-navegar al primer paso incompleto al cargar
  useEffect(() => {
    if (!isLoading && currentSteps.length > 0) {
      const firstIncompleteIndex = currentSteps.findIndex(s => s.status === 'active' || s.status === 'pending');
      if (firstIncompleteIndex !== -1 && firstIncompleteIndex !== currentStepIndex) {
        setCurrentStepIndex(firstIncompleteIndex);
      }
    }
  }, [isLoading, currentSteps, currentStepIndex]);

  return {
    steps: currentSteps,
    currentStep,
    currentStepIndex,
    progress,
    canFinish,
    operacion,
    operacionId: wizardOperacionId,
    isLoading,
    stepData,
    goToStep,
    nextStep,
    previousStep,
    completeStep,
    refetch
  };
};
