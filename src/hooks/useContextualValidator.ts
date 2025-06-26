
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useModularSystem } from './useModularSystem';
import { useAuth } from './useAuth';

interface ValidationState {
  isValid: boolean;
  hasPlanning: boolean;
  requiresDocuments: boolean;
  canCreateIndependent: boolean;
  contextType: 'planned' | 'independent' | 'mixed';
}

interface ValidationResult {
  success: boolean;
  isValid: boolean;
  message: string;
  suggestions?: string[];
  nextStep?: string;
}

export const useContextualValidator = (operationId?: string) => {
  const [validationState, setValidationState] = useState<ValidationState>({
    isValid: true,
    hasPlanning: false,
    requiresDocuments: false,
    canCreateIndependent: true,
    contextType: 'independent'
  });

  const [warnings, setWarnings] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const { getUserContext, hasModuleAccess, modules } = useModularSystem();
  const { profile } = useAuth();
  const userContext = getUserContext();

  // Obtener contexto operacional
  const { data: operationalContext, refetch: refreshContext } = useQuery({
    queryKey: ['operational-context', profile?.salmonera_id || profile?.servicio_id],
    queryFn: async () => {
      if (!profile) return null;

      const context = {
        hasPlanning: hasModuleAccess(modules.PLANNING_OPERATIONS),
        isContratista: userContext.isContratista,
        isSalmonera: userContext.isSalmonera,
        canCreateOperations: userContext.canCreateOperations,
        requiresDocuments: hasModuleAccess(modules.PLANNING_OPERATIONS) && userContext.isSalmonera
      };

      return context;
    },
    enabled: !!profile
  });

  // Actualizar estado de validación
  useEffect(() => {
    if (operationalContext) {
      const contextType = operationalContext.hasPlanning ? 
        (operationalContext.isContratista ? 'planned' : 'mixed') : 'independent';

      setValidationState({
        isValid: true,
        hasPlanning: operationalContext.hasPlanning,
        requiresDocuments: operationalContext.requiresDocuments,
        canCreateIndependent: true, // Core siempre disponible
        contextType
      });

      // Actualizar warnings según contexto
      const newWarnings: string[] = [];
      if (userContext.isContratista && !operationalContext.hasPlanning) {
        newWarnings.push('Módulo de planificación no activo - Solo inmersiones independientes disponibles');
      }
      setWarnings(newWarnings);
      setErrors([]);
    }
  }, [operationalContext, userContext]);

  // Validar para inmersión específica
  const validateForInmersion = async (operationId: string): Promise<ValidationResult> => {
    if (!operationalContext) {
      return {
        success: false,
        isValid: false,
        message: 'Contexto operacional no disponible'
      };
    }

    setIsValidating(true);
    try {
      // Verificar si la operación existe y está disponible
      const { data: operation } = await supabase
        .from('operacion')
        .select('id, nombre, codigo, estado')
        .eq('id', operationId)
        .single();

      if (!operation) {
        return {
          success: false,
          isValid: false,
          message: 'Operación no encontrada',
          nextStep: 'Crear inmersión independiente'
        };
      }

      if (operation.estado !== 'activa') {
        return {
          success: false,
          isValid: false,
          message: `La operación ${operation.codigo} no está activa`,
          nextStep: 'Seleccionar operación activa'
        };
      }

      // Verificar documentos requeridos si aplica
      if (operationalContext.requiresDocuments) {
        const { data: hpt } = await supabase
          .from('hpt')
          .select('id, firmado')
          .eq('operacion_id', operationId)
          .eq('firmado', true)
          .maybeSingle();

        const { data: anexo } = await supabase
          .from('anexo_bravo')
          .select('id, firmado')
          .eq('operacion_id', operationId)
          .eq('firmado', true)
          .maybeSingle();

        if (!hpt || !anexo) {
          return {
            success: false,
            isValid: false,
            message: 'Operación requiere HPT y Anexo Bravo firmados',
            suggestions: ['Completar documentos requeridos', 'Crear inmersión independiente']
          };
        }
      }

      return {
        success: true,
        isValid: true,
        message: `Inmersión puede asociarse a ${operation.codigo}`,
        nextStep: 'Proceder con inmersión planificada'
      };

    } catch (error) {
      console.error('Error validating operation:', error);
      return {
        success: false,
        isValid: false,
        message: 'Error en validación',
        nextStep: 'Reintentar o crear inmersión independiente'
      };
    } finally {
      setIsValidating(false);
    }
  };

  // Obtener sugerencias para códigos de operación
  const getOperationSuggestions = async (query: string): Promise<string[]> => {
    if (query.length < 2) return [];

    try {
      const { data: operations } = await supabase
        .from('operacion')
        .select('codigo, nombre')
        .eq('estado', 'activa')
        .ilike('codigo', `%${query}%`)
        .limit(5);

      return operations?.map(op => `${op.codigo} - ${op.nombre}`) || [];
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  };

  // Propiedades directas que los componentes esperan
  const isValid = validationState.isValid && errors.length === 0;
  const canProceed = isValid && validationState.canCreateIndependent;
  const moduleActive = validationState.hasPlanning;
  const requiereDocumentos = validationState.requiresDocuments;

  return {
    validationState,
    validateForInmersion,
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
    
    // Helpers contextuales (mantenidos para compatibilidad)
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
