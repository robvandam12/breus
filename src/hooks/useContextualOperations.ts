
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface OperationalContext {
  id: string;
  company_id: string;
  company_type: 'salmonera' | 'contratista';
  context_type: 'planned' | 'direct' | 'mixed';
  requires_planning: boolean;
  requires_documents: boolean;
  allows_direct_operations: boolean;
  active_modules: string[];
  configuration: Record<string, any>;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  context: OperationalContext | null;
  requiresDocuments: boolean;
  allowsDirectOperations: boolean;
}

export const useContextualOperations = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // Obtener contexto operativo actual
  const { data: operationalContext, isLoading } = useQuery({
    queryKey: ['operational-context', profile?.salmonera_id || profile?.servicio_id],
    queryFn: async () => {
      if (!profile?.salmonera_id && !profile?.servicio_id) {
        throw new Error('Usuario sin empresa asignada');
      }

      const companyId = profile.salmonera_id || profile.servicio_id;
      const companyType = profile.salmonera_id ? 'salmonera' : 'contratista';

      const { data, error } = await supabase
        .from('operational_contexts')
        .select('*')
        .eq('company_id', companyId)
        .eq('company_type', companyType)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Si no existe contexto, crear uno por defecto
      if (!data) {
        return createDefaultContext(companyId!, companyType);
      }

      return data as OperationalContext;
    },
    enabled: !!(profile?.salmonera_id || profile?.servicio_id),
  });

  const createDefaultContext = async (companyId: string, companyType: 'salmonera' | 'contratista'): Promise<OperationalContext> => {
    const defaultContext = {
      company_id: companyId,
      company_type: companyType,
      context_type: companyType === 'salmonera' ? 'mixed' as const : 'direct' as const,
      requires_planning: companyType === 'salmonera',
      requires_documents: companyType === 'salmonera',
      allows_direct_operations: true,
      active_modules: ['core_immersions', 'basic_reporting'] as string[],
      configuration: {}
    };

    const { data, error } = await supabase
      .from('operational_contexts')
      .insert(defaultContext)
      .select()
      .single();

    if (error) throw error;
    return data as OperationalContext;
  };

  // Validar si se puede crear una inmersión directamente
  const validateDirectImmersion = async (): Promise<ValidationResult> => {
    if (!operationalContext) {
      return {
        isValid: false,
        errors: ['No se pudo determinar el contexto operativo'],
        warnings: [],
        context: null,
        requiresDocuments: false,
        allowsDirectOperations: false
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    // Verificar si se permite operación directa
    if (!operationalContext.allows_direct_operations) {
      errors.push('El contexto operativo no permite inmersiones directas');
    }

    // Para contratistas, verificar que puedan operar sin planificación
    if (operationalContext.company_type === 'contratista') {
      if (operationalContext.context_type === 'planned') {
        errors.push('Los contratistas requieren operaciones planificadas por la salmonera');
      } else {
        warnings.push('Inmersión directa - asegúrate de tener coordinación con la salmonera');
      }
    }

    // Para salmoneras, pueden crear tanto planificadas como directas
    if (operationalContext.company_type === 'salmonera') {
      if (operationalContext.requires_planning && operationalContext.context_type !== 'mixed') {
        warnings.push('Se recomienda planificar la operación antes de crear inmersiones');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      context: operationalContext,
      requiresDocuments: operationalContext.requires_documents,
      allowsDirectOperations: operationalContext.allows_direct_operations
    };
  };

  // Validar creación de inmersión con operación específica
  const validateInmersionCreation = async (operacionId?: string): Promise<ValidationResult> => {
    if (!operationalContext) {
      return {
        isValid: false,
        errors: ['No se pudo determinar el contexto operativo'],
        warnings: [],
        context: null,
        requiresDocuments: false,
        allowsDirectOperations: false
      };
    }

    // Si no hay operación, validar inmersión directa
    if (!operacionId) {
      return await validateDirectImmersion();
    }

    // Si hay operación, verificar que exista y esté válida
    const { data: operacion, error } = await supabase
      .from('operacion')
      .select('*')
      .eq('id', operacionId)
      .single();

    if (error || !operacion) {
      return {
        isValid: false,
        errors: ['La operación especificada no existe o no es accesible'],
        warnings: [],
        context: operationalContext,
        requiresDocuments: operationalContext.requires_documents,
        allowsDirectOperations: operationalContext.allows_direct_operations
      };
    }

    // Validación exitosa con operación
    return {
      isValid: true,
      errors: [],
      warnings: [],
      context: operationalContext,
      requiresDocuments: operationalContext.requires_documents,
      allowsDirectOperations: operationalContext.allows_direct_operations
    };
  };

  // Obtener módulos activos
  const getActiveModules = (): string[] => {
    return operationalContext?.active_modules || ['core_immersions'];
  };

  // Verificar si un módulo está activo
  const isModuleActive = (moduleId: string): boolean => {
    const activeModules = getActiveModules();
    return activeModules.includes(moduleId);
  };

  // Obtener configuración del contexto
  const getContextConfiguration = () => {
    return operationalContext?.configuration || {};
  };

  // Determinar flujo de trabajo
  const getWorkflowType = (): 'planned' | 'direct' | 'mixed' => {
    return operationalContext?.context_type || 'direct';
  };

  // Verificar si requiere planificación
  const requiresPlanning = (): boolean => {
    return operationalContext?.requires_planning || false;
  };

  // Verificar si requiere documentos
  const requiresDocuments = (): boolean => {
    return operationalContext?.requires_documents || false;
  };

  // Verificar si permite operaciones directas
  const allowsDirectOperations = (): boolean => {
    return operationalContext?.allows_direct_operations || true;
  };

  return {
    operationalContext,
    isLoading,
    validateDirectImmersion,
    validateInmersionCreation,
    getActiveModules,
    isModuleActive,
    getContextConfiguration,
    getWorkflowType,
    requiresPlanning,
    requiresDocuments,
    allowsDirectOperations,
    
    // Helpers para UI
    canCreateDirectImmersion: allowsDirectOperations(),
    canPlanOperations: operationalContext?.company_type === 'salmonera' && requiresPlanning(),
    canAccessNetworkMaintenance: isModuleActive('maintenance_networks'),
    canAccessAdvancedReports: isModuleActive('advanced_reporting'),
    canUseIntegrations: isModuleActive('external_integrations'),
  };
};
