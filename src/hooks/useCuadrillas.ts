
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export interface CuadrillaMiembro {
  id: string;
  usuario_id: string;
  rol_equipo: string;
  disponible: boolean;
  nombre?: string;
  apellido?: string;
}

export interface Cuadrilla {
  id: string;
  nombre: string;
  descripcion?: string;
  empresa_id: string;
  tipo_empresa: string;
  centro_id?: string;
  activo: boolean;
  estado: string;
  created_at: string;
  updated_at: string;
  miembros?: CuadrillaMiembro[];
  empresa_nombre?: string;
  centro_nombre?: string;
}

export interface CuadrillaFormData {
  nombre: string;
  descripcion?: string;
  empresa_id?: string;
  tipo_empresa?: string;
  centro_id?: string;
  activo: boolean;
  estado: 'disponible' | 'ocupada' | 'mantenimiento';
}

export const useCuadrillas = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  const { data: cuadrillas = [], isLoading } = useQuery({
    queryKey: ['cuadrillas'],
    queryFn: async () => {
      let query = supabase
        .from('cuadrillas_buceo')
        .select(`
          *,
          cuadrilla_miembros!inner(
            id,
            usuario_id,
            rol_equipo,
            disponible,
            usuario:usuario_id(nombre, apellido)
          )
        `)
        .order('nombre');

      // Filtrar por empresa si no es superuser
      if (profile?.role !== 'superuser') {
        if (profile?.salmonera_id) {
          query = query.eq('empresa_id', profile.salmonera_id).eq('tipo_empresa', 'salmonera');
        } else if (profile?.servicio_id) {
          query = query.eq('empresa_id', profile.servicio_id).eq('tipo_empresa', 'contratista');
        }
      }

      const { data, error } = await query;
      if (error) throw error;

      // Procesar los datos para incluir miembros correctamente
      const processedData = (data || []).map(cuadrilla => ({
        ...cuadrilla,
        miembros: cuadrilla.cuadrilla_miembros?.map((miembro: any) => ({
          id: miembro.id,
          usuario_id: miembro.usuario_id,
          rol_equipo: miembro.rol_equipo,
          disponible: miembro.disponible,
          nombre: miembro.usuario?.nombre,
          apellido: miembro.usuario?.apellido
        })) || []
      }));

      return processedData as Cuadrilla[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (formData: CuadrillaFormData) => {
      // Si no es superuser, auto-asignar empresa
      let empresaData = {
        empresa_id: formData.empresa_id,
        tipo_empresa: formData.tipo_empresa
      };

      if (profile?.role !== 'superuser') {
        if (profile?.salmonera_id) {
          empresaData = {
            empresa_id: profile.salmonera_id,
            tipo_empresa: 'salmonera'
          };
        } else if (profile?.servicio_id) {
          empresaData = {
            empresa_id: profile.servicio_id,
            tipo_empresa: 'contratista'
          };
        }
      }

      const { data, error } = await supabase
        .from('cuadrillas_buceo')
        .insert([{
          ...formData,
          ...empresaData
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cuadrillas'] });
      toast({
        title: "Cuadrilla creada",
        description: "La cuadrilla ha sido creada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating cuadrilla:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la cuadrilla.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CuadrillaFormData> }) => {
      const { error } = await supabase
        .from('cuadrillas_buceo')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cuadrillas'] });
      toast({
        title: "Cuadrilla actualizada",
        description: "La cuadrilla ha sido actualizada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error updating cuadrilla:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la cuadrilla.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cuadrillas_buceo')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cuadrillas'] });
      toast({
        title: "Cuadrilla eliminada",
        description: "La cuadrilla ha sido eliminada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error deleting cuadrilla:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la cuadrilla.",
        variant: "destructive",
      });
    },
  });

  const addMemberMutation = useMutation({
    mutationFn: async ({ cuadrillaId, usuarioId, rolEquipo }: { 
      cuadrillaId: string; 
      usuarioId: string; 
      rolEquipo: string; 
    }) => {
      const { data, error } = await supabase
        .from('cuadrilla_miembros')
        .insert([{
          cuadrilla_id: cuadrillaId,
          usuario_id: usuarioId,
          rol_equipo: rolEquipo,
          disponible: true
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cuadrillas'] });
      toast({
        title: "Miembro agregado",
        description: "El miembro ha sido agregado a la cuadrilla exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error adding member:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el miembro a la cuadrilla.",
        variant: "destructive",
      });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from('cuadrilla_miembros')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cuadrillas'] });
      toast({
        title: "Miembro removido",
        description: "El miembro ha sido removido de la cuadrilla exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error removing member:', error);
      toast({
        title: "Error",
        description: "No se pudo remover el miembro de la cuadrilla.",
        variant: "destructive",
      });
    },
  });

  return {
    cuadrillas,
    isLoading,
    createCuadrilla: createMutation.mutateAsync,
    updateCuadrilla: updateMutation.mutateAsync,
    deleteCuadrilla: deleteMutation.mutateAsync,
    addMember: addMemberMutation.mutateAsync,
    removeMember: removeMemberMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
