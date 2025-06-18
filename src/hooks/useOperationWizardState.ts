
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
  
  // MEJORA: Estado mejorado de auto-guardado
  const [autoSaveState, setAutoSaveState] = useState<{
    status: 'idle' | 'saving' | 'saved' | 'error';
    lastSaved?: Date;
    timer?: NodeJS.Timeout;
    retryCount: number;
  }>({
    status: 'idle',
    retryCount: 0
  });
  
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
      
      console.log('Fetching operation data for wizard:', wizardOperacionId);
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

      if (error) {
        console.error('Error fetching operation:', error);
        throw error;
      }
      
      console.log('Operation data fetched:', data);
      return data;
    },
    enabled: !!wizardOperacionId,
    refetchInterval: 3000
  });

  // MEJORA: Verificar documentos en tiempo real con manejo robusto de errores
  const { data: documentStatus } = useQuery({
    queryKey: ['operation-documents', wizardOperacionId],
    queryFn: async () => {
      if (!wizardOperacionId) return { hptReady: false, anexoBravoReady: false };
      
      console.log('Checking document status for operation:', wizardOperacionId);
      
      try {
        const [hptResult, anexoResult] = await Promise.all([
          supabase
            .from('hpt')
            .select('id, firmado')
            .eq('operacion_id', wizardOperacionId)
            .eq('firmado', true)
            .maybeSingle(),
          
          supabase
            .from('anexo_bravo')
            .select('id, firmado')
            .eq('operacion_id', wizardOperacionId)
            .eq('firmado', true)
            .maybeSingle()
        ]);

        // Verificar errores reales (no PGRST116)
        if (hptResult.error && hptResult.error.code !== 'PGRST116') {
          console.error('Error checking HPT:', hptResult.error);
          throw hptResult.error;
        }

        if (anexoResult.error && anexoResult.error.code !== 'PGRST116') {
          console.error('Error checking Anexo Bravo:', anexoResult.error);
          throw anexoResult.error;
        }

        const hptReady = !!hptResult.data;
        const anexoBravoReady = !!anexoResult.data;
        
        console.log('Document status:', { hptReady, anexoBravoReady });

        return { hptReady, anexoBravoReady };
      } catch (error) {
        console.error('Error checking documents:', error);
        return { hptReady: false, anexoBravoReady: false };
      }
    },
    enabled: !!wizardOperacionId,
    refetchInterval: 2000
  });

  // MEJORA: Auto-guardado mejorado con retry y manejo de errores
  const autoSave = useCallback(async (data: any) => {
    if (!wizardOperacionId || !data) return;

    try {
      setAutoSaveState(prev => ({ ...prev, status: 'saving' }));
      
      // Limpiar valores vacíos y __empty__
      const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== '' && value !== null && value !== undefined && value !== '__empty__') {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      if (Object.keys(cleanData).length === 0) {
        setAutoSaveState(prev => ({ ...prev, status: 'idle' }));
        return;
      }

      console.log('Auto-saving operation data:', cleanData);

      const { error } = await supabase
        .from('operacion')
        .update(cleanData)
        .eq('id', wizardOperacionId);

      if (error) {
        console.error('Auto-save error:', error);
        throw error;
      }

      setAutoSaveState({
        status: 'saved',
        lastSaved: new Date(),
        retryCount: 0,
        timer: undefined
      });

      // Cambiar a idle después de 2 segundos
      setTimeout(() => {
        setAutoSaveState(prev => ({ ...prev, status: 'idle' }));
      }, 2000);

      console.log('Auto-save successful');
    } catch (error) {
      console.error('Error in auto-save:', error);
      
      setAutoSaveState(prev => ({
        ...prev,
        status: 'error',
        retryCount: prev.retryCount + 1
      }));

      // Retry automático hasta 3 intentos
      if (autoSaveState.retryCount < 3) {
        setTimeout(() => {
          autoSave(data);
        }, 1000 * (autoSaveState.retryCount + 1)); // Backoff exponencial
      } else {
        toast({
          title: "Error de guardado",
          description: "No se pudieron guardar los cambios automáticamente. Por favor, guarde manualmente.",
          variant: "destructive"
        });
      }
    }
  }, [wizardOperacionId, autoSaveState.retryCount]);

  // MEJORA: Trigger auto-guardado con debounce mejorado
  const triggerAutoSave = useCallback((data: any) => {
    // Limpiar timer anterior
    if (autoSaveState.timer) {
      clearTimeout(autoSaveState.timer);
    }

    const timer = setTimeout(() => {
      autoSave(data);
    }, 2000); // Debounce de 2 segundos

    setAutoSaveState(prev => ({ ...prev, timer }));
  }, [autoSave, autoSaveState.timer]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveState.timer) {
        clearTimeout(autoSaveState.timer);
      }
    };
  }, [autoSaveState.timer]);

  // MEJORA: Calcular estado de los pasos dinámicamente basado en datos reales
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

    // HPT completado (basado en datos reales)
    if (documentStatus?.hptReady) {
      const hptStep = updatedSteps.find(s => s.id === 'hpt');
      if (hptStep) {
        hptStep.status = 'completed';
        hptStep.canNavigate = true;
      }
    }

    // Anexo Bravo completado (basado en datos reales)
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

  // MEJORA: Calcular progreso dinámico real
  const completedSteps = currentSteps.filter(s => s.status === 'completed').length;
  const progress = (completedSteps / currentSteps.length) * 100;

  // Verificar si se puede finalizar
  const canFinish = currentSteps.every(s => !s.required || s.status === 'completed');

  const goToStep = useCallback((stepIndex: number) => {
    const targetStep = currentSteps[stepIndex];
    if (targetStep?.canNavigate || targetStep?.status === 'completed') {
      setCurrentStepIndex(stepIndex);
      console.log('Navigated to step:', targetStep.id);
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
        console.log('Advanced to next step:', nextStepData.id);
      }
    }
  }, [currentStepIndex, currentSteps]);

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      console.log('Moved to previous step');
    }
  }, [currentStepIndex]);

  const completeStep = useCallback((stepId: string, data: any) => {
    console.log('Completing step:', stepId, 'with data:', data);
    
    setStepData(prev => ({
      ...prev,
      [stepId]: data
    }));

    // Si es el paso de operación, guardar el ID
    if (stepId === 'operacion' && data.operacionId) {
      setWizardOperacionId(data.operacionId);
      console.log('Operation ID set:', data.operacionId);
    }

    // Trigger auto-guardado para otros datos
    if (stepId !== 'operacion' && data) {
      triggerAutoSave(data);
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
  }, [currentStepIndex, currentSteps.length, nextStep, queryClient, triggerAutoSave]);

  // Actualizar operacionId cuando cambie el prop
  useEffect(() => {
    if (operacionId && operacionId !== wizardOperacionId) {
      setWizardOperacionId(operacionId);
      console.log('Operation ID updated from prop:', operacionId);
    }
  }, [operacionId, wizardOperacionId]);

  // Auto-navegar al primer paso incompleto al cargar
  useEffect(() => {
    if (!isLoading && currentSteps.length > 0) {
      const firstIncompleteIndex = currentSteps.findIndex(s => s.status === 'active' || s.status === 'pending');
      if (firstIncompleteIndex !== -1 && firstIncompleteIndex !== currentStepIndex) {
        setCurrentStepIndex(firstIncompleteIndex);
        console.log('Auto-navigated to first incomplete step:', firstIncompleteIndex);
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
    autoSaveState, // NUEVO: Exponer estado de auto-guardado
    goToStep,
    nextStep,
    previousStep,
    completeStep,
    refetch,
    triggerAutoSave
  };
};
