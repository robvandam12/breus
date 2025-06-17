
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'pending' | 'error';
  required: boolean;
  data?: any;
}

export const useOperationWizardState = (operacionId?: string) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [wizardData, setWizardData] = useState<any>({});
  const queryClient = useQueryClient();

  // Cargar datos de la operación
  const { data: operacion, isLoading: loadingOperacion } = useQuery({
    queryKey: ['operacion', operacionId],
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

  // Validar documentos
  const { data: validationData, isLoading: loadingValidation } = useQuery({
    queryKey: ['validation', operacionId],
    queryFn: async () => {
      if (!operacionId) return null;

      const [hptResult, anexoResult] = await Promise.all([
        supabase.from('hpt').select('id, firmado').eq('operacion_id', operacionId).single(),
        supabase.from('anexo_bravo').select('id, firmado').eq('operacion_id', operacionId).single()
      ]);

      return {
        hptExists: !hptResult.error,
        hptSigned: hptResult.data?.firmado || false,
        anexoExists: !anexoResult.error,
        anexoSigned: anexoResult.data?.firmado || false
      };
    },
    enabled: !!operacionId
  });

  // Calcular estados de los pasos
  const calculateStepStatuses = (): WizardStep[] => {
    if (!operacion || !validationData) {
      return [
        { id: 'operacion', title: 'Crear Operación', description: 'Información básica', status: 'active', required: true },
        { id: 'sitio', title: 'Definir Sitio', description: 'Ubicación', status: 'pending', required: true },
        { id: 'equipo', title: 'Asignar Equipo', description: 'Personal', status: 'pending', required: true },
        { id: 'hpt', title: 'HPT', description: 'Herramientas y Procedimientos', status: 'pending', required: true },
        { id: 'anexo-bravo', title: 'Anexo Bravo', description: 'Seguridad', status: 'pending', required: true },
        { id: 'validation', title: 'Validación', description: 'Verificar completitud', status: 'pending', required: true }
      ];
    }

    return [
      {
        id: 'operacion',
        title: 'Crear Operación',
        description: 'Información básica de la operación',
        status: 'completed',
        required: true,
        data: operacion
      },
      {
        id: 'sitio',
        title: 'Definir Sitio',
        description: 'Ubicación y coordenadas',
        status: operacion.sitio_id ? 'completed' : 'pending',
        required: true,
        data: { sitioId: operacion.sitio_id, sitio: operacion.sitios }
      },
      {
        id: 'equipo',
        title: 'Asignar Equipo',
        description: 'Personal y roles',
        status: (operacion.equipo_buceo_id && operacion.supervisor_asignado_id) ? 'completed' : 'pending',
        required: true,
        data: {
          equipoId: operacion.equipo_buceo_id,
          supervisorId: operacion.supervisor_asignado_id,
          equipo: operacion.equipos_buceo,
          supervisor: operacion.usuario_supervisor
        }
      },
      {
        id: 'hpt',
        title: 'HPT',
        description: 'Herramientas y Procedimientos',
        status: validationData.hptSigned ? 'completed' : validationData.hptExists ? 'active' : 'pending',
        required: true,
        data: { exists: validationData.hptExists, signed: validationData.hptSigned }
      },
      {
        id: 'anexo-bravo',
        title: 'Anexo Bravo',
        description: 'Análisis de Seguridad',
        status: validationData.anexoSigned ? 'completed' : validationData.anexoExists ? 'active' : 'pending',
        required: true,
        data: { exists: validationData.anexoExists, signed: validationData.anexoSigned }
      },
      {
        id: 'validation',
        title: 'Validación Final',
        description: 'Verificar todo está listo',
        status: (validationData.hptSigned && validationData.anexoSigned && 
                operacion.sitio_id && operacion.equipo_buceo_id && operacion.supervisor_asignado_id) 
                ? 'completed' : 'pending',
        required: true,
        data: {
          canExecute: validationData.hptSigned && validationData.anexoSigned && 
                     operacion.sitio_id && operacion.equipo_buceo_id && operacion.supervisor_asignado_id
        }
      }
    ];
  };

  const steps = calculateStepStatuses();
  const currentStep = steps[currentStepIndex];
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const canProceed = currentStep?.status === 'completed' || 
                    (currentStep && ['active', 'pending'].includes(currentStep.status));

  // Navegación
  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStepIndex(stepIndex);
    }
  };

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  // Actualizar datos del wizard
  const updateWizardData = (stepId: string, data: any) => {
    setWizardData(prev => ({
      ...prev,
      [stepId]: data
    }));
    
    // Refetch para actualizar estados
    queryClient.invalidateQueries({ queryKey: ['operacion', operacionId] });
    queryClient.invalidateQueries({ queryKey: ['validation', operacionId] });
  };

  // Mutación para completar un paso
  const completeStepMutation = useMutation({
    mutationFn: async ({ stepId, data }: { stepId: string; data: any }) => {
      updateWizardData(stepId, data);
      
      // Auto-avanzar al siguiente paso si el actual se completó
      setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          const updatedSteps = calculateStepStatuses();
          if (updatedSteps[currentStepIndex]?.status === 'completed') {
            nextStep();
          }
        }
      }, 1000);
    },
    onSuccess: () => {
      toast({
        title: "Paso completado",
        description: "Avanzando al siguiente paso...",
      });
    }
  });

  const completeStep = (stepId: string, data: any) => {
    completeStepMutation.mutate({ stepId, data });
  };

  // Verificar si puede finalizar
  const canFinish = steps.every(step => !step.required || step.status === 'completed');

  return {
    steps,
    currentStep,
    currentStepIndex,
    completedSteps,
    totalSteps: steps.length,
    progress: (completedSteps / steps.length) * 100,
    canProceed,
    canFinish,
    wizardData,
    operacion,
    validationData,
    isLoading: loadingOperacion || loadingValidation,
    goToStep,
    nextStep,
    previousStep,
    completeStep,
    updateWizardData
  };
};
