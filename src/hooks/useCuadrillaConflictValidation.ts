
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ConflictValidationResult {
  isAvailable: boolean;
  conflictingInmersionId?: string;
  conflictingInmersionCodigo?: string;
}

export const useCuadrillaConflictValidation = (
  cuadrillaId: string | null,
  fechaInmersion: string | null,
  inmersionId?: string
) => {
  return useQuery({
    queryKey: ['cuadrilla-conflict-validation', cuadrillaId, fechaInmersion, inmersionId],
    queryFn: async (): Promise<ConflictValidationResult> => {
      if (!cuadrillaId || !fechaInmersion) {
        return { isAvailable: true };
      }

      console.log('Validating cuadrilla availability:', { cuadrillaId, fechaInmersion, inmersionId });

      const { data, error } = await supabase
        .rpc('validate_cuadrilla_availability', {
          p_cuadrilla_id: cuadrillaId,
          p_fecha_inmersion: fechaInmersion,
          p_inmersion_id: inmersionId || null
        });

      if (error) {
        console.error('Error validating cuadrilla availability:', error);
        throw error;
      }

      const result = data?.[0];
      return {
        isAvailable: result?.is_available || false,
        conflictingInmersionId: result?.conflicting_inmersion_id,
        conflictingInmersionCodigo: result?.conflicting_inmersion_codigo,
      };
    },
    enabled: !!cuadrillaId && !!fechaInmersion,
    staleTime: 30000, // 30 seconds
  });
};

export const useCuadrillaAsignaciones = (cuadrillaId: string | null) => {
  return useQuery({
    queryKey: ['cuadrilla-asignaciones', cuadrillaId],
    queryFn: async () => {
      if (!cuadrillaId) return [];

      const { data, error } = await supabase
        .from('cuadrilla_asignaciones')
        .select(`
          *,
          inmersion:inmersion_id (
            codigo,
            objetivo,
            estado
          )
        `)
        .eq('cuadrilla_id', cuadrillaId)
        .eq('estado', 'activa')
        .gte('fecha_asignacion', new Date().toISOString().split('T')[0])
        .order('fecha_asignacion', { ascending: true });

      if (error) {
        console.error('Error fetching cuadrilla asignaciones:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!cuadrillaId,
  });
};
