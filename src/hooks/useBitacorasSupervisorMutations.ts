
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CuadrillaMemberData, TiemposDetallados } from "@/types/bitacoras";

export interface BitacoraSupervisorFormData {
  inmersion_id?: string;
  codigo?: string;
  fecha?: string;
  firmado?: boolean;
  supervisor?: string;
  estado_aprobacion?: string;
  comentarios_validacion?: string;
  desarrollo_inmersion?: string;
  descripcion_trabajo?: string;
  trabajo_a_realizar?: string;
  incidentes?: string;
  evaluacion_general?: string;
  lugar_trabajo?: string;
  centro_nombre?: string;
  empresa_nombre?: string;
  estado_mar?: string;
  embarcacion_apoyo?: string;
  fecha_inicio_faena?: string;
  hora_inicio_faena?: string;
  hora_termino_faena?: string;
  visibilidad_fondo?: number;
  supervisor_nombre_matricula?: string;
  inmersiones_buzos?: any[];
  equipos_utilizados?: any[];
  diving_records?: any[];
  observaciones_generales_texto?: string;
  validacion_contratista?: boolean;
  company_id?: string;
  company_type?: 'salmonera' | 'contratista';
  // Nuevos campos para cuadrilla
  datos_cuadrilla?: CuadrillaMemberData[];
  tiempos_detallados?: TiemposDetallados;
}

