import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

// Types
export interface BasicOperacion {
  id: string;
  codigo: string;
  nombre: string;
  tareas?: string;
  fecha_inicio: string;
  fecha_fin?: string;
  estado: string;
  estado_aprobacion?: string;
  salmonera_id?: string;
  contratista_id?: string;
  sitio_id?: string;
  servicio_id?: string;
  equipo_buceo_id?: string;
  supervisor_asignado_id?: string;
  created_at: string;
  updated_at: string;
}

export interface OperacionConRelaciones extends BasicOperacion {
  salmoneras?: { nombre: string };
  contratistas?: { nombre: string };
  sitios?: { nombre: string; coordenadas_lat?: number; coordenadas_lng?: number };
  equipos_buceo?: { nombre: string };
  usuario_supervisor?: { nombre: string; apellido: string };
}

export type Operacion = OperacionConRelaciones;

export interface OperacionFormData {
  nombre: string;
  codigo: string;
  tareas?: string;
  fecha_inicio: string;
  fecha_fin?: string;
  estado: 'activa' | 'completada' | 'cancelada' | 'pausada';
  salmonera_id?: string;
  contratista_id?: string;
  sitio_id?: string;
  servicio_id?: string;
  equipo_buceo_id?: string;
  supervisor_asignado_id?: string;
}

