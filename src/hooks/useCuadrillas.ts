import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCallback } from 'react';

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

// Mapeo de roles para la base de datos
const VALID_ROLES = {
  'supervisor': 'supervisor',
  'buzo': 'buzo_principal', // Mapear 'buzo' a 'buzo_principal'
  'asistente': 'buzo_asistente',
  'buzo_principal': 'buzo_principal',
  'buzo_asistente': 'buzo_asistente'
};

const mapRoleForDatabase = (role: string): string => {
  return VALID_ROLES[role as keyof typeof VALID_ROLES] || 'buzo_principal';
};

export const useCuadrillas = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  const { data: cuadrillas = [], isLoading, refetch } = useQuery({
    queryKey: ['cuadrillas', profile?.salmonera_id, profile?.servicio_id, profile?.role],
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
        } else {
          return [];
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
    enabled: !!profile,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['cuadrillas'] });
  }, [queryClient]);

  const refetchQueries = useCallback(async () => {
    await queryClient.refetchQueries({ queryKey: ['cuadrillas'] });
  }, [queryClient]);

  const createMutation = useMutation({
    mutationFn: async (formData: CuadrillaFormData) => {
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
        } else {
          throw new Error('Usuario no tiene empresa asignada');
        }
      }

      const cuadrillaData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        centro_id: formData.centro_id,
        activo: formData.activo,
        estado: formData.estado,
        ...empresaData
      };

      const { data, error } = await supabase
        .from('cuadrillas_buceo')
        .insert([cuadrillaData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      invalidateQueries();
      toast({
        title: "Cuadrilla creada",
        description: "La cuadrilla ha sido creada exitosamente.",
      });
      return data;
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
      invalidateQueries();
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
      return id;
    },
    onSuccess: (deletedId) => {
      // Actualizar cache inmediatamente
      queryClient.setQueryData(['cuadrillas', profile?.salmonera_id, profile?.servicio_id, profile?.role], 
        (oldData: Cuadrilla[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter(cuadrilla => cuadrilla.id !== deletedId);
        }
      );
      
      invalidateQueries();
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
      console.log('Adding member with role:', rolEquipo);
      
      // Mapear el rol para la base de datos
      const dbRole = mapRoleForDatabase(rolEquipo);
      console.log('Mapped role for database:', dbRole);

      // Verificar si el miembro ya existe
      const { data: existingMember } = await supabase
        .from('cuadrilla_miembros')
        .select('id')
        .eq('cuadrilla_id', cuadrillaId)
        .eq('usuario_id', usuarioId)
        .single();

      if (existingMember) {
        throw new Error('El usuario ya es miembro de esta cuadrilla');
      }

      const { data, error } = await supabase
        .from('cuadrilla_miembros')
        .insert([{
          cuadrilla_id: cuadrillaId,
          usuario_id: usuarioId,
          rol_equipo: dbRole, // Usar el rol mapeado
          disponible: true
        }])
        .select()
        .single();

      if (error) {
        console.error('Database error adding member:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      invalidateQueries();
      toast({
        title: "Miembro agregado",
        description: "El miembro ha sido agregado a la cuadrilla exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Error adding member:', error);
      const errorMessage = error.message || "No se pudo agregar el miembro a la cuadrilla.";
      
      if (error.code === '23514') {
        toast({
          title: "Error de rol",
          description: "El rol seleccionado no es válido para esta cuadrilla. Los roles válidos son: Supervisor, Buzo Principal, Buzo Asistente.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
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
      invalidateQueries();
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
    invalidateQueries,
    refetchQueries,
    refetch,
  };
};
