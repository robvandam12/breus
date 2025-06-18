
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
  equipo_id: string;
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
            usuario:usuario(nombre, apellido, email, rol)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as EquipoBuceo[];
    },
  });

  const createEquipoMutation = useMutation({
    mutationFn: async (equipoData: Omit<EquipoBuceo, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('equipos_buceo')
        .insert(equipoData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo'] });
      toast({
        title: 'Equipo creado',
        description: 'El equipo de buceo ha sido creado exitosamente.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Error al crear el equipo: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const addMiembro = useMutation({
    mutationFn: async ({ equipo_id, usuario_id, rol_equipo }: {
      equipo_id: string;
      usuario_id: string;
      rol_equipo: string;
    }) => {
      const { data, error } = await supabase
        .from('equipo_buceo_miembros')
        .insert({ equipo_id, usuario_id, rol_equipo })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo'] });
      toast({
        title: 'Miembro agregado',
        description: 'El miembro ha sido agregado al equipo exitosamente.',
      });
    },
  });

  const createEquipo = async (equipoData: Omit<EquipoBuceo, 'id' | 'created_at' | 'updated_at'>) => {
    return createEquipoMutation.mutateAsync(equipoData);
  };

  return {
    equipos,
    isLoading,
    createEquipo,
    addMiembro: addMiembro.mutate,
    isCreating: createEquipoMutation.isPending,
  };
};
