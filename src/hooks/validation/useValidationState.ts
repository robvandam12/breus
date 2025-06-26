
import { useState, useEffect } from 'react';
import { useModularSystem } from '../useModularSystem';
import { useAuth } from '../useAuth';

interface ValidationState {
  isValid: boolean;
  hasPlanning: boolean;
  requiresDocuments: boolean;
  canCreateIndependent: boolean;
  contextType: 'planned' | 'independent' | 'mixed';
}

export const useValidationState = () => {
  const [validationState, setValidationState] = useState<ValidationState>({
    isValid: true,
    hasPlanning: false,
    requiresDocuments: false,
    canCreateIndependent: true,
    contextType: 'independent'
  });

  const [warnings, setWarnings] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const { getUserContext, hasModuleAccess, modules } = useModularSystem();
  const { profile } = useAuth();
  const userContext = getUserContext();

  useEffect(() => {
    const hasPlanning = hasModuleAccess(modules.PLANNING_OPERATIONS);
    const contextType = hasPlanning ? 
      (userContext.isContratista ? 'planned' : 'mixed') : 'independent';

    setValidationState({
      isValid: true,
      hasPlanning,
      requiresDocuments: hasPlanning && userContext.isSalmonera,
      canCreateIndependent: true,
      contextType
    });

    const newWarnings: string[] = [];
    if (userContext.isContratista && !hasPlanning) {
      newWarnings.push('Módulo de planificación no activo - Solo inmersiones independientes disponibles');
    }
    setWarnings(newWarnings);
    setErrors([]);
  }, [hasModuleAccess, modules.PLANNING_OPERATIONS, userContext]);

  return {
    validationState,
    warnings,
    errors,
    setWarnings,
    setErrors,
    userContext,
    profile
  };
};
