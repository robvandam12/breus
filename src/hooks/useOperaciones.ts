
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

// Tipos básicos para evitar recursión infinita
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
  sitios?: { nombre: string };
  equipos_buceo?: { nombre: string };
  usuario_supervisor?: { nombre: string; apellido: string };
}

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

export const useOperaciones = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  const { data: operaciones = [], isLoading } = useQuery<OperacionConRelaciones[]>({
    queryKey: ['operaciones'],
    queryFn: async () => {
      let query = supabase
        .from('operacion')
        .select(`
          *,
          salmoneras:salmonera_id(nombre),
          contratistas:contratista_id(nombre),
          sitios:sitio_id(nombre),
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

  const { data: operacionDetail } = useQuery<OperacionConRelaciones | null>({
    queryKey: ['operacion-detail'],
    queryFn: () => null,
    enabled: false,
  });

  const getOperacionById = async (id: string): Promise<OperacionConRelaciones | null> => {
    const { data, error } = await supabase
      .from('operacion')
      .select(`
        *,
        salmoneras:salmonera_id(nombre),
        contratistas:contratista_id(nombre),
        sitios:sitio_id(nombre),
        equipos_buceo:equipo_buceo_id(nombre),
        usuario_supervisor:supervisor_asignado_id(nombre, apellido)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  };

  const createMutation = useMutation({
    mutationFn: async (formData: OperacionFormData) => {
      // Auto-asignar salmonera si el usuario es admin_salmonera
      if (profile?.role === 'admin_salmonera' && profile?.salmonera_id && !formData.salmonera_id) {
        formData.salmonera_id = profile.salmonera_id;
      }

      // Auto-asignar servicio si el usuario es admin_servicio
      if (profile?.role === 'admin_servicio' && profile?.servicio_id && !formData.servicio_id) {
        formData.servicio_id = profile.servicio_id;
      }

      const { data, error } = await supabase
        .from('operacion')
        .insert([formData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({
        title: "Operación creada",
        description: "La operación ha sido creada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating operacion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la operación.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<OperacionFormData> }) => {
      const { error } = await supabase
        .from('operacion')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({
        title: "Operación actualizada",
        description: "La operación ha sido actualizada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error updating operacion:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la operación.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('operacion')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({
        title: "Operación eliminada",
        description: "La operación ha sido eliminada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error deleting operacion:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la operación.",
        variant: "destructive",
      });
    },
  });

  return {
    operaciones,
    operacionDetail,
    isLoading,
    getOperacionById,
    createOperacion: createMutation.mutateAsync,
    updateOperacion: updateMutation.mutateAsync,
    deleteOperacion: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
