
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
          context_type: getDefaultContextType(companyType),
          requires_planning: false, // Por defecto no requerir planificación
          requires_documents: false, // Por defecto no requerir documentos
          allows_direct_operations: true, // Siempre permitir operaciones directas (core)
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

  // Obtener el tipo de contexto por defecto según la empresa
  const getDefaultContextType = (companyType: 'salmonera' | 'contratista'): 'planned' | 'direct' | 'mixed' => {
    const hasPlanningModule = hasModuleAccess(modules.PLANNING_OPERATIONS);
    
    if (hasPlanningModule) {
      return 'mixed'; // Con planning, permitir ambos modos
    }
    return 'direct'; // Sin planning, solo modo directo
  };

  // FUNCIONALIDADES CORE - Siempre disponibles
  const canCreateDirectImmersions = (): boolean => {
    // Las inmersiones son funcionalidad core, siempre permitidas
    return true;
  };

  const canCreateBitacoras = (): boolean => {
    // Las bitácoras son funcionalidad core, siempre permitidas
    return true;
  };

  // FUNCIONALIDADES DE MÓDULOS - Dependientes de módulos activos
  const requiresDocuments = (): boolean => {
    if (!operationalContext) return false;
    // Solo requerir documentos si tiene módulo de planificación Y está configurado para requerirlos
    return hasModuleAccess(modules.PLANNING_OPERATIONS) && 
           operationalContext.requires_documents;
  };

  const requiresPlanning = (): boolean => {
    if (!operationalContext) return false;
    // Solo requerir planificación si tiene el módulo Y está configurado para requerirla
    return hasModuleAccess(modules.PLANNING_OPERATIONS) && 
           operationalContext.requires_planning;
  };

  const canCreateOperations = (): boolean => {
    // Las operaciones requieren el módulo de planificación
    return hasModuleAccess(modules.PLANNING_OPERATIONS);
  };

  const canCreateMaintenanceForms = (): boolean => {
    // Los formularios de mantención requieren el módulo correspondiente
    return hasModuleAccess(modules.MAINTENANCE_NETWORKS);
  };

  // Determinar el flujo de trabajo adaptivo
  const getWorkflowType = (): 'planned' | 'direct' | 'mixed' => {
    if (!operationalContext) return 'direct';
    
    const hasPlanning = hasModuleAccess(modules.PLANNING_OPERATIONS);
    
    if (!hasPlanning) {
      return 'direct'; // Sin planning, solo directo
    }
    
    // Con planning, usar la configuración del contexto o 'mixed' por defecto
    return operationalContext.context_type || 'mixed';
  };

  // Validaciones contextuales mejoradas
  const validateOperationDependencies = (operationType: string) => {
    const workflow = getWorkflowType();
    
    switch (operationType) {
      case 'create_immersion':
        // Las inmersiones son core, siempre permitidas
        return {
          canProceed: true,
          missingRequirements: [],
          warnings: workflow === 'mixed' 
            ? ['Puedes crear inmersiones directas o asociadas a operaciones planificadas'] 
            : workflow === 'planned'
            ? ['Se recomienda asociar la inmersión a una operación planificada']
            : ['Creando inmersión en modo directo']
        };
      
      case 'create_bitacora':
        // Las bitácoras son core, siempre permitidas
        return {
          canProceed: true,
          missingRequirements: [],
          warnings: []
        };
      
      case 'create_operation':
        return {
          canProceed: canCreateOperations(),
          missingRequirements: !canCreateOperations()
            ? ['Módulo de planificación de operaciones requerido']
            : [],
          warnings: []
        };
      
      case 'create_maintenance_form':
        return {
          canProceed: canCreateMaintenanceForms(),
          missingRequirements: !canCreateMaintenanceForms()
            ? ['Módulo de mantención de redes requerido']
            : [],
          warnings: []
        };
      
      default:
        return { canProceed: true, missingRequirements: [], warnings: [] };
    }
  };

  // Helper para determinar si necesita migración de contexto
  const needsContextMigration = (): boolean => {
    if (!operationalContext) return false;
    
    const hasPlanning = hasModuleAccess(modules.PLANNING_OPERATIONS);
    const currentType = operationalContext.context_type;
    
    // Si tiene planning pero el contexto no es 'mixed', necesita migración
    if (hasPlanning && currentType !== 'mixed') return true;
    
    // Si no tiene planning pero el contexto no es 'direct', necesita migración
    if (!hasPlanning && currentType !== 'direct') return true;
    
    return false;
  };

  return {
    operationalContext,
    isLoading,
    
    // Funcionalidades CORE (siempre disponibles)
    canCreateDirectImmersions,
    canCreateBitacoras,
    
    // Funcionalidades de MÓDULOS (dependientes)
    requiresDocuments,
    requiresPlanning,
    canCreateOperations,
    canCreateMaintenanceForms,
    
    // Flujo de trabajo
    getWorkflowType,
    validateOperationDependencies,
    
    // Helpers de estado
    needsContextMigration,
    
    // Para compatibilidad con código existente
    allowsDirectOperations: () => true, // Siempre true para core
  };
};
