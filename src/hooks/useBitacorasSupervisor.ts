
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface BitacoraSupervisor {
  bitacora_id: string;
  inmersion_id: string;
  fecha: string;
  codigo: string;
  supervisor: string;
  lugar_trabajo?: string;
  centro_nombre?: string;
  empresa_nombre?: string;
  fecha_inicio_faena?: string;
  hora_inicio_faena?: string;
  hora_termino_faena?: string;
  trabajo_a_realizar?: string;
  descripcion_trabajo?: string;
  estado_mar?: string;
  visibilidad_fondo?: number;
  embarcacion_apoyo?: string;
  supervisor_nombre_matricula?: string;
  inmersiones_buzos?: any[];
  equipos_utilizados?: any[];
  desarrollo_inmersion: string;
  evaluacion_general: string;
  incidentes?: string;
  observaciones_generales_texto?: string;
  supervisor_firma?: string;
  firmado: boolean;
  estado_aprobacion?: string;
  comentarios_aprobacion?: string;
  aprobada_por?: string;
  fecha_aprobacion?: string;
  validacion_contratista?: boolean;
  comentarios_validacion?: string;
  diving_records?: any[];
  codigo_verificacion?: string;
  folio?: string;
  created_at: string;
  updated_at: string;
}

export interface BitacoraSupervisorFormData {
  inmersion_id: string;
  fecha: string;
  codigo: string;
  supervisor: string;
  lugar_trabajo?: string;
  centro_nombre?: string;
  empresa_nombre?: string;
  fecha_inicio_faena?: string;
  hora_inicio_faena?: string;
  hora_termino_faena?: string;
  trabajo_a_realizar?: string;
  descripcion_trabajo?: string;
  estado_mar?: string;
  visibilidad_fondo?: number;
  embarcacion_apoyo?: string;
  supervisor_nombre_matricula?: string;
  inmersiones_buzos?: any[];
  equipos_utilizados?: any[];
  desarrollo_inmersion: string;
  evaluacion_general: string;
  incidentes?: string;
  observaciones_generales_texto?: string;
  diving_records?: any[];
  folio?: string;
  firmado?: boolean;
  validacion_contratista?: boolean;
  comentarios_validacion?: string;
  estado_aprobacion?: string;
  operacion_id?: string;
  equipo_buceo_id?: string;
}

export const useBitacorasSupervisor = () => {
  const queryClient = useQueryClient();

  const { data: bitacorasSupervisor = [], isLoading } = useQuery<BitacoraSupervisor[]>({
    queryKey: ['bitacorasSupervisor'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bitacora_supervisor')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Procesar los datos para asegurar que los campos JSON sean arrays
      const processedData = (data || []).map(item => ({
        ...item,
        inmersiones_buzos: Array.isArray(item.inmersiones_buzos) ? item.inmersiones_buzos : [],
        equipos_utilizados: Array.isArray(item.equipos_utilizados) ? item.equipos_utilizados : [],
        diving_records: Array.isArray(item.diving_records) ? item.diving_records : []
      }));
      
      return processedData;
    },
  });

  const createBitacoraSupervisor = useMutation({
    mutationFn: async (formData: BitacoraSupervisorFormData) => {
      console.log('Creating bitacora supervisor with data:', formData);
      
      const dataToInsert = {
        inmersion_id: formData.inmersion_id,
        fecha: formData.fecha,
        codigo: formData.codigo,
        supervisor: formData.supervisor,
        lugar_trabajo: formData.lugar_trabajo,
        centro_nombre: formData.centro_nombre,
        empresa_nombre: formData.empresa_nombre,
        fecha_inicio_faena: formData.fecha_inicio_faena,
        hora_inicio_faena: formData.hora_inicio_faena,
        hora_termino_faena: formData.hora_termino_faena,
        trabajo_a_realizar: formData.trabajo_a_realizar,
        descripcion_trabajo: formData.descripcion_trabajo,
        estado_mar: formData.estado_mar,
        visibilidad_fondo: formData.visibilidad_fondo,
        embarcacion_apoyo: formData.embarcacion_apoyo,
        supervisor_nombre_matricula: formData.supervisor_nombre_matricula,
        inmersiones_buzos: formData.inmersiones_buzos || [],
        equipos_utilizados: formData.equipos_utilizados || [],
        desarrollo_inmersion: formData.desarrollo_inmersion,
        evaluacion_general: formData.evaluacion_general,
        incidentes: formData.incidentes,
        observaciones_generales_texto: formData.observaciones_generales_texto,
        diving_records: formData.diving_records || [],
        folio: formData.folio,
        firmado: formData.firmado || false,
        validacion_contratista: formData.validacion_contratista || false,
        comentarios_validacion: formData.comentarios_validacion,
        estado_aprobacion: formData.estado_aprobacion || 'pendiente'
      };
      
      console.log('Data to insert:', dataToInsert);
      
      const { data, error } = await supabase
        .from('bitacora_supervisor')
        .insert([dataToInsert])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating bitacora supervisor:', error);
        throw error;
      }
      
      console.log('Bitacora supervisor created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacorasSupervisor'] });
      queryClient.invalidateQueries({ queryKey: ['operacionDetails'] });
      toast({
        title: "Bitácora creada",
        description: "La bitácora de supervisor ha sido creada exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Error creating bitacora supervisor:', error);
      toast({
        title: "Error",
        description: `No se pudo crear la bitácora de supervisor: ${error.message || 'Error desconocido'}`,
        variant: "destructive",
      });
    },
  });

  const updateBitacoraSupervisor = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BitacoraSupervisorFormData> }) => {
      const { data: result, error } = await supabase
        .from('bitacora_supervisor')
        .update(data)
        .eq('bitacora_id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacorasSupervisor'] });
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
    bitacorasSupervisor,
    isLoading,
    createBitacoraSupervisor,
    updateBitacoraSupervisor,
    deleteBitacoraSupervisor,
  };
};
