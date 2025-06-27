
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface EquipoBuceo {
  id: string;
  nombre: string;
  descripcion?: string;
  empresa_id: string;
  tipo_empresa: 'salmonera' | 'contratista';
  activo: boolean;
  created_at: string;
  updated_at: string;
  miembros?: EquipoBuceoMiembro[];
}

export interface EquipoBuceoMiembro {
  id: string;
  cuadrilla_id: string;
  usuario_id: string;
  rol_equipo: 'supervisor' | 'buzo_principal' | 'buzo_asistente';
  disponible: boolean;
  usuario?: {
    nombre: string;
    apellido: string;
    email: string;
    rol: string;
  };
}

export const useEquipoBuceo = () => {
  const queryClient = useQueryClient();

  const { data: equipos = [], isLoading } = useQuery({
    queryKey: ['cuadrillas-buceo'],
    queryFn: async () => {
      console.log('Fetching cuadrillas de buceo...');
      const { data, error } = await supabase
        .from('cuadrillas_buceo')
        .select(`
          *,
          miembros:cuadrilla_miembros(
            *,
            usuario:usuario_id(nombre, apellido, email, rol)
          )
        `)
        .eq('activo', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cuadrillas:', error);
        throw error;
      }
      return data as EquipoBuceo[];
    },
  });

  const createEquipo = useMutation({
    mutationFn: async (equipoData: Omit<EquipoBuceo, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('cuadrillas_buceo')
        .insert(equipoData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cuadrillas-buceo'] });
      toast({
        title: 'Cuadrilla creada',
        description: 'La cuadrilla de buceo ha sido creada exitosamente.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Error al crear la cuadrilla: ${error.message}`,
        variant: 'destructive',
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
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Error al actualizar la cuadrilla: ${error.message}`,
        variant: 'destructive',
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
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Error al desactivar la cuadrilla: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const addMiembro = useMutation({
    mutationFn: async ({ cuadrilla_id, usuario_id, rol_equipo }: {
      cuadrilla_id: string;
      usuario_id: string;
      rol_equipo: string;
    }) => {
      const { data, error } = await supabase
        .from('cuadrilla_miembros')
        .insert({ cuadrilla_id, usuario_id, rol_equipo })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cuadrillas-buceo'] });
      toast({
        title: 'Miembro agregado',
        description: 'El miembro ha sido agregado a la cuadrilla exitosamente.',
      });
    },
  });

  return {
    equipos,
    isLoading,
    createEquipo: createEquipo.mutate,
    updateEquipo: updateEquipo.mutate,
    deleteEquipo: deleteEquipo.mutate,
    addMiembro: addMiembro.mutate,
    isCreating: createEquipo.isPending,
  };
};
