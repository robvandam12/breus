
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface CuadrillaBuceo {
  id: string;
  nombre: string;
  descripcion?: string;
  empresa_id: string;
  tipo_empresa: 'salmonera' | 'contratista';
  activo: boolean;
  created_at: string;
  updated_at: string;
  miembros?: CuadrillaMiembro[];
}

export interface CuadrillaMiembro {
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

export const useEquiposBuceoEnhanced = () => {
  const queryClient = useQueryClient();

  const { data: equipos = [], isLoading } = useQuery({
    queryKey: ['cuadrillas-buceo-enhanced'],
    queryFn: async () => {
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

      if (error) throw error;
      return data as CuadrillaBuceo[];
    },
  });

  const updateEquipo = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CuadrillaBuceo> }) => {
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
      queryClient.invalidateQueries({ queryKey: ['cuadrillas-buceo-enhanced'] });
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
      queryClient.invalidateQueries({ queryKey: ['cuadrillas-buceo-enhanced'] });
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

  return {
    equipos,
    isLoading,
    updateEquipo: updateEquipo.mutate,
    deleteEquipo: deleteEquipo.mutate,
    isUpdating: updateEquipo.isPending,
    isDeleting: deleteEquipo.isPending,
  };
};
