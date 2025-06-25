
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

      // Si no existe contexto, crear uno por defecto adaptivo
      if (!data) {
        const hasPlanning = hasModuleAccess(modules.PLANNING_OPERATIONS);
        
        const defaultContext = {
          company_id: companyId,
          company_type: companyType,
          // Contexto adaptivo según módulos disponibles
          context_type: hasPlanning ? 'mixed' : 'direct',
          // Permitir operaciones directas por defecto (funcionalidad core)
          allows_direct_operations: true,
          // Planning solo si módulo está activo
          requires_planning: hasPlanning && companyType === 'salmonera',
          // Documentos solo si tiene planning y es salmonera
          requires_documents: hasPlanning && companyType === 'salmonera',
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

  // CORE: Inmersiones directas siempre permitidas (funcionalidad base)
  const canCreateDirectImmersions = () => {
    // La funcionalidad core de inmersiones no depende de planning
    return true;
  };

  // PLANNING: Documentos solo requeridos si módulo está activo
  const requiresDocuments = () => {
    if (!operationalContext) return false;
    return operationalContext.requires_documents && 
           hasModuleAccess(modules.PLANNING_OPERATIONS);
  };

  // PLANNING: Planificación solo requerida si módulo está activo
  const requiresPlanning = () => {
    if (!operationalContext) return false;
    return operationalContext.requires_planning && 
           hasModuleAccess(modules.PLANNING_OPERATIONS);
  };

  // Tipo de workflow adaptivo según módulos activos
  const getWorkflowType = (): 'planned' | 'direct' | 'mixed' => {
    const hasPlanning = hasModuleAccess(modules.PLANNING_OPERATIONS);
    
    if (!hasPlanning) return 'direct'; // Sin planning, solo directo (core)
    if (!operationalContext) return 'direct';
    
    // Con planning, revisar configuración
    if (operationalContext.allows_direct_operations) return 'mixed';
    return 'planned';
  };

  // Validaciones contextuales sin dependencias circulares
  const validateOperationDependencies = (operationType: string) => {
    const hasPlanning = hasModuleAccess(modules.PLANNING_OPERATIONS);
    
    switch (operationType) {
      case 'create_immersion':
        // CORE: Inmersiones siempre permitidas
        return {
          canProceed: true,
          missingRequirements: [],
          warnings: []
        };
      
      case 'create_operation':
        // PLANNING: Solo con módulo activo
        return {
          canProceed: hasPlanning,
          missingRequirements: !hasPlanning 
            ? ['Módulo de planificación de operaciones'] 
            : [],
          warnings: []
        };
      
      case 'create_maintenance_form':
        // MAINTENANCE: Solo con módulo activo
        const hasMaintenance = hasModuleAccess(modules.MAINTENANCE_NETWORKS);
        return {
          canProceed: hasMaintenance,
          missingRequirements: !hasMaintenance
            ? ['Módulo de mantención de redes']
            : [],
          warnings: []
        };
      
      default:
        return { canProceed: true, missingRequirements: [], warnings: [] };
    }
  };

  // Verificar si se puede crear una inmersión planificada (requiere planning)
  const canCreatePlannedImmersion = () => {
    return hasModuleAccess(modules.PLANNING_OPERATIONS);
  };

  // Verificar si se puede acceder a documentos (requiere planning)
  const canAccessDocuments = () => {
    return hasModuleAccess(modules.PLANNING_OPERATIONS);
  };

  return {
    operationalContext,
    isLoading,
    // CORE: Funcionalidad siempre disponible
    canCreateDirectImmersions,
    // PLANNING: Funcionalidad condicional
    canCreatePlannedImmersion,
    canAccessDocuments,
    requiresDocuments,
    requiresPlanning,
    getWorkflowType,
    validateOperationDependencies,
  };
};
