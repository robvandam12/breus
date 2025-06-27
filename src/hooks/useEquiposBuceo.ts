
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';

export interface EquipoBuceo extends Tables<'cuadrillas_buceo'> {
  miembros?: EquipoBuceoMiembro[];
}

export interface EquipoBuceoMiembro extends Tables<'cuadrilla_miembros'> {
  usuario?: {
    nombre: string;
    apellido: string;
    email: string;
  };
}

export interface EquipoBuceoFormData {
  nombre: string;
  descripcion?: string;
  empresa_id: string;
  tipo_empresa: 'salmonera' | 'contratista';
}

export const useEquiposBuceo = () => {
  const queryClient = useQueryClient();

  const { data: equipos = [], isLoading, error } = useQuery({
    queryKey: ['cuadrillas-buceo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cuadrillas_buceo')
        .select(`
          *,
          miembros:cuadrilla_miembros(
            *,
            usuario:usuario_id(nombre, apellido, email)
          )
        `)
        .eq('activo', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as EquipoBuceo[];
    },
  });

  const createEquipo = useMutation({
    mutationFn: async (equipoData: EquipoBuceoFormData) => {
      const { data, error } = await supabase
        .from('cuadrillas_buceo')
        .insert({
          nombre: equipoData.nombre,
          descripcion: equipoData.descripcion,
          empresa_id: equipoData.empresa_id,
          tipo_empresa: equipoData.tipo_empresa,
          activo: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cuadrillas-buceo'] });
      toast({
        title: 'Cuadrilla creada',
        description: 'La cuadrilla ha sido creada exitosamente.',
      });
    },
  });

  const updateEquipo = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EquipoBuceo> }) => {
      const { data: updatedData, error } = await supabase
        .from('cuadrillas_buceo')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cuadrillas-buceo'] });
      toast({
        title: 'Cuadrilla actualizada',
        description: 'La cuadrilla ha sido actualizada exitosamente.',
      });
    },
  });

  const deleteEquipo = useMutation({
    mutationFn: async (equipoId: string) => {
      const { error } = await supabase
        .from('cuadrillas_buceo')
        .update({ activo: false })
        .eq('id', equipoId);

      if (error) throw error;
      return equipoId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cuadrillas-buceo'] });
      toast({
        title: 'Cuadrilla desactivada',
        description: 'La cuadrilla ha sido desactivada exitosamente.',
      });
    },
  });

  return {
    equipos,
    isLoading,
    error,
    createEquipo: createEquipo.mutate,
    updateEquipo: updateEquipo.mutate,
    deleteEquipo: deleteEquipo.mutate,
    isCreating: createEquipo.isPending,
  };
};
