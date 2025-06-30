
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AvailabilityResult {
  is_available: boolean;
  conflicting_inmersion_id?: string;
  conflicting_inmersion_codigo?: string;
}

export const useCuadrillaAvailability = (
  cuadrillaId?: string,
  fechaInmersion?: string,
  inmersionId?: string
) => {
  return useQuery({
    queryKey: ['cuadrilla-availability', cuadrillaId, fechaInmersion, inmersionId],
    queryFn: async (): Promise<AvailabilityResult> => {
      if (!cuadrillaId || !fechaInmersion) {
        return { is_available: true };
      }

      try {
        const { data, error } = await supabase.rpc('validate_cuadrilla_availability', {
          p_cuadrilla_id: cuadrillaId,
          p_fecha_inmersion: fechaInmersion,
          p_inmersion_id: inmersionId || null
        });

        if (error) {
          console.error('Error checking cuadrilla availability:', error);
          return { is_available: true };
        }

        return data?.[0] || { is_available: true };
      } catch (error) {
        console.error('Error in availability check:', error);
        return { is_available: true };
      }
    },
    enabled: !!(cuadrillaId && fechaInmersion),
    staleTime: 30000, // 30 segundos
    refetchOnWindowFocus: false,
    retry: 1
  });
};
