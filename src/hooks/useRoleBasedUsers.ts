import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface RoleBasedUser {
  usuario_id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'admin_salmonera' | 'admin_servicio' | 'supervisor' | 'buzo' | 'superuser';
  salmonera_id?: string;
  servicio_id?: string;
  perfil_completado: boolean;
  estado_buzo?: string;
  empresa_nombre?: string;
  empresa_tipo?: 'salmonera' | 'contratista';
  created_at: string;
  updated_at: string;
}

export const useRoleBasedUsers = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: usuarios = [], isLoading, error } = useQuery({
    queryKey: ['role-based-users', profile?.role, profile?.salmonera_id, profile?.servicio_id],
    queryFn: async () => {
      console.log('🔍 Fetching role-based users:', { 
        userRole: profile?.role,
        userSalmoneraId: profile?.salmonera_id,
        userServicioId: profile?.servicio_id
      });

      if (!profile) {
        throw new Error('No profile available');
      }

      let query = supabase.from('usuario').select(`
        *,
        salmoneras!left(nombre, rut),
        contratistas!left(nombre, rut)
      `);

      // Aplicar filtros según el rol
      if (profile.role === 'superuser') {
        // Superuser ve todos los usuarios
        console.log('👑 Superuser: fetching all users');
      } else if (profile.role === 'admin_salmonera' && profile.salmonera_id) {
        // Admin salmonera ve:
        // 1. Usuarios de su salmonera
        // 2. Usuarios de contratistas asociados a su salmonera
        console.log('🏢 Admin salmonera: filtering by salmonera and associated contractors');
        
        // Primero obtener los contratistas asociados a esta salmonera
        const { data: asociaciones } = await supabase
          .from('salmonera_contratista')
          .select('contratista_id')
          .eq('salmonera_id', profile.salmonera_id)
          .eq('estado', 'activa');

        const contratistaIds = asociaciones?.map(a => a.contratista_id) || [];
        
        // Filtrar usuarios de la salmonera o de contratistas asociados
        query = query.or(`salmonera_id.eq.${profile.salmonera_id},servicio_id.in.(${contratistaIds.join(',')})`);
      } else if (profile.role === 'admin_servicio' && profile.servicio_id) {
        // Admin servicio ve solo usuarios de su contratista
        console.log('🛠️ Admin servicio: filtering by servicio_id');
        query = query.eq('servicio_id', profile.servicio_id);
      } else {
        console.warn('⚠️ Usuario sin permisos o empresa asignada');
        return [];
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error fetching users:', error);
        throw error;
      }

      console.log('✅ Users found:', data?.length || 0);

      // Mapear datos y agregar información de empresa
      const mappedUsers = (data || []).map(user => {
        let empresaNombre = 'Sin asignar';
        let empresaTipo: 'salmonera' | 'contratista' | undefined;

        // Manejar relaciones de manera consistente con type assertions
        if (user.salmoneras) {
          if (Array.isArray(user.salmoneras) && user.salmoneras.length > 0) {
            empresaNombre = (user.salmoneras as any[])[0].nombre;
            empresaTipo = 'salmonera';
          } else if (!Array.isArray(user.salmoneras)) {
            empresaNombre = (user.salmoneras as any).nombre;
            empresaTipo = 'salmonera';
          }
        } else if (user.contratistas) {
          if (Array.isArray(user.contratistas) && user.contratistas.length > 0) {
            empresaNombre = (user.contratistas as any[])[0].nombre;
            empresaTipo = 'contratista';
          } else if (!Array.isArray(user.contratistas)) {
            empresaNombre = (user.contratistas as any).nombre;
            empresaTipo = 'contratista';
          }
        } else if (user.salmonera_id) {
          empresaNombre = 'Salmonera';
          empresaTipo = 'salmonera';
        } else if (user.servicio_id) {
          empresaNombre = 'Empresa de servicio';
          empresaTipo = 'contratista';
        }

        return {
          ...user,
          empresa_nombre: empresaNombre,
          empresa_tipo: empresaTipo
        };
      }) as RoleBasedUser[];

      console.log('🔄 Mapped users:', mappedUsers.length);
      return mappedUsers;
    },
    enabled: !!profile && ['superuser', 'admin_salmonera', 'admin_servicio'].includes(profile.role),
    retry: (failureCount, error: any) => {
      console.log('🔄 Retry attempt:', failureCount, 'Error:', error?.message);
      if (error?.code === '42501' || error?.code === 'PGRST301') {
        console.error('🚫 RLS/Auth error, not retrying:', error);
        return false;
      }
      return failureCount < 2;
    },
  });

  const inviteUserMutation = useMutation({
    mutationFn: async (inviteData: {
      email: string;
      nombre: string;
      apellido: string;
      rol: string;
      empresa_id?: string;
      tipo_empresa?: 'salmonera' | 'contratista';
    }) => {
      console.log('📧 Inviting user:', inviteData);

      const { data, error } = await supabase
        .from('usuario_invitaciones')
        .insert({
          ...inviteData,
          token: crypto.randomUUID(),
          invitado_por: profile?.id
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error inviting user:', error);
        throw error;
      }
      
      console.log('✅ User invited successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-based-users'] });
      toast({
        title: 'Invitación enviada',
        description: 'La invitación ha sido enviada exitosamente.',
      });
    },
    onError: (error: any) => {
      console.error('❌ Error in invite mutation:', error);
      toast({
        title: 'Error',
        description: `Error al enviar invitación: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, userData }: { id: string; userData: any }) => {
      console.log('✏️ Updating user:', id, userData);

      const { data, error } = await supabase
        .from('usuario')
        .update(userData)
        .eq('usuario_id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating user:', error);
        throw error;
      }
      
      console.log('✅ User updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-based-users'] });
      toast({
        title: 'Usuario actualizado',
        description: 'El usuario ha sido actualizado exitosamente.',
      });
    },
    onError: (error: any) => {
      console.error('❌ Error in update mutation:', error);
      toast({
        title: 'Error',
        description: `Error al actualizar usuario: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deleting user:', id);

      const { error } = await supabase
        .from('usuario')
        .delete()
        .eq('usuario_id', id);

      if (error) {
        console.error('❌ Error deleting user:', error);
        throw error;
      }
      
      console.log('✅ User deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-based-users'] });
      toast({
        title: 'Usuario eliminado',
        description: 'El usuario ha sido eliminado exitosamente.',
      });
    },
    onError: (error: any) => {
      console.error('❌ Error in delete mutation:', error);
      toast({
        title: 'Error',
        description: `Error al eliminar usuario: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    usuarios,
    isLoading,
    error,
    inviteUser: inviteUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    isInviting: inviteUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
  };
};
