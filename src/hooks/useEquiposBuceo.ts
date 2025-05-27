
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface EquipoBuceo {
  id: string;
  nombre: string;
  descripcion?: string;
  empresa_id: string;
  tipo_empresa: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
  miembros?: EquipoBuceoMiembro[];
}

export interface EquipoBuceoMiembro {
  id: string;
  equipo_id: string;
  usuario_id: string;
  rol_equipo: string;
  disponible: boolean;
  created_at: string;
  usuario?: {
    nombre: string;
    apellido: string;
    email: string;
    rol: string;
  };
}

export interface CreateEquipoData {
  nombre: string;
  descripcion?: string;
  empresa_id: string;
  tipo_empresa: string;
}

export interface AddMiembroData {
  equipo_id: string;
  usuario_id: string;
  rol_equipo: string;
}

export const useEquiposBuceo = () => {
  const queryClient = useQueryClient();

  const { data: equipos = [], isLoading } = useQuery({
    queryKey: ['equipos-buceo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipos_buceo')
        .select(`
          *,
          miembros:equipo_buceo_miembros(
            *,
            usuario:usuario_id(
              nombre,
              apellido,
              email,
              rol
            )
          )
        `)
        .eq('activo', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as EquipoBuceo[];
    },
  });

  const createEquipoMutation = useMutation({
    mutationFn: async (data: CreateEquipoData) => {
      const { data: result, error } = await supabase
        .from('equipos_buceo')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo'] });
      toast({
        title: "Equipo creado",
        description: "El equipo de buceo ha sido creado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating equipo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el equipo de buceo.",
        variant: "destructive",
      });
    },
  });

  const updateEquipoMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateEquipoData> }) => {
      const { data: result, error } = await supabase
        .from('equipos_buceo')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo'] });
      toast({
        title: "Equipo actualizado",
        description: "El equipo de buceo ha sido actualizado exitosamente.",
      });
    },
  });

  const deleteEquipoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('equipos_buceo')
        .update({ activo: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo'] });
      toast({
        title: "Equipo eliminado",
        description: "El equipo de buceo ha sido desactivado exitosamente.",
      });
    },
  });

  const addMiembroMutation = useMutation({
    mutationFn: async (data: AddMiembroData) => {
      const { data: result, error } = await supabase
        .from('equipo_buceo_miembros')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo'] });
      toast({
        title: "Miembro agregado",
        description: "El miembro ha sido agregado al equipo exitosamente.",
      });
    },
  });

  const removeMiembroMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('equipo_buceo_miembros')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo'] });
      toast({
        title: "Miembro removido",
        description: "El miembro ha sido removido del equipo exitosamente.",
      });
    },
  });

  return {
    equipos,
    isLoading,
    createEquipo: createEquipoMutation.mutateAsync,
    updateEquipo: updateEquipoMutation.mutateAsync,
    deleteEquipo: deleteEquipoMutation.mutateAsync,
    addMiembro: addMiembroMutation.mutateAsync,
    removeMiembro: removeMiembroMutation.mutateAsync,
    isCreating: createEquipoMutation.isPending,
  };
};
