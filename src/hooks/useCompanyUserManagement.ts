
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useCompanyUserManagement = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  const removeUserFromCompanyMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('usuario')
        .update({
          salmonera_id: null,
          servicio_id: null
        })
        .eq('usuario_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-by-company'] });
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast({
        title: 'Usuario desasociado',
        description: 'El usuario ha sido removido de la empresa exitosamente.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Error al remover usuario: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const inviteExistingUserMutation = useMutation({
    mutationFn: async (userData: {
      email: string;
      userId: string;
    }) => {
      // Determinar empresa del usuario actual
      let empresa_id = null;
      let tipo_empresa = null;
      
      if (profile?.salmonera_id) {
        empresa_id = profile.salmonera_id;
        tipo_empresa = 'salmonera';
      } else if (profile?.servicio_id) {
        empresa_id = profile.servicio_id;
        tipo_empresa = 'contratista';
      }
      
      if (!empresa_id) {
        throw new Error('No se pudo determinar la empresa del invitador');
      }

      // Actualizar el usuario existente para asociarlo a la empresa
      const updateData = tipo_empresa === 'salmonera' 
        ? { salmonera_id: empresa_id, servicio_id: null }
        : { salmonera_id: null, servicio_id: empresa_id };

      const { error } = await supabase
        .from('usuario')
        .update(updateData)
        .eq('usuario_id', userData.userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-by-company'] });
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast({
        title: 'Usuario agregado',
        description: 'El usuario ha sido agregado a la empresa exitosamente.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Error al agregar usuario: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    removeUserFromCompany: removeUserFromCompanyMutation.mutate,
    inviteExistingUser: inviteExistingUserMutation.mutate,
    isRemoving: removeUserFromCompanyMutation.isPending,
    isInviting: inviteExistingUserMutation.isPending,
  };
};
