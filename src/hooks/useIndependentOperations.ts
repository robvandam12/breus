
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useModularSystem } from '@/hooks/useModularSystem';
import { toast } from '@/hooks/use-toast';

export interface OperationalContext {
  id: string;
  context_type: 'planned' | 'direct' | 'mixed';
  company_id: string;
  company_type: 'salmonera' | 'contratista';
  requires_planning: boolean;
  requires_documents: boolean;
  allows_direct_operations: boolean;
  active_modules: string[];
}

export interface IndependentInmersion {
  inmersion_id: string;
  codigo: string;
  fecha_inmersion: string;
  buzo_principal: string;
  supervisor: string;
  objetivo: string;
  estado: string;
  context_type: 'planned' | 'direct';
  requires_validation: boolean;
  validation_status: 'pending' | 'validated' | 'not_required';
  company_id: string;
  company_type: string;
  metadata: Record<string, any>;
  operacion_id?: string;
}

export const useIndependentOperations = () => {
  const [loading, setLoading] = useState(false);
  const [operationalContext, setOperationalContext] = useState<OperationalContext | null>(null);
  const { profile } = useAuth();
  const { hasModuleAccess, modules } = useModularSystem();

  // Obtener contexto operativo de la empresa
  useEffect(() => {
    if (profile?.salmonera_id || profile?.servicio_id) {
      loadOperationalContext();
    }
  }, [profile]);

  const loadOperationalContext = async () => {
    try {
      setLoading(true);
      
      const companyId = profile?.salmonera_id || profile?.servicio_id;
      const companyType = profile?.salmonera_id ? 'salmonera' : 'contratista';
      
      if (!companyId) return;

      // Crear un contexto simulado por ahora (hasta que se implemente la tabla en BD)
      const simulatedContext: OperationalContext = {
        id: 'temp-context',
        company_id: companyId,
        company_type: companyType,
        context_type: hasModuleAccess(modules.PLANNING_OPERATIONS) ? 'mixed' : 'direct',
        requires_planning: hasModuleAccess(modules.PLANNING_OPERATIONS),
        requires_documents: hasModuleAccess(modules.PLANNING_OPERATIONS) && companyType === 'salmonera',
        allows_direct_operations: true,
        active_modules: [
          modules.CORE_IMMERSIONS,
          ...(hasModuleAccess(modules.PLANNING_OPERATIONS) ? [modules.PLANNING_OPERATIONS] : []),
          ...(hasModuleAccess(modules.MAINTENANCE_NETWORKS) ? [modules.MAINTENANCE_NETWORKS] : []),
          ...(hasModuleAccess(modules.ADVANCED_REPORTING) ? [modules.ADVANCED_REPORTING] : []),
          ...(hasModuleAccess(modules.EXTERNAL_INTEGRATIONS) ? [modules.EXTERNAL_INTEGRATIONS] : [])
        ]
      };

      setOperationalContext(simulatedContext);

    } catch (error: any) {
      console.error('Error loading operational context:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el contexto operativo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Crear inmersión independiente según contexto
  const createIndependentInmersion = async (inmersionData: Partial<IndependentInmersion>) => {
    setLoading(true);
    try {
      const companyId = profile?.salmonera_id || profile?.servicio_id;
      const companyType = profile?.salmonera_id ? 'salmonera' : 'contratista';
      
      if (!companyId || !operationalContext) {
        throw new Error('Contexto operativo no disponible');
      }

      // Determinar tipo de contexto para la inmersión
      let contextType: 'planned' | 'direct' = 'direct';
      let requiresValidation = false;

      if (operationalContext.context_type === 'planned' && operationalContext.requires_planning) {
        contextType = 'planned';
        requiresValidation = operationalContext.requires_documents;
      } else if (operationalContext.context_type === 'mixed') {
        // En modo mixto, permitir ambos tipos
        contextType = inmersionData.context_type || 'direct';
        requiresValidation = contextType === 'planned' && operationalContext.requires_documents;
      }

      // Si requiere validación, verificar documentos
      if (requiresValidation && contextType === 'planned' && inmersionData.operacion_id) {
        // Verificar HPT si está disponible el módulo de planificación
        if (hasModuleAccess(modules.PLANNING_OPERATIONS)) {
          const { data: hptData } = await supabase
            .from('hpt')
            .select('id')
            .eq('operacion_id', inmersionData.operacion_id)
            .eq('firmado', true)
            .maybeSingle();

          const { data: anexoData } = await supabase
            .from('anexo_bravo')
            .select('id')
            .eq('operacion_id', inmersionData.operacion_id)
            .eq('firmado', true)
            .maybeSingle();

          if (!hptData || !anexoData) {
            toast({
              title: "Validación requerida",
              description: "Se requieren documentos HPT y Anexo Bravo firmados para operaciones planificadas",
              variant: "destructive",
            });
            return null;
          }
        }
      }

      // Crear inmersión con contexto independiente
      const inmersionCompleta = {
        ...inmersionData,
        contexto_operativo: contextType,
        requiere_validacion_previa: requiresValidation,
        empresa_creadora_id: companyId,
        empresa_creadora_tipo: companyType,
        validacion_contextual: {
          operational_context: operationalContext.context_type,
          active_modules: operationalContext.active_modules,
          created_independently: !inmersionData.operacion_id,
          validation_status: requiresValidation ? 'pending' : 'not_required',
          ...inmersionData.metadata
        }
      };

      const { data, error } = await supabase
        .from('inmersion')
        .insert(inmersionCompleta)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Inmersión creada",
        description: `Inmersión ${contextType === 'direct' ? 'directa' : 'planificada'} creada exitosamente`,
      });

      return data;

    } catch (error: any) {
      console.error('Error creating independent inmersion:', error);
      toast({
        title: "Error",
        description: `No se pudo crear la inmersión: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Validar si se puede acceder a funcionalidad específica
  const canAccessFeature = (feature: string): boolean => {
    if (!operationalContext) return false;

    switch (feature) {
      case 'create_operations':
        return hasModuleAccess(modules.PLANNING_OPERATIONS) && operationalContext.requires_planning;
      case 'create_documents':
        return hasModuleAccess(modules.PLANNING_OPERATIONS) && operationalContext.requires_documents;
      case 'create_direct_inmersions':
        return operationalContext.allows_direct_operations;
      case 'network_maintenance':
        return hasModuleAccess(modules.MAINTENANCE_NETWORKS);
      case 'advanced_reports':
        return hasModuleAccess(modules.ADVANCED_REPORTING);
      case 'integrations':
        return hasModuleAccess(modules.EXTERNAL_INTEGRATIONS);
      default:
        return false;
    }
  };

  // Obtener inmersiones según contexto
  const getContextualInmersiones = async (filters?: any) => {
    try {
      setLoading(true);
      
      const companyId = profile?.salmonera_id || profile?.servicio_id;
      const companyType = profile?.salmonera_id ? 'salmonera' : 'contratista';

      let query = supabase
        .from('inmersion')
        .select(`
          *,
          operacion:operacion_id (
            nombre,
            codigo,
            estado
          )
        `)
        .eq('empresa_creadora_id', companyId)
        .eq('empresa_creadora_tipo', companyType);

      if (filters?.context_type) {
        query = query.eq('contexto_operativo', filters.context_type);
      }

      if (filters?.estado) {
        query = query.eq('estado', filters.estado);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];

    } catch (error: any) {
      console.error('Error fetching contextual inmersions:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    operationalContext,
    createIndependentInmersion,
    canAccessFeature,
    getContextualInmersiones,
    loadOperationalContext
  };
};