// Query hook with expanded data
const useOperacionesQuery = () => {
  const { profile } = useAuth();

  const { data: operaciones = [], isLoading, refetch } = useQuery<OperacionConRelaciones[]>({
    queryKey: ['operaciones'],
    queryFn: async () => {
      let query = supabase
        .from('operacion')
        .select(`
          *,
          salmoneras:salmonera_id(nombre),
          contratistas:contratista_id(nombre),
          sitios:sitio_id(nombre, coordenadas_lat, coordenadas_lng),
          equipos_buceo:equipo_buceo_id(nombre),
          usuario_supervisor:supervisor_asignado_id(nombre, apellido)
        `)
        .order('created_at', { ascending: false });

      // Filtrar según el rol del usuario
      if (profile?.role === 'admin_salmonera' && profile?.salmonera_id) {
        query = query.eq('salmonera_id', profile.salmonera_id);
      } else if (profile?.role === 'admin_servicio' && profile?.servicio_id) {
        query = query.eq('servicio_id', profile.servicio_id);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
  });

  return { operaciones, isLoading, refetch };
};

// Extended mutations hook
const useOperacionesMutations = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  const checkCanDelete = async (operacionId: string): Promise<{ canDelete: boolean; reason?: string }> => {
    try {
      const { data: hpts } = await supabase.from('hpt').select('id').eq('operacion_id', operacionId).limit(1);
      if (hpts && hpts.length > 0) return { canDelete: false, reason: 'tiene documentos HPT asociados' };
      const { data: anexos } = await supabase.from('anexo_bravo').select('id').eq('operacion_id', operacionId).limit(1);
      if (anexos && anexos.length > 0) return { canDelete: false, reason: 'tiene documentos Anexo Bravo asociados' };
      const { data: inmersiones } = await supabase.from('inmersion').select('inmersion_id').eq('operacion_id', operacionId).limit(1);
      if (inmersiones && inmersiones.length > 0) return { canDelete: false, reason: 'tiene inmersiones registradas' };
      return { canDelete: true };
    } catch (error) {
      console.error('Error checking if operation can be deleted:', error);
      return { canDelete: false, reason: 'error al verificar dependencias' };
    }
  };

  const validateOperacionCompleteness = async (operacionId: string) => {
    try {
      // Verificar HPT
      const { data: hpt } = await supabase
        .from('hpt')
        .select('id, firmado')
        .eq('operacion_id', operacionId)
        .single();

      // Verificar Anexo Bravo
      const { data: anexoBravo } = await supabase
        .from('anexo_bravo')
        .select('id, firmado')
        .eq('operacion_id', operacionId)
        .single();

      // Verificar equipo asignado
      const { data: operacion } = await supabase
        .from('operacion')
        .select('equipo_buceo_id, supervisor_asignado_id, sitio_id')
        .eq('id', operacionId)
        .single();

      const hptReady = hpt?.firmado || false;
      const anexoBravoReady = anexoBravo?.firmado || false;
      const equipoAsignado = !!operacion?.equipo_buceo_id;
      const supervisorAsignado = !!operacion?.supervisor_asignado_id;
      const sitioAsignado = !!operacion?.sitio_id;

      // Emitir evento si la operación está completamente lista
      const canExecute = hptReady && anexoBravoReady && equipoAsignado && supervisorAsignado && sitioAsignado;
      
      if (canExecute) {
        // Emitir evento de dominio
        await supabase.rpc('emit_domain_event', {
          p_event_type: 'OPERATION_READY',
          p_aggregate_id: operacionId,
          p_aggregate_type: 'operacion',
          p_event_data: {
            operacion_id: operacionId,
            timestamp: new Date().toISOString()
          }
        });
      }

      return {
        hptReady,
        anexoBravoReady,
        equipoAsignado,
        supervisorAsignado,
        sitioAsignado,
        canExecute
      };
    } catch (error) {
      console.error('Error validating operation completeness:', error);
      return {
        hptReady: false,
        anexoBravoReady: false,
        equipoAsignado: false,
        supervisorAsignado: false,
        sitioAsignado: false,
        canExecute: false
      };
    }
  };

  const assignSitio = async (operacionId: string, sitioId: string) => {
    try {
      const { error } = await supabase
        .from('operacion')
        .update({ sitio_id: sitioId })
        .eq('id', operacionId);

      if (error) throw error;

      // Emitir evento de dominio
      await supabase.rpc('emit_domain_event', {
        p_event_type: 'OPERATION_ASSIGNED',
        p_aggregate_id: operacionId,
        p_aggregate_type: 'operacion',
        p_event_data: {
          operacion_id: operacionId,
          sitio_id: sitioId,
          assignment_type: 'sitio'
        }
      });

      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      queryClient.invalidateQueries({ queryKey: ['operacion', operacionId] });
      
      return true;
    } catch (error) {
      console.error('Error assigning sitio:', error);
      throw error;
    }
  };

  const assignEquipoAndSupervisor = async (operacionId: string, equipoId: string, supervisorId: string) => {
    try {
      const { error } = await supabase
        .from('operacion')
        .update({ 
          equipo_buceo_id: equipoId,
          supervisor_asignado_id: supervisorId
        })
        .eq('id', operacionId);

      if (error) throw error;

      // Emitir evento de dominio
      await supabase.rpc('emit_domain_event', {
        p_event_type: 'OPERATION_ASSIGNED',
        p_aggregate_id: operacionId,
        p_aggregate_type: 'operacion',
        p_event_data: {
          operacion_id: operacionId,
          equipo_id: equipoId,
          supervisor_id: supervisorId,
          assignment_type: 'equipo_supervisor'
        }
      });

      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      queryClient.invalidateQueries({ queryKey: ['operacion', operacionId] });
      
      return true;
    } catch (error) {
      console.error('Error assigning equipo and supervisor:', error);
      throw error;
    }
  };

  const createMutation = useMutation({
    mutationFn: async (formData: OperacionFormData) => {
      if (profile?.role === 'admin_salmonera' && profile?.salmonera_id && !formData.salmonera_id) {
        formData.salmonera_id = profile.salmonera_id;
      }
      if (profile?.role === 'admin_servicio' && profile?.servicio_id && !formData.servicio_id) {
        formData.servicio_id = profile.servicio_id;
      }
      const { data, error } = await supabase.from('operacion').insert([formData]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({ title: "Operación creada", description: "La operación ha sido creada exitosamente." });
    },
    onError: (error) => {
      console.error('Error creating operacion:', error);
      toast({ title: "Error", description: "No se pudo crear la operación.", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<OperacionFormData> }) => {
      const { error } = await supabase.from('operacion').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({ title: "Operación actualizada", description: "La operación ha sido actualizada exitosamente." });
    },
    onError: (error) => {
      console.error('Error updating operacion:', error);
      toast({ title: "Error", description: "No se pudo actualizar la operación.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('operacion').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({ title: "Operación eliminada", description: "La operación ha sido eliminada exitosamente." });
    },
    onError: (error) => {
      console.error('Error deleting operacion:', error);
      toast({ title: "Error", description: "No se pudo eliminar la operación.", variant: "destructive" });
    },
  });

  const markAsDeletedMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('operacion').update({ estado: 'cancelada', estado_aprobacion: 'eliminada' }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({ title: "Operación marcada como eliminada", description: "La operación ha sido marcada como eliminada para mantener trazabilidad." });
    },
    onError: (error) => {
      console.error('Error marking operacion as deleted:', error);
      toast({ title: "Error", description: "No se pudo marcar la operación como eliminada.", variant: "destructive" });
    },
  });

  return {
    checkCanDelete,
    validateOperacionCompleteness,
    assignSitio,
    assignEquipoAndSupervisor,
    createOperacion: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateOperacion: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteOperacion: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    markAsDeleted: markAsDeletedMutation.mutateAsync,
  };
};

// Main hook
export const useOperaciones = () => {
  const queryResult = useOperacionesQuery();
  const mutations = useOperacionesMutations();

  return {
    operaciones: queryResult.operaciones,
    isLoading: queryResult.isLoading,
    refetch: queryResult.refetch,
    ...mutations,
  };
};
