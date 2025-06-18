
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface EquipoBuceo {
  id: string;
  nombre: string;
  descripcion?: string;
  estado: 'disponible' | 'en_uso' | 'mantenimiento' | 'inactivo';
  tipo_empresa: string;
  empresa_id: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface EquipoBuceoFormData {
  nombre: string;
  descripcion?: string;
  tipo_empresa: string;
  empresa_id: string;
  estado?: 'disponible' | 'en_uso' | 'mantenimiento' | 'inactivo';
}

export const useEquiposBuceo = () => {
  const queryClient = useQueryClient();

  const { data: equipos = [], isLoading, error, refetch } = useQuery({
    queryKey: ['equipos-buceo'],
    queryFn: async () => {
      console.log('Fetching equipos de buceo...');
      const { data, error } = await supabase
        .from('equipos_buceo')
        .select('*')
        .eq('activo', true)
        .order('nombre', { ascending: true });

      if (error) {
        console.error('Error fetching equipos de buceo:', error);
        throw error;
      }

      console.log('Equipos de buceo fetched:', data);
      return data as EquipoBuceo[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (equipoData: EquipoBuceoFormData) => {
      console.log('Creating equipo de buceo with data:', equipoData);
      
      const { data, error } = await supabase
        .from('equipos_buceo')
        .insert([{
          ...equipoData,
          estado: equipoData.estado || 'disponible',
          activo: true
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating equipo de buceo:', error);
        throw error;
      }

      console.log('Equipo de buceo created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo'] });
      toast({
        title: "Equipo creado",
        description: "El equipo de buceo ha sido creado exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Create mutation error:', error);
      toast({
        title: "Error",
        description: `No se pudo crear el equipo de buceo: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EquipoBuceoFormData> }) => {
      console.log('Updating equipo de buceo with data:', { id, data });
      
      const { data: updated, error } = await supabase
        .from('equipos_buceo')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating equipo de buceo:', error);
        throw error;
      }

      console.log('Equipo de buceo updated:', updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo'] });
      toast({
        title: "Equipo actualizado",
        description: "El equipo de buceo ha sido actualizado exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Update mutation error:', error);
      toast({
        title: "Error",
        description: `No se pudo actualizar el equipo de buceo: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Soft deleting equipo de buceo:', id);
      
      // Soft delete - marcar como inactivo
      const { error } = await supabase
        .from('equipos_buceo')
        .update({ activo: false })
        .eq('id', id);

      if (error) {
        console.error('Error deleting equipo de buceo:', error);
        throw error;
      }

      console.log('Equipo de buceo soft deleted');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo'] });
      toast({
        title: "Equipo eliminado",
        description: "El equipo de buceo ha sido eliminado exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Delete mutation error:', error);
      toast({
        title: "Error",
        description: `No se pudo eliminar el equipo de buceo: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const createEquipo = async (data: EquipoBuceoFormData) => {
    return createMutation.mutateAsync(data);
  };

  const updateEquipo = async ({ id, data }: { id: string; data: Partial<EquipoBuceoFormData> }) => {
    return updateMutation.mutateAsync({ id, data });
  };

  const deleteEquipo = async (id: string) => {
    return deleteMutation.mutateAsync(id);
  };

  return {
    equipos,
    isLoading,
    error,
    refetch,
    createEquipo,
    updateEquipo,
    deleteEquipo,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};
