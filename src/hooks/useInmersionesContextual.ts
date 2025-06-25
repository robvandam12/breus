
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useOperationalContext } from './useOperationalContext';
import { useModularSystem } from './useModularSystem';

export const useInmersionesContextual = () => {
  const { profile } = useAuth();
  const { operationalContext, canCreateDirectImmersions } = useOperationalContext();
  const { hasModuleAccess, modules } = useModularSystem();

  const { data: inmersiones = [], isLoading } = useQuery({
    queryKey: ['inmersiones-contextual', profile?.id],
    queryFn: async () => {
      if (!profile) return [];

      let query = supabase
        .from('inmersion')
        .select(`
          *,
          operacion:operacion_id(
            id,
            nombre,
            codigo,
            estado
          )
        `)
        .order('created_at', { ascending: false });

      // Filtrar según el contexto del usuario
      if (profile.salmonera_id) {
        // Salmonera ve todas las inmersiones de sus operaciones
        query = query.or(
          `operacion.salmonera_id.eq.${profile.salmonera_id},empresa_creadora_id.eq.${profile.salmonera_id}`
        );
      } else if (profile.servicio_id) {
        // Contratista ve sus inmersiones y las de operaciones asignadas
        query = query.or(
          `empresa_creadora_id.eq.${profile.servicio_id},operacion.contratista_id.eq.${profile.servicio_id}`
        );
      } else {
        // Usuario individual ve solo sus inmersiones
        query = query.or(
          `supervisor_id.eq.${profile.id},buzo_principal_id.eq.${profile.id},buzo_asistente_id.eq.${profile.id}`
        );
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    },
    enabled: !!profile,
  });

  // Obtener estadísticas contextuales
  const estadisticas = {
    total: inmersiones?.length || 0,
    planificadas: inmersiones?.filter(i => i.operacion_id && !i.is_independent).length || 0,
    independientes: inmersiones?.filter(i => !i.operacion_id || i.is_independent).length || 0,
    completadas: inmersiones?.filter(i => i.estado === 'completada').length || 0,
    enProceso: inmersiones?.filter(i => i.estado === 'en_proceso').length || 0,
  };

  // Capacidades contextuales por módulos
  const capacidades = {
    // CORE: Siempre disponible
    puedeCrearInmersionesDirectas: canCreateDirectImmersions(),
    puedeCrearBitacoras: true, // Core siempre disponible
    
    // PLANNING: Condicional
    puedeCrearOperaciones: hasModuleAccess(modules.PLANNING_OPERATIONS),
    
    // MAINTENANCE: Condicional
    puedeCrearFormulariosMantencion: hasModuleAccess(modules.MAINTENANCE_NETWORKS),
    
    // REPORTING: Condicional
    puedeAccederReportesAvanzados: hasModuleAccess(modules.ADVANCED_REPORTING),
    
    // INTEGRATIONS: Condicional
    puedeUsarIntegraciones: hasModuleAccess(modules.EXTERNAL_INTEGRATIONS),
  };

  return {
    inmersiones,
    isLoading,
    estadisticas,
    capacidades,
    operationalContext,
    // Mantener compatibilidad hacia atrás
    canCreateDirectImmersion: canCreateDirectImmersions(),
  };
};
