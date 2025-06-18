
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
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
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
        console.error('Error fetching operation for wizard:', error);
        throw error;
      }
      
      console.log('Operation data fetched for wizard:', data);
      return data;
    },
    enabled: !!wizardOperacionId,
    refetchInterval: 3000
  });

  // Verificar documentos en tiempo real
  const { data: documentStatus } = useQuery({
    queryKey: ['operation-documents', wizardOperacionId],
    queryFn: async () => {
      if (!wizardOperacionId) return { hptReady: false, anexoBravoReady: false };
      
      console.log('Checking document status for:', wizardOperacionId);
      
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

      const result = {
        hptReady: !!hptResult.data,
        anexoBravoReady: !!anexoResult.data
      };
      
      console.log('Document status check result:', result);
      return result;
    },
    enabled: !!wizardOperacionId,
    refetchInterval: 2000
  });

  // Auto-guardado mejorado
  const performAutoSave = useCallback(async (data: any) => {
    if (!wizardOperacionId || !data || isAutoSaving) return;

    try {
      setIsAutoSaving(true);
      console.log('Starting auto-save for operation:', wizardOperacionId, data);
      
      // Filtrar valores vacíos y especiales
      const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== '' && value !== null && value !== undefined && value !== '__empty__') {
          acc[key] = value === '__empty__' ? null : value;
        }
        return acc;
      }, {} as any);

      if (Object.keys(cleanData).length === 0) {
        console.log('No data to save');
        return;
      }

      const { error } = await supabase
        .from('operacion')
        .update(cleanData)
        .eq('id', wizardOperacionId);

      if (error) {
        console.error('Auto-save error:', error);
        throw error;
      }

      setLastSaveTime(new Date());
      console.log('Auto-save successful:', cleanData);
      
      // Actualizar cache
      queryClient.invalidateQueries({ queryKey: ['operacion-wizard', wizardOperacionId] });
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      
    } catch (error) {
      console.error('Error en auto-guardado:', error);
      toast({
        title: "Error de guardado",
        description: "No se pudo guardar automáticamente los cambios",
        variant: "destructive",
      });
    } finally {
      setIsAutoSaving(false);
    }
  }, [wizardOperacionId, isAutoSaving, queryClient]);

  // Trigger auto-guardado con debounce
  const triggerAutoSave = useCallback((data: any) => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    const timer = setTimeout(() => {
      performAutoSave(data);
    }, 2000);

    setAutoSaveTimer(timer);
  }, [performAutoSave, autoSaveTimer]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [autoSaveTimer]);

  // Calcular estado de los pasos dinámicamente
  const calculateStepsStatus = useCallback(() => {
    if (!operacion) return steps;

    const updatedSteps = [...steps];
    let foundFirstIncomplete = false;
    
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
    } else if (!foundFirstIncomplete) {
      const sitioStep = updatedSteps.find(s => s.id === 'sitio');
      if (sitioStep) {
        sitioStep.status = 'active';
        sitioStep.canNavigate = true;
        foundFirstIncomplete = true;
      }
    }

    // Equipo y supervisor asignados
    if (operacion.equipo_buceo_id && operacion.supervisor_asignado_id) {
      const equipoStep = updatedSteps.find(s => s.id === 'equipo');
      if (equipoStep) {
        equipoStep.status = 'completed';
        equipoStep.canNavigate = true;
      }
    } else if (!foundFirstIncomplete && operacion.sitio_id) {
      const equipoStep = updatedSteps.find(s => s.id === 'equipo');
      if (equipoStep) {
        equipoStep.status = 'active';
        equipoStep.canNavigate = true;
        foundFirstIncomplete = true;
      }
    }

    // HPT completado
    if (documentStatus?.hptReady) {
      const hptStep = updatedSteps.find(s => s.id === 'hpt');
      if (hptStep) {
        hptStep.status = 'completed';
        hptStep.canNavigate = true;
      }
    } else if (!foundFirstIncomplete && operacion.equipo_buceo_id && operacion.supervisor_asignado_id) {
      const hptStep = updatedSteps.find(s => s.id === 'hpt');
      if (hptStep) {
        hptStep.status = 'active';
        hptStep.canNavigate = true;
        foundFirstIncomplete = true;
      }
    }

    // Anexo Bravo completado
    if (documentStatus?.anexoBravoReady) {
      const anexoStep = updatedSteps.find(s => s.id === 'anexo-bravo');
      if (anexoStep) {
        anexoStep.status = 'completed';
        anexoStep.canNavigate = true;
      }
    } else if (!foundFirstIncomplete && documentStatus?.hptReady) {
      const anexoStep = updatedSteps.find(s => s.id === 'anexo-bravo');
      if (anexoStep) {
        anexoStep.status = 'active';
        anexoStep.canNavigate = true;
        foundFirstIncomplete = true;
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

    return updatedSteps;
  }, [operacion, documentStatus, wizardOperacionId, steps]);

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
      console.log('Navigating to step:', stepIndex, targetStep.title);
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
        console.log('Moving to next step:', nextIndex);
        setCurrentStepIndex(nextIndex);
      }
    }
  }, [currentStepIndex, currentSteps]);

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      console.log('Moving to previous step:', currentStepIndex - 1);
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const completeStep = useCallback((stepId: string, data: any) => {
    console.log('Completing step:', stepId, data);
    
    setStepData(prev => ({
      ...prev,
      [stepId]: data
    }));

    // Si es el paso de operación, guardar el ID
    if (stepId === 'operacion' && data.operacionId) {
      setWizardOperacionId(data.operacionId);
    }

    // Trigger auto-guardado para otros datos
    if (stepId !== 'operacion' && data) {
      triggerAutoSave(data);
    }

    // Refrescar queries para actualizar estado
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['operacion-wizard'] });
      queryClient.invalidateQueries({ queryKey: ['operation-documents'] });
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
    }, 500);

    // Avanzar al siguiente paso automáticamente si no estamos en el último
    if (currentStepIndex < currentSteps.length - 1) {
      setTimeout(() => {
        nextStep();
      }, 1000);
    }
  }, [currentStepIndex, currentSteps.length, nextStep, queryClient, triggerAutoSave]);

  // Actualizar operacionId cuando cambie el prop
  useEffect(() => {
    if (operacionId && operacionId !== wizardOperacionId) {
      console.log('Updating wizard operation ID:', operacionId);
      setWizardOperacionId(operacionId);
    }
  }, [operacionId, wizardOperacionId]);

  // Auto-navegar al primer paso incompleto al cargar
  useEffect(() => {
    if (!isLoading && currentSteps.length > 0 && wizardOperacionId) {
      const firstIncompleteIndex = currentSteps.findIndex(s => s.status === 'active');
      if (firstIncompleteIndex !== -1 && firstIncompleteIndex !== currentStepIndex) {
        console.log('Auto-navigating to first incomplete step:', firstIncompleteIndex);
        setCurrentStepIndex(firstIncompleteIndex);
      }
    }
  }, [isLoading, currentSteps, currentStepIndex, wizardOperacionId]);

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
    isAutoSaving,
    lastSaveTime,
    goToStep,
    nextStep,
    previousStep,
    completeStep,
    refetch,
    triggerAutoSave
  };
};
