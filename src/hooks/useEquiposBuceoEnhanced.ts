
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface EquipoBuceoMember {
  id: string;
  equipo_id: string;
  usuario_id?: string;
  nombre_completo: string;
  email?: string;
  rol: 'supervisor' | 'buzo_principal' | 'buzo_asistente';
  matricula?: string;
  telefono?: string;
  invitado: boolean;
  estado_invitacion: 'pendiente' | 'aceptada' | 'rechazada';
  created_at: string;
  usuario?: {
    nombre: string;
    apellido: string;
    email: string;
    rol: string;
  };
}

export interface EquipoBuceo {
  id: string;
  nombre: string;
  descripcion?: string;
  salmonera_id: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
  miembros?: EquipoBuceoMember[];
  salmonera?: {
    nombre: string;
  };
}

export const useEquiposBuceoEnhanced = () => {
  const queryClient = useQueryClient();

  const { data: equipos = [], isLoading } = useQuery({
    queryKey: ['equipos-buceo-enhanced'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipos_buceo')
        .select(`
          *,
          salmonera:salmoneras(nombre),
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

  const createEquipo = useMutation({
    mutationFn: async (equipoData: {
      nombre: string;
      descripcion?: string;
      salmonera_id: string;
    }) => {
      const { data, error } = await supabase
        .from('equipos_buceo')
        .insert({
          ...equipoData,
          tipo_empresa: 'salmonera'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo-enhanced'] });
      toast({
        title: 'Equipo creado',
        description: 'El equipo de buceo ha sido creado exitosamente.',
      });
    },
  });

  const addMiembro = useMutation({
    mutationFn: async ({ 
      equipo_id, 
      usuario_id, 
      rol_equipo,
      nombre_completo,
      email,
      matricula,
      telefono,
      invitado = false
    }: {
      equipo_id: string;
      usuario_id?: string;
      rol_equipo: string;
      nombre_completo: string;
      email?: string;
      matricula?: string;
      telefono?: string;
      invitado?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('equipo_buceo_miembros')
        .insert({ 
          equipo_id, 
          usuario_id, 
          rol_equipo,
          nombre_completo,
          email,
          matricula,
          telefono,
          invitado,
          estado_invitacion: invitado ? 'pendiente' : 'aceptada'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo-enhanced'] });
      toast({
        title: 'Miembro agregado',
        description: 'El miembro ha sido agregado al equipo exitosamente.',
      });
    },
  });

  const inviteMember = useMutation({
    mutationFn: async ({
      equipo_id,
      email,
      nombre_completo,
      rol_equipo
    }: {
      equipo_id: string;
      email: string;
      nombre_completo: string;
      rol_equipo: string;
    }) => {
      // First add as invited member
      const { data: member, error: memberError } = await supabase
        .from('equipo_buceo_miembros')
        .insert({
          equipo_id,
          email,
          nombre_completo,
          rol_equipo,
          invitado: true,
          estado_invitacion: 'pendiente'
        })
        .select()
        .single();

      if (memberError) throw memberError;

      // Then create user invitation
      const token = crypto.randomUUID();
      const { error: inviteError } = await supabase
        .from('usuario_invitaciones')
        .insert({
          email,
          nombre: nombre_completo.split(' ')[0] || nombre_completo,
          apellido: nombre_completo.split(' ').slice(1).join(' ') || '',
          rol: rol_equipo === 'supervisor' ? 'supervisor' : 'buzo',
          token,
          tipo_empresa: 'equipo_buceo',
          empresa_id: equipo_id
        });

      if (inviteError) throw inviteError;
      return member;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo-enhanced'] });
      toast({
        title: 'Invitación enviada',
        description: 'Se ha enviado una invitación al miembro.',
      });
    },
  });

  return {
    equipos,
    isLoading,
    createEquipo: createEquipo.mutate,
    addMiembro: addMiembro.mutate,
    inviteMember: inviteMember.mutate,
    isCreating: createEquipo.isPending,
  };
};
