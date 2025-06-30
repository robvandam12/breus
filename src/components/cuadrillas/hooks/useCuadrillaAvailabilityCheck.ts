
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface AvailabilityResult {
  is_available: boolean;
  conflicting_inmersion_id?: string;
  conflicting_inmersion_codigo?: string;
}

export const useCuadrillaAvailabilityCheck = (
  availableCuadrillas: any[],
  fechaInmersion?: string,
  inmersionId?: string
) => {
  const [availabilityStatus, setAvailabilityStatus] = useState<Record<string, AvailabilityResult>>({});
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const checkCuadrillaAvailability = useCallback(async (cuadrillaId: string) => {
    if (!fechaInmersion) return { is_available: true };

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
  }, [fechaInmersion, inmersionId]);

  // Verificar disponibilidad con debounce y condiciones mejoradas
  useEffect(() => {
    if (!fechaInmersion || !availableCuadrillas.length) {
      setAvailabilityStatus({});
      return;
    }

    let isCancelled = false;

    const checkAllAvailability = async () => {
      if (isCancelled) return;
      
      setCheckingAvailability(true);
      const statusMap: Record<string, AvailabilityResult> = {};

      try {
        const batchSize = 5;
        for (let i = 0; i < availableCuadrillas.length; i += batchSize) {
          if (isCancelled) break;
          
          const batch = availableCuadrillas.slice(i, i + batchSize);
          const promises = batch.map(cuadrilla => 
            checkCuadrillaAvailability(cuadrilla.id).then(result => ({
              id: cuadrilla.id,
              result
            }))
          );
          
          const results = await Promise.all(promises);
          results.forEach(({ id, result }) => {
            statusMap[id] = result;
          });
        }
        
        if (!isCancelled) {
          setAvailabilityStatus(statusMap);
        }
      } catch (error) {
        console.error('Error checking availability for all cuadrillas:', error);
        if (!isCancelled) {
          setAvailabilityStatus({});
        }
      } finally {
        if (!isCancelled) {
          setCheckingAvailability(false);
        }
      }
    };

    const timeoutId = setTimeout(checkAllAvailability, 800);
    
    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [fechaInmersion, inmersionId, availableCuadrillas, checkCuadrillaAvailability]);

  return {
    availabilityStatus,
    checkingAvailability
  };
};