export const useBitacorasSupervisorMutations = () => {
  const queryClient = useQueryClient();

  const createBitacoraSupervisor = useMutation({
    mutationFn: async (data: Partial<BitacoraSupervisorFormData>) => {
      if (!data.company_id || !data.company_type) {
        throw new Error('Contexto empresarial requerido para crear bitácora de supervisor');
      }

      // Procesar datos de cuadrilla y tiempos
      const tiemposDetallados: TiemposDetallados = {};
      if (data.datos_cuadrilla) {
        data.datos_cuadrilla.forEach(member => {
          if (member.usuario_id && member.hora_entrada && member.hora_salida) {
            tiemposDetallados[member.usuario_id] = {
              hora_entrada: member.hora_entrada,
              hora_salida: member.hora_salida,
              profundidad_maxima: member.profundidad_maxima || 0,
              tiempo_fondo_minutos: member.tiempo_total_minutos || 0,
              observaciones_tiempos: member.observaciones
            };
          }
        });
      }

      const insertData = {
        inmersion_id: data.inmersion_id,
        codigo: data.codigo,
        fecha: data.fecha,
        supervisor: data.supervisor,
        desarrollo_inmersion: data.desarrollo_inmersion,
        incidentes: data.incidentes || '',
        evaluacion_general: data.evaluacion_general,
        lugar_trabajo: data.lugar_trabajo,
        estado_aprobacion: data.estado_aprobacion || 'pendiente',
        firmado: data.firmado || false,
        company_id: data.company_id,
        company_type: data.company_type,
        supervisor_nombre_matricula: data.supervisor_nombre_matricula,
        fecha_inicio_faena: data.fecha_inicio_faena,
        hora_inicio_faena: data.hora_inicio_faena,
        hora_termino_faena: data.hora_termino_faena,
        estado_mar: data.estado_mar,
        visibilidad_fondo: data.visibilidad_fondo,
        trabajo_a_realizar: data.trabajo_a_realizar,
        descripcion_trabajo: data.descripcion_trabajo,
        embarcacion_apoyo: data.embarcacion_apoyo,
        observaciones_generales_texto: data.observaciones_generales_texto,
        validacion_contratista: data.validacion_contratista,
        inmersiones_buzos: data.inmersiones_buzos || [],
        equipos_utilizados: data.equipos_utilizados || [],
        diving_records: data.diving_records || [],
        // Convertir a JSON para compatibilidad con Supabase
        datos_cuadrilla: JSON.stringify(data.datos_cuadrilla || []),
        tiempos_detallados: JSON.stringify(tiemposDetallados),
      };

      const { data: result, error } = await supabase
        .from('bitacora_supervisor')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: async (result) => {
      queryClient.invalidateQueries({ queryKey: ['bitacorasSupervisor'] });
      
      // Si la bitácora fue firmada, crear notificaciones para los buzos
      if (result.firmado && result.datos_cuadrilla) {
        const cuadrillaData = typeof result.datos_cuadrilla === 'string' 
          ? JSON.parse(result.datos_cuadrilla) 
          : result.datos_cuadrilla;
        await notifyTeamMembers(result.bitacora_id, cuadrillaData as CuadrillaMemberData[]);
      }
      
      toast({
        title: "Bitácora creada",
        description: "La bitácora de supervisor ha sido creada exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Error creating bitacora supervisor:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la bitácora de supervisor.",
        variant: "destructive",
      });
    },
  });

  const updateBitacoraSupervisor = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BitacoraSupervisorFormData> }) => {
      // Procesar tiempos detallados si hay datos de cuadrilla
      const tiemposDetallados: TiemposDetallados = {};
      if (data.datos_cuadrilla) {
        data.datos_cuadrilla.forEach(member => {
          if (member.usuario_id && member.hora_entrada && member.hora_salida) {
            tiemposDetallados[member.usuario_id] = {
              hora_entrada: member.hora_entrada,
              hora_salida: member.hora_salida,
              profundidad_maxima: member.profundidad_maxima || 0,
              tiempo_fondo_minutos: member.tiempo_total_minutos || 0,
              observaciones_tiempos: member.observaciones
            };
          }
        });
      }

      const updateData = {
        ...data,
        // Convertir a JSON para compatibilidad
        datos_cuadrilla: data.datos_cuadrilla ? JSON.stringify(data.datos_cuadrilla) : undefined,
        tiempos_detallados: JSON.stringify(tiemposDetallados)
      };

      const { data: result, error } = await supabase
        .from('bitacora_supervisor')
        .update(updateData)
        .eq('bitacora_id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: async (result) => {
      queryClient.invalidateQueries({ queryKey: ['bitacorasSupervisor'] });
      
      // Si se firmó la bitácora, notificar al equipo
      if (result.firmado && result.datos_cuadrilla) {
        const cuadrillaData = typeof result.datos_cuadrilla === 'string' 
          ? JSON.parse(result.datos_cuadrilla) 
          : result.datos_cuadrilla;
        await notifyTeamMembers(result.bitacora_id, cuadrillaData as CuadrillaMemberData[]);
      }
      
      toast({
        title: "Bitácora actualizada",
        description: "La bitácora de supervisor ha sido actualizada exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating bitacora supervisor:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la bitácora de supervisor.",
        variant: "destructive",
      });
    },
  });

  const updateBitacoraSupervisorSignature = useMutation({
    mutationFn: async ({ bitacoraId, signatureData }: { bitacoraId: string; signatureData: string }) => {
      const { data: result, error } = await supabase
        .from('bitacora_supervisor')
        .update({ 
          supervisor_firma: signatureData,
          firmado: true 
        })
        .eq('bitacora_id', bitacoraId)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: async (result) => {
      queryClient.invalidateQueries({ queryKey: ['bitacorasSupervisor'] });
      
      // Notificar a los miembros del equipo que pueden completar sus bitácoras
      if (result.datos_cuadrilla) {
        const cuadrillaData = typeof result.datos_cuadrilla === 'string' 
          ? JSON.parse(result.datos_cuadrilla) 
          : result.datos_cuadrilla;
        await notifyTeamMembers(result.bitacora_id, cuadrillaData as CuadrillaMemberData[]);
      }
      
      toast({
        title: "Bitácora firmada",
        description: "La bitácora de supervisor ha sido firmada exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Error signing bitacora supervisor:', error);
      toast({
        title: "Error",
        description: "No se pudo firmar la bitácora de supervisor.",
        variant: "destructive",
      });
    },
  });

  const deleteBitacoraSupervisor = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('bitacora_supervisor')
        .delete()
        .eq('bitacora_id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacorasSupervisor'] });
      toast({
        title: "Bitácora eliminada",
        description: "La bitácora de supervisor ha sido eliminada exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting bitacora supervisor:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la bitácora de supervisor.",
        variant: "destructive",
      });
    },
  });

  return {
    createBitacoraSupervisor: createBitacoraSupervisor.mutateAsync,
    updateBitacoraSupervisor: updateBitacoraSupervisor.mutateAsync,
    updateBitacoraSupervisorSignature: updateBitacoraSupervisorSignature.mutateAsync,
    deleteBitacoraSupervisor: deleteBitacoraSupervisor.mutateAsync,
    isCreating: createBitacoraSupervisor.isPending,
    isUpdating: updateBitacoraSupervisor.isPending,
    isDeleting: deleteBitacoraSupervisor.isPending,
  };
};

// Función auxiliar para notificar a los miembros del equipo
const notifyTeamMembers = async (bitacoraId: string, cuadrillaData: CuadrillaMemberData[]) => {
  try {
    // Aquí implementaremos la lógica de notificaciones
    // Por ahora solo log para debug
    console.log('Notifying team members for bitacora:', bitacoraId, cuadrillaData);
    
    // TODO: Implementar notificaciones push/email a los buzos
    // const buzos = cuadrillaData.filter(member => member.rol !== 'supervisor');
    // await Promise.all(buzos.map(buzo => sendNotification(buzo.usuario_id, bitacoraId)));
  } catch (error) {
    console.error('Error notifying team members:', error);
  }
};
