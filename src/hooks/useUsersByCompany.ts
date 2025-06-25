
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface UserByCompany {
  usuario_id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'admin_salmonera' | 'admin_servicio' | 'supervisor' | 'buzo';
  salmonera_id?: string;
  servicio_id?: string;
  perfil_completado: boolean;
  perfil_buzo?: any;
  empresa_nombre?: string;
  empresa_tipo?: 'salmonera' | 'contratista';
  created_at: string;
}

export const useUsersByCompany = (empresaId?: string, empresaTipo?: 'salmonera' | 'contratista') => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: usuarios = [], isLoading, error } = useQuery({
    queryKey: ['users-by-company', empresaId, empresaTipo, profile?.role],
    queryFn: async () => {
      console.log('🔍 Fetching users by company:', { 
        empresaId, 
        empresaTipo, 
        userRole: profile?.role,
        userSalmoneraId: profile?.salmonera_id,
        userServicioId: profile?.servicio_id
      });

      // Validar que el usuario tenga una empresa asociada
      if (!profile?.salmonera_id && !profile?.servicio_id && profile?.role !== 'superuser') {
        console.warn('⚠️ Usuario sin empresa asociada');
        throw new Error('Usuario sin empresa asociada');
      }

      // Determinar el tipo de empresa del usuario actual
      const userCompanyType = profile?.salmonera_id ? 'salmonera' : 'contratista';
      const userCompanyId = profile?.salmonera_id || profile?.servicio_id;

      console.log('🎯 User company info:', { userCompanyType, userCompanyId });

      let query;

      // Query principal con left joins para manejar ambos tipos de empresa
      if (userCompanyType === 'salmonera' || profile?.role === 'superuser') {
        // Para admin_salmonera y superuser: obtener usuarios con salmoneras
        query = supabase
          .from('usuario')
          .select(`
            *,
            salmoneras!left(nombre, rut)
          `);
      } else {
        // Para admin_servicio: obtener usuarios con contratistas
        query = supabase
          .from('usuario')
          .select(`
            *,
            contratistas!left(nombre, rut)
          `);
      }

      // Aplicar filtros según el tipo de empresa y permisos
      if (profile?.role === 'superuser') {
        // Superuser ve todos los usuarios
        console.log('👑 Superuser: fetching all users');
      } else if (profile?.role === 'admin_salmonera' && profile?.salmonera_id) {
        console.log('🏢 Admin salmonera: filtering by salmonera_id');
        query = query.eq('salmonera_id', profile.salmonera_id);
      } else if (profile?.role === 'admin_servicio' && profile?.servicio_id) {
        console.log('🛠️ Admin servicio: filtering by servicio_id');
        query = query.eq('servicio_id', profile.servicio_id);
      } else {
        console.warn('⚠️ Usuario sin permisos para ver usuarios de empresa');
        return [];
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error fetching users:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details
        });
        throw error;
      }

      console.log('✅ Users found:', data?.length || 0);
      console.log('Raw data sample:', data?.[0]);

      const mappedUsers = (data || []).map(user => {
        let empresaNombre = 'Sin asignar';
        let empresaTipoActual: 'salmonera' | 'contratista' = 'salmonera';

        // Mejorar el manejo de datos de empresa según el tipo de query
        if (user.salmonera_id) {
          empresaTipoActual = 'salmonera';
          if (user.salmoneras && user.salmoneras.nombre) {
            empresaNombre = user.salmoneras.nombre;
          } else {
            empresaNombre = 'Salmonera';
          }
        } else if (user.servicio_id) {
          empresaTipoActual = 'contratista';
          if (user.contratistas && user.contratistas.nombre) {
            empresaNombre = user.contratistas.nombre;
          } else {
            empresaNombre = 'Empresa de servicio';
          }
        }

        return {
          ...user,
          empresa_nombre: empresaNombre,
          empresa_tipo: empresaTipoActual
        };
      }) as UserByCompany[];

      console.log('🔄 Mapped users:', mappedUsers.length);
      return mappedUsers;
    },
    enabled: !!profile,
    retry: (failureCount, error: any) => {
      console.log('🔄 Retry attempt:', failureCount, 'Error:', error?.message);
      // No reintentar si es un error de políticas RLS o autenticación
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
      queryClient.invalidateQueries({ queryKey: ['users-by-company'] });
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

  const createUserMutation = useMutation({
    mutationFn: async (userData: {
      email: string;
      nombre: string;
      apellido: string;
      rol: string;
      empresa_id?: string;
      tipo_empresa?: 'salmonera' | 'contratista';
    }) => {
      console.log('👤 Creating user:', userData);

      const userId = crypto.randomUUID();
      const { data, error } = await supabase
        .from('usuario')
        .insert({
          usuario_id: userId,
          nombre: userData.nombre,
          apellido: userData.apellido,
          email: userData.email,
          rol: userData.rol,
          salmonera_id: userData.tipo_empresa === 'salmonera' ? userData.empresa_id : null,
          servicio_id: userData.tipo_empresa === 'contratista' ? userData.empresa_id : null,
          perfil_completado: true
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating user:', error);
        throw error;
      }
      
      console.log('✅ User created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-by-company'] });
      toast({
        title: 'Usuario creado',
        description: 'El usuario ha sido creado exitosamente.',
      });
    },
    onError: (error: any) => {
      console.error('❌ Error in create mutation:', error);
      toast({
        title: 'Error',
        description: `Error al crear usuario: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    usuarios,
    isLoading,
    error,
    inviteUser: inviteUserMutation.mutate,
    createUser: createUserMutation.mutate,
    isInviting: inviteUserMutation.isPending,
    isCreating: createUserMutation.isPending,
  };
};
