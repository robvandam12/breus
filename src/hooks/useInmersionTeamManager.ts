
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface TeamMember {
  id: string;
  user_id: string;
  role: 'supervisor' | 'buzo_principal' | 'buzo_asistente' | 'buzo_emergencia';
  is_emergency: boolean;
  nombre?: string;
  apellido?: string;
  email?: string;
}

interface NewTeamMember {
  user_id: string;
  role: TeamMember['role'];
  is_emergency: boolean;
}

export const useInmersionTeamManager = (inmersionId: string) => {
  const queryClient = useQueryClient();

  // Obtener miembros del equipo
  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ['inmersion-team', inmersionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inmersion_team_members')
        .select(`
          id,
          user_id,
          role,
          is_emergency,
          usuario:user_id (
            nombre,
            apellido,
            email
          )
        `)
        .eq('inmersion_id', inmersionId);

      if (error) throw error;

      return data.map(member => ({
        id: member.id,
        user_id: member.user_id,
        role: member.role,
        is_emergency: member.is_emergency,
        nombre: member.usuario?.nombre,
        apellido: member.usuario?.apellido,
        email: member.usuario?.email,
      })) as TeamMember[];
    },
    enabled: !!inmersionId,
  });

  // Agregar miembro al equipo
  const addTeamMemberMutation = useMutation({
    mutationFn: async (newMember: NewTeamMember) => {
      const { data, error } = await supabase
        .from('inmersion_team_members')
        .insert({
          inmersion_id: inmersionId,
          user_id: newMember.user_id,
          role: newMember.role,
          is_emergency: newMember.is_emergency,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersion-team', inmersionId] });
      toast({
        title: "Miembro agregado",
        description: "El miembro ha sido agregado al equipo exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Error adding team member:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el miembro al equipo.",
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
      queryClient.invalidateQueries({ queryKey: ['inmersion-team', inmersionId] });
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

  return {
    teamMembers,
    isLoading,
    addTeamMember: addTeamMemberMutation.mutateAsync,
    removeTeamMember: removeTeamMemberMutation.mutateAsync,
    isAddingMember: addTeamMemberMutation.isPending,
    isRemovingMember: removeTeamMemberMutation.isPending,
  };
};
