
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ModuleAccess {
  id: string;
  empresa_id: string;
  modulo_nombre: string;
  activo: boolean;
  configuracion: any;
  created_at: string;
  updated_at: string;
}

export const useModuleAccess = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // Obtener módulos activos para la empresa del usuario
  const { data: activeModules = [], isLoading } = useQuery({
    queryKey: ['module-access', profile?.salmonera_id || profile?.servicio_id],
    queryFn: async () => {
      if (!profile?.salmonera_id && !profile?.servicio_id) return [];
      
      const empresaId = profile.salmonera_id || profile.servicio_id;
      
      try {
        const { data, error } = await supabase
          .from('module_access')
          .select('*')
          .eq('empresa_id', empresaId)
          .eq('activo', true);

        if (error) throw error;
        return data as ModuleAccess[];
      } catch (error) {
        console.error('Error fetching modules:', error);
        // Fallback: retornar módulos por defecto para que la app funcione
        return [
          { 
            id: 'default-core', 
            empresa_id: empresaId, 
            modulo_nombre: 'core_operations', 
            activo: true, 
            configuracion: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ] as ModuleAccess[];
      }
    },
    enabled: !!(profile?.salmonera_id || profile?.servicio_id),
  });

  // Verificar si un módulo específico está activo
  const isModuleActive = (moduleName: string): boolean => {
    return activeModules.some(module => module.modulo_nombre === moduleName && module.activo);
  };

  // Obtener configuración específica de un módulo
  const getModuleConfig = (moduleName: string): any => {
    const module = activeModules.find(m => m.modulo_nombre === moduleName);
    return module?.configuracion || {};
  };

  // Verificar múltiples módulos
  const hasAnyModule = (moduleNames: string[]): boolean => {
    return moduleNames.some(name => isModuleActive(name));
  };

  // Módulos core disponibles
  const modules = {
    PLANNING: 'planning', // Operaciones, HPT, Anexo Bravo
    CORE_OPERATIONS: 'core_operations', // Inmersiones, Bitácoras básicas
    NETWORK_MAINTENANCE: 'network_maintenance', // Mantención de Redes
    NETWORK_OPERATIONS: 'network_operations', // Faenas de Redes
    REPORTS: 'reports', // Reportes avanzados
    INTEGRATIONS: 'integrations', // APIs externas
  };

  return {
    activeModules,
    isLoading,
    isModuleActive,
    getModuleConfig,
    hasAnyModule,
    modules,
    // Helpers para módulos específicos
    canPlanOperations: isModuleActive(modules.PLANNING),
    canManageNetworks: hasAnyModule([modules.NETWORK_MAINTENANCE, modules.NETWORK_OPERATIONS]),
    canAccessReports: isModuleActive(modules.REPORTS),
  };
};
