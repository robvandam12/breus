
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
      return (data || []).map(user => ({
        id: user.usuario_id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: user.rol as 'supervisor' | 'buzo',
        salmonera_id: user.salmonera_id || '',
        servicio_id: user.servicio_id || undefined,
        matricula: undefined,
        especialidades: [],
        certificaciones: [],
        disponible: true,
        created_at: user.created_at,
      })) as PoolUser[];
    },
    enabled: !!salmoneraId,
  });

  // Fetch invitaciones pendientes - usando notifications por ahora
  const { data: invitaciones = [], isLoading: loadingInvitaciones } = useQuery({
    queryKey: ['invitaciones-usuario', salmoneraId],
    queryFn: async () => {
      if (!salmoneraId) return [];
      
      // Por ahora retornamos array vacío hasta tener la tabla user_invitations
      return [] as InvitacionUsuario[];
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
      // Por ahora creamos el usuario directamente
      const { data, error } = await supabase.auth.signUp({
        email,
        password: 'temp123456', // Password temporal
        options: {
          data: {
            nombre,
            apellido,
            rol,
            salmonera_id: salmoneraId,
          }
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pool-users', salmoneraId] });
      toast({
        title: "Invitación enviada",
        description: "Se ha enviado la invitación por email",
      });
    },
  });

  // Crear equipo para operación - por ahora usando notifications como placeholder
  const createTeam = useMutation({
    mutationFn: async ({ 
      operacionId, 
      miembros 
    }: { 
      operacionId: string; 
      miembros: { usuario_id: string; rol_equipo: 'supervisor' | 'buzo_principal' | 'buzo_asistente' }[];
    }) => {
      // Crear notificaciones para simular la creación del equipo
      const notifications = miembros.map(miembro => ({
        user_id: miembro.usuario_id,
        type: 'team_assignment',
        title: 'Asignado a Equipo',
        message: `Has sido asignado como ${miembro.rol_equipo} para la operación ${operacionId}`,
        metadata: { operacion_id: operacionId, rol_equipo: miembro.rol_equipo }
      }));

      const { data, error } = await supabase
        .from('notifications')
        .insert(notifications);

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

  // Obtener equipo de una operación - por ahora retornamos array vacío
  const { data: teamMembers = [] } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      return [] as TeamMember[];
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
