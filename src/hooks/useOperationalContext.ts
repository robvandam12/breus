
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useOperationalContext = () => {
  const { profile } = useAuth();

  const { data: operationalContext, isLoading } = useQuery({
    queryKey: ['operational-context', profile?.id],
    queryFn: async () => {
      if (!profile) return null;

      const { data: userContext, error } = await supabase.rpc('get_user_company_context');
      if (error) {
        console.error('Error getting user context:', error);
        return null;
      }

      const context = userContext?.[0];
      if (!context) return null;

      // Determinar capacidades basadas en el tipo de empresa y módulos activos
      const capabilities = {
        canCreateDirectImmersions: true, // CORE: Siempre disponible
        canCreatePlannedOperations: false, // Requiere módulo PLANNING
        requiresDocumentValidation: context.company_type === 'salmonera',
        allowsIndependentImmersions: true,
      };

      // Verificar módulos activos (si están disponibles)
      const { data: moduleData } = await supabase
        .from('company_modules')
        .select('module_name, is_active')
        .eq('company_id', context.company_id)
        .eq('company_type', context.company_type);

      const activeModules = moduleData?.filter(m => m.is_active).map(m => m.module_name) || [];
      
      if (activeModules.includes('planning_operations')) {
        capabilities.canCreatePlannedOperations = true;
      }

      return {
        ...context,
        capabilities,
        activeModules,
      };
    },
    enabled: !!profile,
  });

  const canCreateDirectImmersions = () => {
    return operationalContext?.capabilities?.canCreateDirectImmersions ?? false;
  };

  const requiresDocumentValidation = () => {
    return operationalContext?.capabilities?.requiresDocumentValidation ?? false;
  };

  return {
    operationalContext,
    isLoading,
    canCreateDirectImmersions,
    requiresDocumentValidation,
  };
};
