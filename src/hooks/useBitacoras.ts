import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Tipos básicos simplificados
export interface BitacoraSupervisor {
  bitacora_id: string;
  codigo: string;
  inmersion_id: string;
  supervisor: string;
  desarrollo_inmersion: string;
  incidentes: string;
  evaluacion_general: string;
  fecha: string;
  firmado: boolean;
  estado_aprobacion: string;
  created_at: string;
  updated_at: string;
  equipo_buceo_id?: string;
  operacion_id?: string;
}

export interface BitacoraBuzo {
  bitacora_id: string;
  codigo: string;
  inmersion_id: string;
  buzo: string;
  fecha: string;
  profundidad_maxima: number;
  trabajos_realizados: string;
  estado_fisico_post: string;
  observaciones_tecnicas: string;
  firmado: boolean;
  estado_aprobacion: string;
  created_at: string;
  updated_at: string;
  equipo_buceo_id?: string;
  operacion_id?: string;
  bitacora_supervisor_id?: string;
}

export interface BitacoraSupervisorFormData {
  codigo: string;
  inmersion_id: string;
  supervisor: string;
  fecha: string;
  firmado: boolean;
  estado_aprobacion: 'pendiente' | 'aprobada' | 'rechazada';
  fecha_inicio_faena: string;
  hora_inicio_faena: string;
  hora_termino_faena: string;
  lugar_trabajo: string;
  supervisor_nombre_matricula: string;
  estado_mar: string;
  visibilidad_fondo: number;
  inmersiones_buzos: any[];
  equipos_utilizados: any[];
  trabajo_a_realizar: string;
  descripcion_trabajo: string;
  embarcacion_apoyo: string;
  observaciones_generales_texto: string;
  validacion_contratista: boolean;
  comentarios_validacion: string;
  diving_records: any[];
  supervisor_id: string;
  desarrollo_inmersion: string;
  incidentes: string;
  evaluacion_general: string;
}

export interface BitacoraBuzoFormData {
  codigo: string;
  inmersion_id: string;
  buzo: string;
  fecha: string;
  profundidad_maxima: number;
  trabajos_realizados: string;
  estado_fisico_post: string;
  observaciones_tecnicas?: string;
  firmado: boolean;
}

// Hook simplificado para manejar bitácoras
export const useBitacoras = () => {
  const queryClient = useQueryClient();

  // Obtener inmersiones con información básica
  const { data: inmersiones = [], isLoading: loadingInmersiones } = useQuery<any[]>({
    queryKey: ['inmersiones-con-equipos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inmersion')
        .select(`
          *,
          operacion:operacion_id(
            *,
            salmoneras:salmonera_id(nombre),
            sitios:sitio_id(nombre),
            contratistas:contratista_id(nombre)
          )
        `)
        .order('fecha_inmersion', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: bitacorasSupervisor = [], isLoading: loadingSupervisor } = useQuery<BitacoraSupervisor[]>({
    queryKey: ['bitacoras-supervisor'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bitacora_supervisor')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: bitacorasBuzo = [], isLoading: loadingBuzo } = useQuery<BitacoraBuzo[]>({
    queryKey: ['bitacoras-buzo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bitacora_buzo')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const createBitacoraSupervisor = useMutation<BitacoraSupervisor, Error, BitacoraSupervisorFormData>({
    mutationFn: async (data: BitacoraSupervisorFormData) => {
      const { data: result, error } = await supabase
        .from('bitacora_supervisor')
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacoras-supervisor'] });
    }
  });

  const createBitacoraBuzo = useMutation<BitacoraBuzo, Error, BitacoraBuzoFormData>({
    mutationFn: async (data: BitacoraBuzoFormData) => {
      const { data: result, error } = await supabase
        .from('bitacora_buzo')
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacoras-buzo'] });
    }
  });

  const checkCanDeleteInmersion = async (inmersionId: string): Promise<{ canDelete: boolean; reason?: string }> => {
    try {
      const { data: bitacorasSup } = await supabase
        .from('bitacora_supervisor')
        .select('bitacora_id')
        .eq('inmersion_id', inmersionId);

      if (bitacorasSup && bitacorasSup.length > 0) {
        return { canDelete: false, reason: 'La inmersión tiene bitácoras de supervisor asociadas' };
      }

      const { data: bitacorasBuz } = await supabase
        .from('bitacora_buzo')
        .select('bitacora_id')
        .eq('inmersion_id', inmersionId);

      if (bitacorasBuz && bitacorasBuz.length > 0) {
        return { canDelete: false, reason: 'La inmersión tiene bitácoras de buzo asociadas' };
      }

      return { canDelete: true };
    } catch (error) {
      console.error('Error checking if immersion can be deleted:', error);
      return { canDelete: false, reason: 'Error al verificar bitácoras asociadas' };
    }
  };

  const refreshBitacoras = () => {
    queryClient.invalidateQueries({ queryKey: ['bitacoras-supervisor'] });
    queryClient.invalidateQueries({ queryKey: ['bitacoras-buzo'] });
    queryClient.invalidateQueries({ queryKey: ['inmersiones-con-equipos'] });
  };

  return {
    inmersiones,
    bitacorasSupervisor,
    bitacorasBuzo,
    loadingInmersiones,
    loadingSupervisor,
    loadingBuzo,
    loading: loadingSupervisor || loadingBuzo || loadingInmersiones,
    createBitacoraSupervisor,
    createBitacoraBuzo,
    checkCanDeleteInmersion,
    refreshBitacoras
  };
};
