
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useWizardSteps } from './useWizardSteps';
import { useWizardAutoSave } from './useWizardAutoSave';

export const useOperationWizardState = (operacionId?: string) => {
  const [stepData, setStepData] = useState<Record<string, any>>({});
  const [wizardOperacionId, setWizardOperacionId] = useState<string | undefined>(operacionId);
  const queryClient = useQueryClient();

  // Obtener datos de la operación
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

  // Verificar documentos
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

  // Usar hooks separados - CORREGIDO: useWizardSteps en lugar de use WizardSteps
  const {
    steps,
    currentStep,
    currentStepIndex,
    progress,
    canFinish,
    goToStep,
    nextStep,
    previousStep,
    setCurrentStepIndex
  } = useWizardSteps(operacion, documentStatus, wizardOperacionId);

  const { isAutoSaving, lastSaveTime, triggerAutoSave } = useWizardAutoSave(wizardOperacionId);

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
    queryClient.invalidateQueries({ queryKey: ['operacion-wizard'] });
    queryClient.invalidateQueries({ queryKey: ['operation-documents'] });
    queryClient.invalidateQueries({ queryKey: ['operaciones'] });

    // Avanzar al siguiente paso automáticamente después de completar
    setTimeout(() => {
      console.log('Auto-advancing to next step after completion');
      nextStep();
    }, 1500);
    
  }, [nextStep, queryClient, triggerAutoSave]);

  // Actualizar operacionId cuando cambie el prop
  useEffect(() => {
    if (operacionId && operacionId !== wizardOperacionId) {
      console.log('Updating wizard operation ID:', operacionId);
      setWizardOperacionId(operacionId);
    }
  }, [operacionId, wizardOperacionId]);

  // Auto-navegar al primer paso incompleto al cargar
  useEffect(() => {
    if (!isLoading && steps.length > 0 && wizardOperacionId) {
      const firstIncompleteIndex = steps.findIndex(s => s.status === 'active');
      if (firstIncompleteIndex !== -1 && firstIncompleteIndex !== currentStepIndex) {
        console.log('Auto-navigating to first incomplete step:', firstIncompleteIndex);
        setCurrentStepIndex(firstIncompleteIndex);
      }
    }
  }, [isLoading, steps, currentStepIndex, wizardOperacionId, setCurrentStepIndex]);

  return {
    steps,
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
