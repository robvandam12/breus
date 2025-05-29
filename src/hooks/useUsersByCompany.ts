
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
      console.log('=== DEBUGGING useUsersByCompany ===');
      console.log('Input params:', { 
        empresaId, 
        empresaTipo, 
        userRole: profile?.role,
        userSalmoneraId: profile?.salmonera_id 
      });

      // Primero, veamos TODOS los usuarios sin filtro para debuggear
      const { data: allUsers, error: allUsersError } = await supabase
        .from('usuario')
        .select('*');
        
      console.log('TODOS los usuarios en la BD:', allUsers);
      console.log('Error al obtener todos los usuarios:', allUsersError);

      // Ahora veamos específicamente los de esta salmonera
      const targetSalmoneraId = empresaId || profile?.salmonera_id;
      console.log('Target Salmonera ID:', targetSalmoneraId);

      if (targetSalmoneraId) {
        const { data: salmoneraUsers, error: salmoneraError } = await supabase
          .from('usuario')
          .select('*')
          .eq('salmonera_id', targetSalmoneraId);
          
        console.log('Usuarios filtrados por salmonera_id:', salmoneraUsers);
        console.log('Error en filtro salmonera:', salmoneraError);
      }

      // Query principal con joins
      let query = supabase
        .from('usuario')
        .select(`
          *,
          salmonera:salmoneras(nombre)
        `);

      // Si no se especifica empresa, usar la empresa del usuario actual
      const targetEmpresaId = empresaId || profile?.salmonera_id || profile?.servicio_id;
      const targetEmpresaTipo = empresaTipo || (profile?.salmonera_id ? 'salmonera' : 'contratista');

      console.log('Target empresa final:', { targetEmpresaId, targetEmpresaTipo });

      if (targetEmpresaId) {
        if (targetEmpresaTipo === 'salmonera') {
          console.log('Aplicando filtro salmonera_id =', targetEmpresaId);
          query = query.eq('salmonera_id', targetEmpresaId);
        } else if (targetEmpresaTipo === 'contratista') {
          console.log('Aplicando filtro servicio_id =', targetEmpresaId);
          query = query.eq('servicio_id', targetEmpresaId);
        }
      } else {
        // Si no hay empresa específica, aplicar filtros según permisos
        console.log('Aplicando filtros por rol de usuario');
        if (profile?.role === 'superuser') {
          console.log('Usuario superuser - ve todos');
          // Superuser ve todos los usuarios
        } else if (profile?.role === 'admin_salmonera' && profile?.salmonera_id) {
          console.log('Usuario admin_salmonera - filtrar por salmonera_id =', profile.salmonera_id);
          query = query.eq('salmonera_id', profile.salmonera_id);
        } else if (profile?.role === 'admin_servicio' && profile?.servicio_id) {
          console.log('Usuario admin_servicio - filtrar por servicio_id =', profile.servicio_id);
          query = query.eq('servicio_id', profile.servicio_id);
        } else {
          console.log('Usuario sin permisos específicos - retornar array vacío');
          // Usuario sin permisos específicos, no devolver nada
          return [];
        }
      }

      query = query.order('created_at', { ascending: false });

      console.log('Ejecutando query principal...');
      const { data, error } = await query;

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      console.log('Raw data from Supabase (query principal):', data);
      console.log('Cantidad de registros encontrados:', data?.length || 0);

      const mappedUsers = (data || []).map(user => {
        console.log('Procesando usuario:', user);
        
        let empresaNombre = 'Sin asignar';
        let empresaTipoActual: 'salmonera' | 'contratista' = 'salmonera';

        if (user.salmonera && typeof user.salmonera === 'object' && 'nombre' in user.salmonera) {
          empresaNombre = String(user.salmonera.nombre);
          empresaTipoActual = 'salmonera';
        } else if (user.servicio_id) {
          empresaNombre = 'Empresa de servicio';
          empresaTipoActual = 'contratista';
        }

        const mappedUser = {
          ...user,
          empresa_nombre: empresaNombre,
          empresa_tipo: empresaTipoActual
        };
        
        console.log('Usuario mapeado:', mappedUser);
        return mappedUser;
      }) as UserByCompany[];

      console.log('=== FINAL RESULT ===');
      console.log('Mapped users total:', mappedUsers.length);
      console.log('Mapped users:', mappedUsers);
      console.log('=== END DEBUG ===');
      
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
