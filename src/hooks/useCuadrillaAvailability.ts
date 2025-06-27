
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CuadrillaAvailability {
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
    queryFn: async (): Promise<CuadrillaAvailability> => {
      if (!cuadrillaId || !fechaInmersion) {
        return { is_available: true };
      }

      const { data, error } = await supabase.rpc('validate_cuadrilla_availability', {
        p_cuadrilla_id: cuadrillaId,
        p_fecha_inmersion: fechaInmersion,
        p_inmersion_id: inmersionId || null
      });

      if (error) {
        console.error('Error validating cuadrilla availability:', error);
        throw error;
      }

      return data?.[0] || { is_available: true };
    },
    enabled: !!cuadrillaId && !!fechaInmersion,
  });
};

export const useCuadrillasConAsignaciones = () => {
  return useQuery({
    queryKey: ['cuadrillas-con-asignaciones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cuadrillas_buceo')
        .select(`
          *,
          cuadrilla_miembros (
            id,
            usuario_id,
            rol_equipo,
            disponible,
            usuario:usuario_id (
              nombre,
              apellido,
              email
            )
          ),
          cuadrilla_asignaciones (
            id,
            fecha_asignacion,
            estado,
            inmersion_id,
            inmersion:inmersion_id (
              codigo,
              fecha_inmersion,
              estado
            )
          )
        `)
        .eq('activo', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cuadrillas con asignaciones:', error);
        throw error;
      }

      return data || [];
    },
  });
};
