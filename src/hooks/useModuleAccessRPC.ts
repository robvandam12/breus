
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// Hook temporal hasta que se cree la función RPC
export const useModuleAccessFallback = () => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ['module-access-fallback', profile?.salmonera_id || profile?.servicio_id],
    queryFn: async () => {
      const empresaId = profile?.salmonera_id || profile?.servicio_id;
      if (!empresaId) return [];

      try {
        const { data, error } = await supabase
          .from('module_access')
          .select('*')
          .eq('empresa_id', empresaId)
          .eq('activo', true);

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching module access:', error);
        // Retornar configuración por defecto
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
        ];
      }
    },
    enabled: !!(profile?.salmonera_id || profile?.servicio_id),
  });
};
