
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
      console.log('Fetching users by company...', { 
        empresaId, 
        empresaTipo, 
        userRole: profile?.role,
        userSalmoneraId: profile?.salmonera_id 
      });
      
      let query = supabase
        .from('usuario')
        .select(`
          *,
          salmonera:salmoneras(nombre),
          contratista:contratistas(nombre)
        `);

      // Si no se especifica empresa, usar la empresa del usuario actual
      const targetEmpresaId = empresaId || profile?.salmonera_id || profile?.servicio_id;
      const targetEmpresaTipo = empresaTipo || (profile?.salmonera_id ? 'salmonera' : 'contratista');

      console.log('Target empresa:', { targetEmpresaId, targetEmpresaTipo });

      if (targetEmpresaId) {
        if (targetEmpresaTipo === 'salmonera') {
          query = query.eq('salmonera_id', targetEmpresaId);
        } else if (targetEmpresaTipo === 'contratista') {
          query = query.eq('servicio_id', targetEmpresaId);
        }
      } else {
        // Si no hay empresa específica, aplicar filtros según permisos
        if (profile?.role === 'superuser') {
          // Superuser ve todos los usuarios
        } else if (profile?.role === 'admin_salmonera' && profile?.salmonera_id) {
          // Admin salmonera ve sus usuarios + contratistas asociados
          const { data: associations } = await supabase
            .from('salmonera_contratista')
            .select('contratista_id')
            .eq('salmonera_id', profile.salmonera_id)
            .eq('estado', 'activa');
          
          const contratistaIds = associations?.map(a => a.contratista_id) || [];
          
          if (contratistaIds.length > 0) {
            query = query.or(
              `salmonera_id.eq.${profile.salmonera_id},servicio_id.in.(${contratistaIds.join(',')})`
            );
          } else {
            query = query.eq('salmonera_id', profile.salmonera_id);
          }
        } else if (profile?.role === 'admin_servicio' && profile?.servicio_id) {
          query = query.eq('servicio_id', profile.servicio_id);
        } else {
          // Usuario sin permisos específicos, no devolver nada
          return [];
        }
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      console.log('Raw data from Supabase:', data);

      const mappedUsers = (data || []).map(user => {
        let empresaNombre = 'Sin asignar';
        let empresaTipoActual: 'salmonera' | 'contratista' = 'salmonera';

        if (user.salmonera && typeof user.salmonera === 'object' && 'nombre' in user.salmonera) {
          empresaNombre = String(user.salmonera.nombre);
          empresaTipoActual = 'salmonera';
        } else if (user.contratista && typeof user.contratista === 'object' && 'nombre' in user.contratista) {
          empresaNombre = String(user.contratista.nombre);
          empresaTipoActual = 'contratista';
        }

        return {
          ...user,
          empresa_nombre: empresaNombre,
          empresa_tipo: empresaTipoActual
        };
      }) as UserByCompany[];

      console.log('Mapped users:', mappedUsers);
      return mappedUsers;
    },
    enabled: !!profile,
  });

  // Log para debugging
  console.log('useUsersByCompany result:', { usuarios, isLoading, error, profile });

  const inviteUserMutation = useMutation({
    mutationFn: async (inviteData: {
      email: string;
      nombre: string;
      apellido: string;
      rol: string;
      empresa_id?: string;
      tipo_empresa?: 'salmonera' | 'contratista';
    }) => {
      const { data, error } = await supabase
        .from('usuario_invitaciones')
        .insert({
          ...inviteData,
          token: crypto.randomUUID(),
          invitado_por: profile?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-by-company'] });
      toast({
        title: 'Invitación enviada',
        description: 'La invitación ha sido enviada exitosamente.',
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

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-by-company'] });
      toast({
        title: 'Usuario creado',
        description: 'El usuario ha sido creado exitosamente.',
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
