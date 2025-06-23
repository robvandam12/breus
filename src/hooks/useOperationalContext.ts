
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useModularSystem } from './useModularSystem';

export interface OperationalContext {
  id: string;
  company_id: string;
  company_type: 'salmonera' | 'contratista';
  context_type: 'planned' | 'direct' | 'mixed';
  requires_planning: boolean;
  requires_documents: boolean;
  allows_direct_operations: boolean;
  active_modules: string[];
  configuration: any;
}

export const useOperationalContext = () => {
  const { profile } = useAuth();
  const { hasModuleAccess, modules } = useModularSystem();

  const { data: operationalContext, isLoading } = useQuery({
    queryKey: ['operational-context', profile?.salmonera_id || profile?.servicio_id],
    queryFn: async () => {
      if (!profile?.salmonera_id && !profile?.servicio_id) return null;

      const companyId = profile.salmonera_id || profile.servicio_id;
      const companyType = profile.salmonera_id ? 'salmonera' : 'contratista';

      const { data, error } = await supabase
        .from('operational_contexts')
        .select('*')
        .eq('company_id', companyId)
        .eq('company_type', companyType)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      // Si no existe contexto, crear uno por defecto
      if (!data) {
        const defaultContext = {
          company_id: companyId,
          company_type: companyType,
          context_type: companyType === 'salmonera' ? 'planned' : 'direct',
          requires_planning: companyType === 'salmonera',
          requires_documents: companyType === 'salmonera',
          allows_direct_operations: companyType === 'contratista',
          active_modules: ['core_immersions'],
          configuration: {},
        };

        const { data: newContext, error: insertError } = await supabase
          .from('operational_contexts')
          .insert(defaultContext)
          .select()
          .single();

        if (insertError) throw insertError;
        return newContext;
      }

      return data;
    },
    enabled: !!(profile?.salmonera_id || profile?.servicio_id),
  });

  // Validaciones contextuales
  const canCreateDirectImmersions = () => {
    if (!operationalContext) return false;
    return operationalContext.allows_direct_operations || 
           hasModuleAccess(modules.PLANNING_OPERATIONS);
  };

  const requiresDocuments = () => {
    if (!operationalContext) return false;
    return operationalContext.requires_documents && 
           hasModuleAccess(modules.PLANNING_OPERATIONS);
  };

  const requiresPlanning = () => {
    if (!operationalContext) return false;
    return operationalContext.requires_planning && 
           hasModuleAccess(modules.PLANNING_OPERATIONS);
  };

  const getWorkflowType = (): 'planned' | 'direct' | 'mixed' => {
    if (!operationalContext) return 'direct';
    
    const hasPlanning = hasModuleAccess(modules.PLANNING_OPERATIONS);
    const allowsDirect = operationalContext.allows_direct_operations;
    
    if (hasPlanning && allowsDirect) return 'mixed';
    if (hasPlanning && !allowsDirect) return 'planned';
    return 'direct';
  };

  const validateOperationDependencies = (operationType: string) => {
    const workflow = getWorkflowType();
    
    switch (operationType) {
      case 'create_immersion':
        return {
          canProceed: canCreateDirectImmersions(),
          missingRequirements: !canCreateDirectImmersions() 
            ? ['Módulo de planificación o contexto operativo directo'] 
            : [],
          warnings: workflow === 'mixed' 
            ? ['Puedes crear inmersiones directas o planificadas'] 
            : []
        };
      
      case 'create_operation':
        return {
          canProceed: hasModuleAccess(modules.PLANNING_OPERATIONS),
          missingRequirements: !hasModuleAccess(modules.PLANNING_OPERATIONS)
            ? ['Módulo de planificación de operaciones']
            : [],
          warnings: []
        };
      
      case 'create_maintenance_form':
        return {
          canProceed: hasModuleAccess(modules.MAINTENANCE_NETWORKS),
          missingRequirements: !hasModuleAccess(modules.MAINTENANCE_NETWORKS)
            ? ['Módulo de mantención de redes']
            : [],
          warnings: []
        };
      
      default:
        return { canProceed: true, missingRequirements: [], warnings: [] };
    }
  };

  return {
    operationalContext,
    isLoading,
    canCreateDirectImmersions,
    requiresDocuments,
    requiresPlanning,
    getWorkflowType,
    validateOperationDependencies,
  };
};
