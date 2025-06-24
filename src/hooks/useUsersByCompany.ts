
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

// Helper function to extract valid UUID from potentially malformed ID
const extractValidId = (id: any): string | null => {
  if (!id) return null;
  
  // If it's an object with a value property, extract it
  if (typeof id === 'object' && id.value !== undefined) {
    const value = id.value;
    if (value === 'undefined' || value === 'null' || !value) return null;
    return value;
  }
  
  // If it's already a string, return it (unless it's 'undefined' or 'null')
  if (typeof id === 'string') {
    if (id === 'undefined' || id === 'null' || id === '') return null;
    return id;
  }
  
  return null;
};

export const useUsersByCompany = (empresaId?: string, empresaTipo?: 'salmonera' | 'contratista') => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: usuarios = [], isLoading, error } = useQuery({
    queryKey: ['users-by-company', empresaId, empresaTipo, profile?.role],
    queryFn: async () => {
      console.log('🔍 Fetching users by company with profile:', { 
        profileRole: profile?.role,
        profileSalmoneraId: profile?.salmonera_id,
        profileServicioId: profile?.servicio_id,
        empresaId, 
        empresaTipo
      });

      // Extract and validate IDs from profile
      const profileSalmoneraId = extractValidId(profile?.salmonera_id);
      const profileServicioId = extractValidId(profile?.servicio_id);
      
      console.log('🔧 Extracted valid IDs:', {
        profileSalmoneraId,
        profileServicioId,
        originalSalmoneraId: profile?.salmonera_id,
        originalServicioId: profile?.servicio_id
      });

      // Determine target company
      const targetEmpresaId = empresaId || profileSalmoneraId || profileServicioId;
      const targetEmpresaTipo = empresaTipo || (profileSalmoneraId ? 'salmonera' : 'contratista');

      console.log('🎯 Target empresa:', { 
        targetEmpresaId, 
        targetEmpresaTipo,
        hasValidTargetId: !!targetEmpresaId
      });

      // If no valid company ID, return empty array for now (instead of throwing error)
      if (!targetEmpresaId) {
        console.warn('⚠️ No valid company ID found, returning empty array');
        return [];
      }

      // Build query with joins
      let query = supabase
        .from('usuario')
        .select(`
          *,
          salmonera:salmoneras(nombre)
        `);

      // Apply company filter
      if (targetEmpresaTipo === 'salmonera') {
        query = query.eq('salmonera_id', targetEmpresaId);
      } else if (targetEmpresaTipo === 'contratista') {
        query = query.eq('servicio_id', targetEmpresaId);
      }

      // Apply role-based filters for additional security
      if (profile?.role === 'admin_salmonera' && profileSalmoneraId) {
        query = query.eq('salmonera_id', profileSalmoneraId);
      } else if (profile?.role === 'admin_servicio' && profileServicioId) {
        query = query.eq('servicio_id', profileServicioId);
      }

      query = query.order('created_at', { ascending: false });

      console.log('📡 Executing query for:', { targetEmpresaId, targetEmpresaTipo, role: profile?.role });

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error fetching users:', error);
        throw error;
      }

      console.log('✅ Users found:', {
        count: data?.length || 0,
        users: data?.map(u => ({ id: u.usuario_id, nombre: u.nombre, rol: u.rol }))
      });

      const mappedUsers = (data || []).map(user => {
        let empresaNombre = 'Sin asignar';
        let empresaTipoActual: 'salmonera' | 'contratista' = 'salmonera';

        if (user.salmonera && typeof user.salmonera === 'object' && 'nombre' in user.salmonera) {
          empresaNombre = String(user.salmonera.nombre);
          empresaTipoActual = 'salmonera';
        } else if (user.servicio_id) {
          empresaNombre = 'Empresa de servicio';
          empresaTipoActual = 'contratista';
        }

        return {
          ...user,
          empresa_nombre: empresaNombre,
          empresa_tipo: empresaTipoActual
        };
      }) as UserByCompany[];

      return mappedUsers;
    },
    enabled: !!profile,
    retry: (failureCount, error: any) => {
      console.log('🔄 Query retry attempt:', { failureCount, errorCode: error?.code });
      
      // No reintentar si es un error de políticas RLS
      if (error?.code === '42P17' || error?.message?.includes('policy')) {
        console.error('🚫 RLS policy error, not retrying:', error);
        return false;
      }
      return failureCount < 3;
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
    onError: (error: any) => {
      console.error('❌ Error sending invitation:', error);
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
      usuario_id?: string;
    }) => {
      // If usuario_id is provided, we're adding an existing user to the company
      if (userData.usuario_id) {
        const { data, error } = await supabase
          .from('usuario')
          .update({
            salmonera_id: userData.tipo_empresa === 'salmonera' ? userData.empresa_id : null,
            servicio_id: userData.tipo_empresa === 'contratista' ? userData.empresa_id : null,
            rol: userData.rol
          })
          .eq('usuario_id', userData.usuario_id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new user
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
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-by-company'] });
      toast({
        title: 'Usuario agregado',
        description: 'El usuario ha sido agregado exitosamente.',
      });
    },
    onError: (error: any) => {
      console.error('❌ Error creating/updating user:', error);
      toast({
        title: 'Error',
        description: `Error al gestionar usuario: ${error.message}`,
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
