
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
  configuration: Record<string, any>;
}

export interface IndependentInmersion {
  inmersion_id: string;
  codigo: string;
  fecha_inmersion: string;
  hora_inicio: string;
  hora_fin?: string;
  buzo_principal: string;
  buzo_asistente?: string;
  supervisor: string;
  objetivo: string;
  profundidad_max: number;
  temperatura_agua: number;
  visibilidad: number;
  corriente: string;
  observaciones?: string;
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

      // Intentar obtener contexto de la base de datos
      const { data: contextData, error } = await supabase
        .from('operational_contexts')
        .select('*')
        .eq('company_id', companyId)
        .eq('company_type', companyType)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error loading operational context:', error);
      }

      // Si no existe contexto, crear uno por defecto
      if (!contextData) {
        const defaultContext: OperationalContext = {
          id: 'temp-context',
          company_id: companyId,
          company_type: companyType,
          context_type: companyType === 'salmonera' ? 'mixed' : 'direct',
          requires_planning: companyType === 'salmonera',
          requires_documents: companyType === 'salmonera',
          allows_direct_operations: true,
          active_modules: [
            modules.CORE_IMMERSIONS,
            ...(hasModuleAccess(modules.PLANNING_OPERATIONS) ? [modules.PLANNING_OPERATIONS] : []),
            ...(hasModuleAccess(modules.MAINTENANCE_NETWORKS) ? [modules.MAINTENANCE_NETWORKS] : []),
            ...(hasModuleAccess(modules.ADVANCED_REPORTING) ? [modules.ADVANCED_REPORTING] : []),
            ...(hasModuleAccess(modules.EXTERNAL_INTEGRATIONS) ? [modules.EXTERNAL_INTEGRATIONS] : [])
          ],
          configuration: {}
        };

        setOperationalContext(defaultContext);
      } else {
        setOperationalContext({
          id: contextData.id,
          company_id: contextData.company_id,
          company_type: contextData.company_type,
          context_type: contextData.context_type,
          requires_planning: contextData.requires_planning,
          requires_documents: contextData.requires_documents,
          allows_direct_operations: contextData.allows_direct_operations,
          active_modules: contextData.active_modules || [modules.CORE_IMMERSIONS],
          configuration: contextData.configuration || {}
        });
      }

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

      // Preparar datos de inmersión con todos los campos requeridos
      const inmersionCompleta = {
        codigo: inmersionData.codigo || '',
        fecha_inmersion: inmersionData.fecha_inmersion || new Date().toISOString().split('T')[0],
        hora_inicio: inmersionData.hora_inicio || '08:00',
        hora_fin: inmersionData.hora_fin,
        buzo_principal: inmersionData.buzo_principal || '',
        buzo_asistente: inmersionData.buzo_asistente,
        supervisor: inmersionData.supervisor || '',
        objetivo: inmersionData.objetivo || 'mantenimiento',
        profundidad_max: inmersionData.profundidad_max || 0,
        temperatura_agua: inmersionData.temperatura_agua || 0,
        visibilidad: inmersionData.visibilidad || 0,
        corriente: inmersionData.corriente || 'nula',
        observaciones: inmersionData.observaciones || '',
        estado: 'planificada',
        context_type: contextType,
        requires_validation: requiresValidation,
        validation_status: requiresValidation ? 'pending' : 'not_required',
        company_id: companyId,
        company_type: companyType,
        operacion_id: inmersionData.operacion_id,
        metadata: {
          operational_context: operationalContext.context_type,
          active_modules: operationalContext.active_modules,
          created_independently: !inmersionData.operacion_id,
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
        .eq('company_id', companyId)
        .eq('company_type', companyType);

      if (filters?.context_type) {
        query = query.eq('context_type', filters.context_type);
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
