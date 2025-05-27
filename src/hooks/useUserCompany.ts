
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const useUserCompany = () => {
  const { profile } = useAuth();

  const { data: companyInfo, isLoading } = useQuery({
    queryKey: ['user-company', profile?.salmonera_id, profile?.servicio_id],
    queryFn: async () => {
      if (!profile) return null;

      if (profile.salmonera_id) {
        const { data, error } = await supabase
          .from('salmoneras')
          .select('nombre')
          .eq('id', profile.salmonera_id)
          .single();

        if (error) throw error;
        return { nombre: data.nombre, tipo: 'salmonera' };
      }

      if (profile.servicio_id) {
        const { data, error } = await supabase
          .from('contratistas')
          .select('nombre')
          .eq('id', profile.servicio_id)
          .single();

        if (error) throw error;
        return { nombre: data.nombre, tipo: 'contratista' };
      }

      return null;
    },
    enabled: !!profile && (!!profile.salmonera_id || !!profile.servicio_id),
  });

  return {
    companyInfo,
    isLoading,
  };
};
