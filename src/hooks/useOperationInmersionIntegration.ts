
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useOperaciones } from './useOperaciones';

export const useOperationInmersionIntegration = () => {
  const queryClient = useQueryClient();
  const { validateOperacionCompleteness } = useOperaciones();

  // Validar operación antes de crear inmersión
  const validateBeforeInmersion = async (operacionId: string) => {
    try {
      const validation = await validateOperacionCompleteness(operacionId);
      
      if (!validation.canExecute) {
        const missing = [];
        if (!validation.hptReady) missing.push('HPT firmado');
        if (!validation.anexoBravoReady) missing.push('Anexo Bravo firmado');
        if (!validation.supervisorAsignado) missing.push('Supervisor asignado');
        if (!validation.equipoAsignado) missing.push('Equipo de buceo asignado');
        if (!validation.sitioAsignado) missing.push('Sitio asignado');

        return {
          canProceed: false,
          missing: missing,
          message: `Faltan los siguientes requisitos: ${missing.join(', ')}`
        };
      }

      return {
        canProceed: true,
        message: 'La operación está lista para inmersiones'
      };
    } catch (error) {
      console.error('Error validating operation for inmersion:', error);
      return {
        canProceed: false,
        missing: ['Error de validación'],
        message: 'Error al validar la operación'
      };
    }
  };

  // Obtener datos completos de operación para auto-poblar inmersión
  const getOperationDataForInmersion = async (operacionId: string) => {
    try {
      const { data: operacion, error: opError } = await supabase
        .from('operacion')
        .select(`
          *,
          sitios:sitio_id(nombre, codigo, coordenadas_lat, coordenadas_lng, profundidad_maxima),
          equipos_buceo:equipo_buceo_id(
            *
          ),
          usuario_supervisor:supervisor_asignado_id(nombre, apellido, email)
        `)
        .eq('id', operacionId)
        .single();

      if (opError) throw opError;

      // Obtener miembros del equipo por separado
      let equipoBuzos: any[] = [];
      if (operacion.equipo_buceo_id) {
        const { data: miembros } = await supabase
          .from('equipo_buceo_miembros')
          .select(`
            *,
            usuario:usuario_id(nombre, apellido, email)
          `)
          .eq('equipo_id', operacion.equipo_buceo_id);
        
        equipoBuzos = miembros?.filter((m: any) => 
          ['buzo', 'buzo_principal', 'buzo_asistente'].includes(m.rol_equipo)
        ) || [];
      }

      // Obtener datos de HPT
      const { data: hpt } = await supabase
        .from('hpt')
        .select('supervisor, profundidad_maxima, plan_trabajo')
        .eq('operacion_id', operacionId)
        .eq('firmado', true)
        .maybeSingle();

      // Obtener datos de Anexo Bravo
      const { data: anexoBravo } = await supabase
        .from('anexo_bravo')
        .select('supervisor, lugar_faena')
        .eq('operacion_id', operacionId)
        .eq('firmado', true)
        .maybeSingle();

      return {
        operacion,
        hpt,
        anexoBravo,
        autoPopulateData: {
          supervisor: hpt?.supervisor || anexoBravo?.supervisor || 
                     (operacion.usuario_supervisor ? 
                      `${operacion.usuario_supervisor.nombre} ${operacion.usuario_supervisor.apellido}` : ''),
          profundidad_max: hpt?.profundidad_maxima || operacion.sitios?.profundidad_maxima || 30,
          sitio_nombre: operacion.sitios?.nombre || '',
          equipo_buzos: equipoBuzos
        }
      };
    } catch (error) {
      console.error('Error getting operation data for inmersion:', error);
      throw error;
    }
  };

  // Crear inmersión con validación previa
  const createInmersionWithValidation = useMutation({
    mutationFn: async ({ operacionId, inmersionData }: { operacionId: string; inmersionData: any }) => {
      // Primero validar la operación
      const validation = await validateBeforeInmersion(operacionId);
      
      if (!validation.canProceed) {
        throw new Error(validation.message);
      }

      // Obtener datos para auto-poblar
      const operationData = await getOperationDataForInmersion(operacionId);
      
      // Crear inmersión con datos auto-poblados
      const enrichedInmersionData = {
        ...inmersionData,
        operacion_id: operacionId,
        supervisor: inmersionData.supervisor || operationData.autoPopulateData.supervisor,
        profundidad_max: inmersionData.profundidad_max || operationData.autoPopulateData.profundidad_max,
        buzo_principal: inmersionData.buzo_principal || 
          (operationData.autoPopulateData.equipo_buzos?.[0]?.usuario ? 
           `${operationData.autoPopulateData.equipo_buzos[0].usuario.nombre} ${operationData.autoPopulateData.equipo_buzos[0].usuario.apellido}` : ''),
        buzo_asistente: inmersionData.buzo_asistente || 
          (operationData.autoPopulateData.equipo_buzos?.[1]?.usuario ? 
           `${operationData.autoPopulateData.equipo_buzos[1].usuario.nombre} ${operationData.autoPopulateData.equipo_buzos[1].usuario.apellido}` : ''),
        hpt_validado: true,
        anexo_bravo_validado: true
      };

      const { data, error } = await supabase
        .from('inmersion')
        .insert([enrichedInmersionData])
        .select()
        .single();

      if (error) throw error;

      return { inmersion: data, operationData };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      
      toast({
        title: "Inmersión creada exitosamente",
        description: "La inmersión ha sido creada con datos auto-poblados desde la operación.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al crear inmersión",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Verificar estado de operación después de completar inmersiones
  const checkOperationCompletionStatus = async (operacionId: string) => {
    try {
      // Obtener todas las inmersiones de la operación
      const { data: inmersiones } = await supabase
        .from('inmersion')
        .select('inmersion_id, estado')
        .eq('operacion_id', operacionId);

      if (!inmersiones || inmersiones.length === 0) {
        return { isComplete: false, message: 'No hay inmersiones registradas' };
      }

      const completedInmersiones = inmersiones.filter(i => i.estado === 'completada').length;
      const totalInmersiones = inmersiones.length;

      // Verificar si todas las inmersiones tienen bitácoras firmadas
      const inmersionesWithBitacoras = await Promise.all(
        inmersiones.map(async (inmersion) => {
          const [supervisorBitacora, buzoBitacora] = await Promise.all([
            supabase.from('bitacora_supervisor').select('firmado').eq('inmersion_id', inmersion.inmersion_id).maybeSingle(),
            supabase.from('bitacora_buzo').select('firmado').eq('inmersion_id', inmersion.inmersion_id).maybeSingle()
          ]);

          return {
            inmersion_id: inmersion.inmersion_id,
            hasSupervisorBitacora: supervisorBitacora.data?.firmado || false,
            hasBuzoBitacora: buzoBitacora.data?.firmado || false
          };
        })
      );

      const completeWithBitacoras = inmersionesWithBitacoras.filter(i => 
        i.hasSupervisorBitacora && i.hasBuzoBitacora
      ).length;

      const isComplete = completeWithBitacoras === totalInmersiones;

      if (isComplete) {
        // Marcar operación como completada
        await supabase
          .from('operacion')
          .update({ estado: 'completada' })
          .eq('id', operacionId);

        // Emitir evento de dominio
        await supabase.rpc('emit_domain_event', {
          p_event_type: 'OPERATION_COMPLETED',
          p_aggregate_id: operacionId,
          p_aggregate_type: 'operacion',
          p_event_data: {
            operacion_id: operacionId,
            total_inmersiones: totalInmersiones,
            completed_at: new Date().toISOString()
          }
        });
      }

      return {
        isComplete,
        totalInmersiones,
        completedInmersiones,
        completeWithBitacoras,
        message: isComplete ? 'Operación completada' : `${completeWithBitacoras}/${totalInmersiones} inmersiones con bitácoras completas`
      };
    } catch (error) {
      console.error('Error checking operation completion:', error);
      return { isComplete: false, message: 'Error al verificar completitud' };
    }
  };

  return {
    validateBeforeInmersion,
    getOperationDataForInmersion,
    createInmersionWithValidation,
    checkOperationCompletionStatus,
    isCreatingInmersion: createInmersionWithValidation.isPending
  };
};
