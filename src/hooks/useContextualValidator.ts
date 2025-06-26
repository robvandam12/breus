
import { useQuery } from '@tanstack/react-query';
import { useValidationState } from './validation/useValidationState';
import { useOperationSuggestions } from './validation/useOperationSuggestions';
import { useOperationValidator } from './validation/useOperationValidator';

export const useContextualValidator = (operationId?: string) => {
  const {
    validationState,
    warnings,
    errors,
    userContext,
    profile
  } = useValidationState();

  const { getOperationSuggestions } = useOperationSuggestions();
  const { validateForInmersion, isValidating } = useOperationValidator();

  // Obtener contexto operacional
  const { refetch: refreshContext } = useQuery({
    queryKey: ['operational-context', profile?.salmonera_id || profile?.servicio_id],
    queryFn: async () => {
      if (!profile) return null;
      return {
        hasPlanning: validationState.hasPlanning,
        isContratista: userContext.isContratista,
        isSalmonera: userContext.isSalmonera,
        canCreateOperations: userContext.canCreateOperations,
        requiresDocuments: validationState.requiresDocuments
      };
    },
    enabled: !!profile
  });

  // Propiedades directas que los componentes esperan
  const isValid = validationState.isValid && errors.length === 0;
  const canProceed = isValid && validationState.canCreateIndependent;
  const moduleActive = validationState.hasPlanning;
  const requiereDocumentos = validationState.requiresDocuments;

  // Wrapper para validateForInmersion con contexto
  const validateForInmersionWithContext = (operationId: string) => {
    return validateForInmersion(operationId, validationState.requiresDocuments);
  };

  return {
    validationState,
    validateForInmersion: validateForInmersionWithContext,
    getOperationSuggestions,
    refresh: refreshContext,
    
    // Propiedades directas esperadas por los componentes
    isValid,
    canProceed,
    moduleActive,
    warnings,
    errors,
    isValidating,
    requiereDocumentos,
    
    // Helpers contextuales
    shouldShowPlanningOption: validationState.hasPlanning,
    shouldShowIndependentOption: validationState.canCreateIndependent,
    isPlannedOnly: validationState.contextType === 'planned',
    isIndependentOnly: validationState.contextType === 'independent',
    isMixedMode: validationState.contextType === 'mixed',
    isOperativaDirecta: !validationState.hasPlanning || userContext.isContratista,
    
    // Mensajes contextuales
    getContextMessage: () => {
      if (userContext.isContratista && validationState.hasPlanning) {
        return 'Puedes asociar inmersiones a operaciones planificadas o crear inmersiones independientes';
      }
      if (userContext.isContratista && !validationState.hasPlanning) {
        return 'Crea inmersiones independientes con código de operación externa';
      }
      if (userContext.isSalmonera && validationState.hasPlanning) {
        return 'Gestiona operaciones planificadas o crea inmersiones directas';
      }
      return 'Crea inmersiones según las necesidades operativas';
    },
    
    // Estados específicos
    canAssociateToOperations: validationState.hasPlanning,
    requiresOperationCode: userContext.isContratista
  };
};
