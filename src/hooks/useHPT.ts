
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { HPT, HPTFormData, HPTWithOperacion } from "@/types/hpt";

// Re-export for compatibility
export type { HPTFormData } from "@/types/hpt";

export const useHPT = () => {
  const queryClient = useQueryClient();

  const { data: hpts = [], isLoading, error } = useQuery({
    queryKey: ['hpts'],
    queryFn: async () => {
      console.log('useHPT - Fetching HPTs...');
      const { data, error } = await supabase
        .from('hpt')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('useHPT - Error fetching HPTs:', error);
        throw error;
      }

      console.log('useHPT - HPTs data:', data);
      return data as unknown as HPTWithOperacion[];
    },
  });

  const createHPTMutation = useMutation({
    mutationFn: async (hptData: HPTFormData) => {
      console.log('Creating HPT:', hptData);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const insertData = {
        codigo: hptData.codigo,
        supervisor: hptData.supervisor,
        operacion_id: hptData.operacion_id,
        plan_trabajo: hptData.plan_trabajo,
        fecha_programada: hptData.fecha_programada,
        hora_inicio: hptData.hora_inicio,
        hora_fin: hptData.hora_fin,
        hora_termino: hptData.hora_termino,
        descripcion_trabajo: hptData.descripcion_trabajo,
        descripcion_tarea: hptData.descripcion_tarea,
        profundidad_maxima: hptData.profundidad_maxima,
        temperatura: hptData.temperatura,
        observaciones: hptData.observaciones,
        es_rutinaria: hptData.es_rutinaria,
        lugar_especifico: hptData.lugar_especifico,
        estado_puerto: hptData.estado_puerto,
        empresa_servicio_nombre: hptData.empresa_servicio_nombre,
        centro_trabajo_nombre: hptData.centro_trabajo_nombre,
        supervisor_nombre: hptData.supervisor_nombre,
        jefe_mandante_nombre: hptData.jefe_mandante_nombre,
        tipo_trabajo: hptData.tipo_trabajo,
        folio: hptData.folio,
        fecha: hptData.fecha,
        plan_emergencia: hptData.plan_emergencia,
        camara_hiperbarica: hptData.camara_hiperbarica,
        hospital_cercano: hptData.hospital_cercano,
        visibilidad: hptData.visibilidad,
        corrientes: hptData.corrientes,
        jefe_obra: hptData.jefe_obra,
        buzos: JSON.stringify(hptData.buzos || []),
        asistentes: JSON.stringify(hptData.asistentes || []),
        herramientas: JSON.stringify(hptData.herramientas || []),
        equipo_buceo: JSON.stringify(hptData.equipo_buceo || []),
        equipo_seguridad: JSON.stringify(hptData.equipo_seguridad || []),
        equipo_comunicacion: JSON.stringify(hptData.equipo_comunicacion || []),
        contactos_emergencia: JSON.stringify(hptData.contactos_emergencia || []),
        riesgos_identificados: JSON.stringify(hptData.riesgos_identificados || []),
        medidas_control: JSON.stringify(hptData.medidas_control || []),
        hpt_epp: hptData.hpt_epp ? JSON.stringify(hptData.hpt_epp) : undefined,
        hpt_erc: hptData.hpt_erc ? JSON.stringify(hptData.hpt_erc) : undefined,
        hpt_medidas: hptData.hpt_medidas ? JSON.stringify(hptData.hpt_medidas) : undefined,
        hpt_riesgos_comp: hptData.hpt_riesgos_comp ? JSON.stringify(hptData.hpt_riesgos_comp) : undefined,
        hpt_conocimiento: hptData.hpt_conocimiento ? JSON.stringify(hptData.hpt_conocimiento) : undefined,
        hpt_conocimiento_asistentes: JSON.stringify(hptData.hpt_conocimiento_asistentes || []),
        user_id: user.id,
        fecha_creacion: new Date().toISOString().split('T')[0],
        estado: 'borrador',
        progreso: 0,
        firmado: false
      };

      const { data, error } = await supabase
        .from('hpt')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Error creating HPT:', error);
        throw error;
      }

      console.log('HPT created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hpts'] });
      queryClient.invalidateQueries({ queryKey: ['workflow-status'] });
      toast({
        title: "HPT creada",
        description: "La Hoja de Planificación de Tarea ha sido creada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating HPT:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la HPT. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const updateHPTMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<HPTFormData> }) => {
      console.log('Updating HPT:', id, data);
      const updateData = {
        codigo: data.codigo,
        supervisor: data.supervisor,
        plan_trabajo: data.plan_trabajo,
        fecha_programada: data.fecha_programada,
        hora_inicio: data.hora_inicio,
        hora_fin: data.hora_fin,
        hora_termino: data.hora_termino,
        descripcion_trabajo: data.descripcion_trabajo,
        descripcion_tarea: data.descripcion_tarea,
        profundidad_maxima: data.profundidad_maxima,
        temperatura: data.temperatura,
        observaciones: data.observaciones,
        es_rutinaria: data.es_rutinaria,
        lugar_especifico: data.lugar_especifico,
        estado_puerto: data.estado_puerto,
        empresa_servicio_nombre: data.empresa_servicio_nombre,
        centro_trabajo_nombre: data.centro_trabajo_nombre,
        supervisor_nombre: data.supervisor_nombre,
        jefe_mandante_nombre: data.jefe_mandante_nombre,
        tipo_trabajo: data.tipo_trabajo,
        folio: data.folio,
        fecha: data.fecha,
        plan_emergencia: data.plan_emergencia,
        camara_hiperbarica: data.camara_hiperbarica,
        hospital_cercano: data.hospital_cercano,
        visibilidad: data.visibilidad,
        corrientes: data.corrientes,
        jefe_obra: data.jefe_obra,
        buzos: data.buzos ? JSON.stringify(data.buzos) : undefined,
        asistentes: data.asistentes ? JSON.stringify(data.asistentes) : undefined,
        herramientas: data.herramientas ? JSON.stringify(data.herramientas) : undefined,
        equipo_buceo: data.equipo_buceo ? JSON.stringify(data.equipo_buceo) : undefined,
        equipo_seguridad: data.equipo_seguridad ? JSON.stringify(data.equipo_seguridad) : undefined,
        equipo_comunicacion: data.equipo_comunicacion ? JSON.stringify(data.equipo_comunicacion) : undefined,
        contactos_emergencia: data.contactos_emergencia ? JSON.stringify(data.contactos_emergencia) : undefined,
        riesgos_identificados: data.riesgos_identificados ? JSON.stringify(data.riesgos_identificados) : undefined,
        medidas_control: data.medidas_control ? JSON.stringify(data.medidas_control) : undefined,
        hpt_epp: data.hpt_epp ? JSON.stringify(data.hpt_epp) : undefined,
        hpt_erc: data.hpt_erc ? JSON.stringify(data.hpt_erc) : undefined,
        hpt_medidas: data.hpt_medidas ? JSON.stringify(data.hpt_medidas) : undefined,
        hpt_riesgos_comp: data.hpt_riesgos_comp ? JSON.stringify(data.hpt_riesgos_comp) : undefined,
        hpt_conocimiento: data.hpt_conocimiento ? JSON.stringify(data.hpt_conocimiento) : undefined,
        hpt_conocimiento_asistentes: data.hpt_conocimiento_asistentes ? JSON.stringify(data.hpt_conocimiento_asistentes) : undefined
      };
      
      const { data: updatedData, error } = await supabase
        .from('hpt')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating HPT:', error);
        throw error;
      }

      console.log('HPT updated:', updatedData);
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hpts'] });
      queryClient.invalidateQueries({ queryKey: ['workflow-status'] });
      toast({
        title: "HPT actualizada",
        description: "La HPT ha sido actualizada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error updating HPT:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la HPT. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const signHPTMutation = useMutation({
    mutationFn: async ({ id, signatures }: { id: string; signatures: any }) => {
      console.log('Signing HPT:', id, signatures);
      const { data, error } = await supabase
        .from('hpt')
        .update({
          firmado: true,
          estado: 'firmado',
          progreso: 100,
          hpt_firmas: signatures
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error signing HPT:', error);
        throw error;
      }

      console.log('HPT signed:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hpts'] });
      queryClient.invalidateQueries({ queryKey: ['workflow-status'] });
      toast({
        title: "HPT firmada",
        description: "La HPT ha sido firmada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error signing HPT:', error);
      toast({
        title: "Error",
        description: "No se pudo firmar la HPT. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const deleteHPTMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting HPT:', id);
      const { error } = await supabase
        .from('hpt')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting HPT:', error);
        throw error;
      }

      console.log('HPT deleted:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hpts'] });
      queryClient.invalidateQueries({ queryKey: ['workflow-status'] });
      toast({
        title: "HPT eliminada",
        description: "La HPT ha sido eliminada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error deleting HPT:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la HPT. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  return {
    hpts,
    isLoading,
    error,
    createHPT: createHPTMutation.mutateAsync,
    updateHPT: updateHPTMutation.mutateAsync,
    signHPT: signHPTMutation.mutateAsync,
    deleteHPT: deleteHPTMutation.mutateAsync,
    isCreating: createHPTMutation.isPending,
    isUpdating: updateHPTMutation.isPending,
    isSigning: signHPTMutation.isPending,
    isDeleting: deleteHPTMutation.isPending,
  };
};
