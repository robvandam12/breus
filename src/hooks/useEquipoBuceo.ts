import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

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
  const { profile } = useAuth();

  const { data: equipos = [], isLoading } = useQuery({
    queryKey: ['cuadrillas-buceo', profile?.salmonera_id, profile?.servicio_id, profile?.role],
    queryFn: async () => {
      console.log('Fetching cuadrillas de buceo for user role:', profile?.role);
      
      let query = supabase
        .from('cuadrillas_buceo')
        .select(`
          *,
          miembros:cuadrilla_miembros(
            *,
            usuario:usuario_id(nombre, apellido, email, rol)
          )
        `)
        .eq('activo', true);

      // Filtrar por empresa según el rol del usuario
      if (profile?.role !== 'superuser') {
        if (profile?.salmonera_id) {
          console.log('Filtering by salmonera_id:', profile.salmonera_id);
          query = query
            .eq('empresa_id', profile.salmonera_id)
            .eq('tipo_empresa', 'salmonera');
        } else if (profile?.servicio_id) {
          console.log('Filtering by servicio_id:', profile.servicio_id);
          query = query
            .eq('empresa_id', profile.servicio_id)
            .eq('tipo_empresa', 'contratista');
        } else {
          // Usuario sin empresa asignada - no puede ver cuadrillas
          console.log('User has no company assigned, returning empty array');
          return [];
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cuadrillas:', error);
        throw error;
      }

      console.log('Fetched cuadrillas:', data?.length || 0);
      return data as EquipoBuceo[];
    },
    enabled: !!profile // Solo ejecutar si hay perfil de usuario
  });

  const createEquipo = useMutation({
    mutationFn: async (equipoData: Omit<EquipoBuceo, 'id' | 'created_at' | 'updated_at'>) => {
      // Auto-asignar empresa según el perfil del usuario (excepto superuser)
      let finalEquipoData = { ...equipoData };
      
      if (profile?.role !== 'superuser') {
        if (profile?.salmonera_id) {
          finalEquipoData = {
            ...equipoData,
            empresa_id: profile.salmonera_id,
            tipo_empresa: 'salmonera'
          };
        } else if (profile?.servicio_id) {
          finalEquipoData = {
            ...equipoData,
            empresa_id: profile.servicio_id,
            tipo_empresa: 'contratista'
          };
        } else {
          throw new Error('Usuario no tiene empresa asignada');
        }
      }

      console.log('Creating cuadrilla with data:', finalEquipoData);

      const { data, error } = await supabase
        .from('cuadrillas_buceo')
        .insert(finalEquipoData)
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
      console.error('Error creating cuadrilla:', error);
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
