
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface TeamMember {
  id: string;
  inmersion_id: string;
  user_id: string;
  role: 'supervisor' | 'buzo_principal' | 'buzo_asistente' | 'buzo_emergencia';
  is_emergency: boolean;
  created_at: string;
  usuario?: {
    nombre: string;
    apellido: string;
    email: string;
  };
}

export interface AddTeamMemberData {
  inmersion_id: string;
  user_id: string;
  role: 'supervisor' | 'buzo_principal' | 'buzo_asistente' | 'buzo_emergencia';
  is_emergency?: boolean;
}

export const useInmersionTeamManager = (inmersionId: string) => {
  const queryClient = useQueryClient();

  // Obtener miembros del equipo
  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ['inmersion-team-members', inmersionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inmersion_team_members')
        .select(`
          *,
          usuario:user_id (
            nombre,
            apellido,
            email
          )
        `)
        .eq('inmersion_id', inmersionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as TeamMember[];
    },
    enabled: !!inmersionId,
  });

  // Agregar miembro al equipo
  const addTeamMemberMutation = useMutation({
    mutationFn: async (memberData: AddTeamMemberData) => {
      const { data, error } = await supabase
        .from('inmersion_team_members')
        .insert([{
          inmersion_id: memberData.inmersion_id,
          user_id: memberData.user_id,
          role: memberData.role,
          is_emergency: memberData.is_emergency || memberData.role === 'buzo_emergencia'
        }])
        .select(`
          *,
          usuario:user_id (
            nombre,
            apellido,
            email
          )
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersion-team-members', inmersionId] });
      toast({
        title: "Miembro agregado",
        description: "El miembro ha sido agregado al equipo exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Error adding team member:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo agregar el miembro al equipo.",
        variant: "destructive",
      });
    },
  });

  // Remover miembro del equipo
  const removeTeamMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from('inmersion_team_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersion-team-members', inmersionId] });
      toast({
        title: "Miembro removido",
        description: "El miembro ha sido removido del equipo.",
      });
    },
    onError: (error: any) => {
      console.error('Error removing team member:', error);
      toast({
        title: "Error",
        description: "No se pudo remover el miembro del equipo.",
        variant: "destructive",
      });
    },
  });

  // Migrar de sistema de texto a sistema de usuarios reales
  const migrateFromTextToTeamMutation = useMutation({
    mutationFn: async ({ supervisor, buzoPrincipal, buzoAsistente }: {
      supervisor: string;
      buzoPrincipal: string;
      buzoAsistente?: string;
    }) => {
      const members = [];
      
      // Buscar usuarios por nombre
      const { data: usuarios, error } = await supabase
        .from('usuario')
        .select('usuario_id, nombre, apellido')
        .or(`nombre.eq.${supervisor},nombre.eq.${buzoPrincipal}${buzoAsistente ? `,nombre.eq.${buzoAsistente}` : ''}`);

      if (error) throw error;

      // Mapear supervisor
      const supervisorUser = usuarios.find(u => u.nombre === supervisor);
      if (supervisorUser) {
        members.push({
          inmersion_id: inmersionId,
          user_id: supervisorUser.usuario_id,
          role: 'supervisor' as const,
          is_emergency: false
        });
      }

      // Mapear buzo principal
      const buzoPrincipalUser = usuarios.find(u => u.nombre === buzoPrincipal);
      if (buzoPrincipalUser) {
        members.push({
          inmersion_id: inmersionId,
          user_id: buzoPrincipalUser.usuario_id,
          role: 'buzo_principal' as const,
          is_emergency: false
        });
      }

      // Mapear buzo asistente si existe
      if (buzoAsistente) {
        const buzoAsistenteUser = usuarios.find(u => u.nombre === buzoAsistente);
        if (buzoAsistenteUser) {
          members.push({
            inmersion_id: inmersionId,
            user_id: buzoAsistenteUser.usuario_id,
            role: 'buzo_asistente' as const,
            is_emergency: false
          });
        }
      }

      if (members.length > 0) {
        const { error: insertError } = await supabase
          .from('inmersion_team_members')
          .insert(members);

        if (insertError) throw insertError;
      }

      return members;
    },
    onSuccess: (members) => {
      queryClient.invalidateQueries({ queryKey: ['inmersion-team-members', inmersionId] });
      toast({
        title: "Equipo migrado",
        description: `Se migraron ${members.length} miembros del equipo.`,
      });
    },
  });

  return {
    teamMembers,
    isLoading,
    addTeamMember: addTeamMemberMutation.mutateAsync,
    removeTeamMember: removeTeamMemberMutation.mutateAsync,
    migrateFromTextToTeam: migrateFromTextToTeamMutation.mutateAsync,
    isAddingMember: addTeamMemberMutation.isPending,
    isRemovingMember: removeTeamMemberMutation.isPending,
  };
};
