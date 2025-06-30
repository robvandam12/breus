
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface AvailabilityResult {
  is_available: boolean;
  conflicting_inmersion_id?: string;
  conflicting_inmersion_codigo?: string;
}

export const useCuadrillaAvailabilityCheck = () => {
  const [availabilityStatus, setAvailabilityStatus] = useState<Record<string, AvailabilityResult>>({});
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const checkCuadrillaAvailability = useCallback(async (
    cuadrillaId: string,
    fechaInmersion?: string,
    inmersionId?: string
  ): Promise<AvailabilityResult> => {
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
  }, []);

  const checkBulkAvailability = useCallback(async (
    cuadrillas: any[],
    fechaInmersion?: string,
    inmersionId?: string
  ) => {
    if (!fechaInmersion || !cuadrillas.length) {
      setAvailabilityStatus({});
      return;
    }

    setCheckingAvailability(true);
    const statusMap: Record<string, AvailabilityResult> = {};

    try {
      // Procesar en lotes pequeños para evitar sobrecarga
      const batchSize = 3;
      for (let i = 0; i < cuadrillas.length; i += batchSize) {
        const batch = cuadrillas.slice(i, i + batchSize);
        const promises = batch.map(async cuadrilla => {
          const result = await checkCuadrillaAvailability(cuadrilla.id, fechaInmersion, inmersionId);
          return { id: cuadrilla.id, result };
        });
        
        const results = await Promise.all(promises);
        results.forEach(({ id, result }) => {
          statusMap[id] = result;
        });
      }
      
      setAvailabilityStatus(statusMap);
    } catch (error) {
      console.error('Error checking bulk availability:', error);
      setAvailabilityStatus({});
    } finally {
      setCheckingAvailability(false);
    }
  }, [checkCuadrillaAvailability]);

  return {
    availabilityStatus,
    checkingAvailability,
    checkCuadrillaAvailability,
    checkBulkAvailability
  };
};
