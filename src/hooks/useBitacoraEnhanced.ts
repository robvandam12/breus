import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface InmersionCompleta {
  inmersion_id: string;
  codigo: string;
  fecha_inmersion: string;
  objetivo: string;
  supervisor: string;
  buzo_principal: string;
  hora_inicio: string;
  hora_fin?: string;
  profundidad_max: number;
  temperatura_agua: number;
  visibilidad: number;
  corriente: string;
  operacion: {
    id: string;
    nombre: string;
    codigo: string;
    salmoneras?: { nombre: string };
    contratistas?: { nombre: string };
    sitios?: { nombre: string };
    equipos_buceo?: { nombre: string };
  };
  equipo_buceo_id?: string;
  operacion_id: string;
  supervisor_id?: string;
  buzo_principal_id?: string;
}

export interface BitacoraSupervisorCompleta {
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
  inmersion?: InmersionCompleta;
}

export interface BitacoraBuzoCompleta {
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
  inmersion?: InmersionCompleta;
  bitacora_supervisor_id?: string;
}

export interface BitacoraBuzoFormData {
  inmersion_id: string;
  buzo_id: string;
  fecha: string;
  profundidad_maxima: number;
  trabajos_realizados: string;
  estado_fisico_post: string;
  observaciones_tecnicas: string;
}

export const useBitacoraEnhanced = () => {
  const queryClient = useQueryClient();

  // Obtener inmersiones con información completa
  const { data: inmersiones = [], isLoading: loadingInmersiones } = useQuery<InmersionCompleta[]>({
    queryKey: ['inmersiones-completas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inmersion')
        .select(`
          *,
          operacion:operacion_id(
            *,
            salmoneras:salmonera_id(nombre),
            sitios:sitio_id(nombre),
            contratistas:contratista_id(nombre),
            equipos_buceo:equipo_buceo_id(nombre)
          )
        `)
        .order('fecha_inmersion', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Obtener bitácoras de supervisor con inmersiones
  const { data: bitacorasSupervisor = [], isLoading: loadingSupervisor } = useQuery<BitacoraSupervisorCompleta[]>({
    queryKey: ['bitacoras-supervisor-completas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bitacora_supervisor')
        .select(`
          *,
          inmersion:inmersion_id(
            *,
            operacion:operacion_id(
              *,
              salmoneras:salmonera_id(nombre),
              sitios:sitio_id(nombre),
              contratistas:contratista_id(nombre),
              equipos_buceo:equipo_buceo_id(nombre)
            )
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Obtener bitácoras de buzo con inmersiones
  const { data: bitacorasBuzo = [], isLoading: loadingBuzo } = useQuery<BitacoraBuzoCompleta[]>({
    queryKey: ['bitacoras-buzo-completas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bitacora_buzo')
        .select(`
          *,
          inmersion:inmersion_id(
            *,
            operacion:operacion_id(
              *,
              salmoneras:salmonera_id(nombre),
              sitios:sitio_id(nombre),
              contratistas:contratista_id(nombre),
              equipos_buceo:equipo_buceo_id(nombre)
            )
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Buscar bitácora de supervisor para una inmersión específica
  const getBitacoraSupervisorForInmersion = async (inmersionId: string): Promise<BitacoraSupervisorCompleta | null> => {
    const { data, error } = await supabase
      .from('bitacora_supervisor')
      .select(`
        *,
        inmersion:inmersion_id(
          *,
          operacion:operacion_id(
            *,
            salmoneras:salmonera_id(nombre),
            sitios:sitio_id(nombre),
            contratistas:contratista_id(nombre),
            equipos_buceo:equipo_buceo_id(nombre)
          )
        )
      `)
      .eq('inmersion_id', inmersionId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  };

  // Verificar si existe bitácora de supervisor para una inmersión
  const checkSupervisorBitacoraExists = async (inmersionId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('bitacora_supervisor')
      .select('bitacora_id')
      .eq('inmersion_id', inmersionId)
      .limit(1);

    if (error) throw error;
    return (data && data.length > 0) || false;
  };

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ['inmersiones-completas'] });
    queryClient.invalidateQueries({ queryKey: ['bitacoras-supervisor-completas'] });
    queryClient.invalidateQueries({ queryKey: ['bitacoras-buzo-completas'] });
  };

  return {
    inmersiones,
    bitacorasSupervisor,
    bitacorasBuzo,
    loadingInmersiones,
    loadingSupervisor,
    loadingBuzo,
    loading: loadingInmersiones || loadingSupervisor || loadingBuzo,
    getBitacoraSupervisorForInmersion,
    checkSupervisorBitacoraExists,
    refreshAll
  };
};
