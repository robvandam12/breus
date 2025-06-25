
import { useState } from 'react';
import { useInmersiones } from './useInmersiones';
import { useOperationalFlow } from '@/contexts/OperationalFlowContext';
import { toast } from '@/hooks/use-toast';

export const useUnifiedInmersions = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { createInmersion } = useInmersiones();
  const { 
    operationalMode, 
    validateOperationFlow,
    canCreateDirectImmersion 
  } = useOperationalFlow();

  const createUnifiedImmersion = async (immersionData: any) => {
    setIsCreating(true);
    
    try {
      // Validar contexto antes de crear
      const validation = validateOperationFlow('create_immersion');
      
      if (!validation.canProceed) {
        throw new Error(`No se puede crear la inmersión: ${validation.missingRequirements.join(', ')}`);
      }

      // Enriquecer datos según el contexto operativo
      const enrichedData = {
        ...immersionData,
        context_type: operationalMode,
        is_independent: !immersionData.operacion_id,
        requires_validation: operationalMode === 'full_planning',
        empresa_creadora_tipo: operationalMode === 'full_planning' ? 'salmonera' : 'contratista'
      };

      // Crear la inmersión
      const result = await createInmersion(enrichedData);

      // Mostrar mensaje contextual
      const successMessage = operationalMode === 'direct_immersion' 
        ? 'Inmersión directa creada exitosamente. Las bitácoras se generarán automáticamente.'
        : 'Inmersión creada exitosamente dentro de la operación planificada.';

      toast({
        title: "Inmersión creada",
        description: successMessage,
      });

      return result;
    } catch (error: any) {
      console.error('Error creating unified immersion:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la inmersión.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const getContextualRequirements = (operationType: string) => {
    const validation = validateOperationFlow(operationType);
    return {
      requirements: validation.missingRequirements,
      warnings: validation.warnings,
      nextSteps: validation.nextSteps,
      canProceed: validation.canProceed
    };
  };

  return {
    createUnifiedImmersion,
    isCreating,
    operationalMode,
    canCreateDirectImmersion: canCreateDirectImmersion(),
    getContextualRequirements
  };
};
