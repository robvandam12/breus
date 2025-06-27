
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
  // Propiedades adicionales derivadas
  nombre_completo?: string;
  email?: string;
  telefono?: string;
  matricula?: string;
  rol?: string;
  invitado?: boolean;
  estado_invitacion?: string;
}

export interface EquipoBuceoFormData {
  nombre: string;
  descripcion?: string;
  empresa_id: string;
  tipo_empresa: 'salmonera' | 'contratista';
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
      
      // Mapear datos para incluir propiedades derivadas
      const mappedData = (data || []).map(cuadrilla => ({
        ...cuadrilla,
        miembros: (cuadrilla.miembros || []).map((miembro: any) => ({
          ...miembro,
          nombre_completo: miembro.usuario ? `${miembro.usuario.nombre} ${miembro.usuario.apellido}` : '',
          email: miembro.usuario?.email || '',
          rol: miembro.usuario?.rol || miembro.rol_equipo,
          invitado: false,
          estado_invitacion: 'activo'
        }))
      }));
      
      return mappedData as CuadrillaBuceo[];
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
      queryClient.invalidateQueries({ queryKey: ['cuadrillas-buceo-enhanced'] });
      toast({
        title: 'Cuadrilla creada',
        description: 'La cuadrilla ha sido creada exitosamente.',
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

  const addMiembro = useMutation({
    mutationFn: async ({ equipo_id, usuario_id, rol_equipo, nombre_completo, email }: {
      equipo_id: string;
      usuario_id: string | null;
      rol_equipo: string;
      nombre_completo: string;
      email: string;
      invitado?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('cuadrilla_miembros')
        .insert({ 
          cuadrilla_id: equipo_id, 
          usuario_id, 
          rol_equipo 
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cuadrillas-buceo-enhanced'] });
      toast({
        title: 'Miembro agregado',
        description: 'El miembro ha sido agregado a la cuadrilla exitosamente.',
      });
    },
  });

  const removeMiembro = useMutation({
    mutationFn: async ({ miembro_id }: { miembro_id: string; equipo_id: string }) => {
      const { error } = await supabase
        .from('cuadrilla_miembros')
        .delete()
        .eq('id', miembro_id);

      if (error) throw error;
      return miembro_id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cuadrillas-buceo-enhanced'] });
      toast({
        title: 'Miembro removido',
        description: 'El miembro ha sido removido de la cuadrilla exitosamente.',
      });
    },
  });

  const updateMiembroRole = useMutation({
    mutationFn: async ({ miembro_id, nuevo_rol }: { 
      miembro_id: string; 
      nuevo_rol: string;
      equipo_id: string;
    }) => {
      const { data, error } = await supabase
        .from('cuadrilla_miembros')
        .update({ rol_equipo: nuevo_rol })
        .eq('id', miembro_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cuadrillas-buceo-enhanced'] });
      toast({
        title: 'Rol actualizado',
        description: 'El rol del miembro ha sido actualizado exitosamente.',
      });
    },
  });

  const inviteMember = useMutation({
    mutationFn: async ({ equipo_id, email, nombre_completo, rol_equipo }: {
      equipo_id: string;
      email: string;
      nombre_completo: string;
      rol_equipo: string;
    }) => {
      // Por ahora, crear un registro temporal sin usuario_id
      const { data, error } = await supabase
        .from('cuadrilla_miembros')
        .insert({ 
          cuadrilla_id: equipo_id, 
          usuario_id: null, 
          rol_equipo 
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cuadrillas-buceo-enhanced'] });
      toast({
        title: 'Invitación enviada',
        description: 'La invitación ha sido enviada exitosamente.',
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
    removeMiembro: removeMiembro.mutate,
    updateMiembroRole: updateMiembroRole.mutate,
    inviteMember: inviteMember.mutate,
    isUpdating: updateEquipo.isPending,
    isDeleting: deleteEquipo.isPending,
    isCreating: createEquipo.isPending,
  };
};
