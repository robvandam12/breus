
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface PoolUser {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'supervisor' | 'buzo';
  salmonera_id: string;
  servicio_id?: string;
  matricula?: string;
  especialidades?: string[];
  certificaciones?: string[];
  disponible: boolean;
  created_at: string;
}

export interface TeamMember {
  id: string;
  usuario_id: string;
  operacion_id: string;
  rol_equipo: 'supervisor' | 'buzo_principal' | 'buzo_asistente';
  activo: boolean;
  usuario?: PoolUser;
}

export interface InvitacionUsuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'supervisor' | 'buzo';
  salmonera_id: string;
  token: string;
  estado: 'pendiente' | 'aceptada' | 'rechazada';
  expires_at: string;
  created_at: string;
}

export const useUserPool = (salmoneraId?: string) => {
  const queryClient = useQueryClient();

  // Fetch pool de usuarios
  const { data: poolUsers = [], isLoading: loadingPool } = useQuery({
    queryKey: ['pool-users', salmoneraId],
    queryFn: async () => {
      if (!salmoneraId) return [];
      
      const { data, error } = await supabase
        .from('usuario')
        .select('*')
        .eq('salmonera_id', salmoneraId)
        .in('rol', ['supervisor', 'buzo'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PoolUser[];
    },
    enabled: !!salmoneraId,
  });

  // Fetch invitaciones pendientes
  const { data: invitaciones = [], isLoading: loadingInvitaciones } = useQuery({
    queryKey: ['invitaciones-usuario', salmoneraId],
    queryFn: async () => {
      if (!salmoneraId) return [];
      
      const { data, error } = await supabase
        .from('user_invitations')
        .select('*')
        .eq('salmonera_id', salmoneraId)
        .eq('estado', 'pendiente')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as InvitacionUsuario[];
    },
    enabled: !!salmoneraId,
  });

  // Invitar usuario existente al pool
  const inviteExistingUser = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const { data, error } = await supabase
        .from('usuario')
        .update({ salmonera_id: salmoneraId })
        .eq('usuario_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pool-users', salmoneraId] });
      toast({
        title: "Usuario agregado",
        description: "Usuario agregado exitosamente al pool",
      });
    },
  });

  // Invitar nuevo usuario por email
  const inviteNewUser = useMutation({
    mutationFn: async ({ 
      email, 
      nombre, 
      apellido, 
      rol 
    }: { 
      email: string; 
      nombre: string; 
      apellido: string; 
      rol: 'supervisor' | 'buzo';
    }) => {
      const { data, error } = await supabase.functions.invoke('send-user-invitation', {
        body: {
          email,
          nombre,
          apellido,
          rol,
          salmonera_id: salmoneraId,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitaciones-usuario', salmoneraId] });
      toast({
        title: "Invitación enviada",
        description: "Se ha enviado la invitación por email",
      });
    },
  });

  // Crear equipo para operación
  const createTeam = useMutation({
    mutationFn: async ({ 
      operacionId, 
      miembros 
    }: { 
      operacionId: string; 
      miembros: { usuario_id: string; rol_equipo: 'supervisor' | 'buzo_principal' | 'buzo_asistente' }[];
    }) => {
      const teamData = miembros.map(miembro => ({
        operacion_id: operacionId,
        usuario_id: miembro.usuario_id,
        rol_equipo: miembro.rol_equipo,
        activo: true,
      }));

      const { data, error } = await supabase
        .from('team_members')
        .insert(teamData)
        .select(`
          *,
          usuario:usuario_id (*)
        `);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Equipo creado",
        description: "Equipo de buceo creado exitosamente",
      });
    },
  });

  // Obtener equipo de una operación
  const { data: teamMembers = [] } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          usuario:usuario_id (*),
          operacion:operacion_id (nombre, codigo)
        `)
        .eq('activo', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TeamMember[];
    },
  });

  return {
    poolUsers,
    invitaciones,
    teamMembers,
    loadingPool,
    loadingInvitaciones,
    inviteExistingUser: inviteExistingUser.mutateAsync,
    inviteNewUser: inviteNewUser.mutateAsync,
    createTeam: createTeam.mutateAsync,
    isInvitingExisting: inviteExistingUser.isPending,
    isInvitingNew: inviteNewUser.isPending,
    isCreatingTeam: createTeam.isPending,
  };
};
