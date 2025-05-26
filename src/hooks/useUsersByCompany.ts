
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

  const { data: usuarios = [], isLoading } = useQuery({
    queryKey: ['users-by-company', empresaId, empresaTipo, profile?.role],
    queryFn: async () => {
      console.log('Fetching users by company...', { empresaId, empresaTipo, userRole: profile?.role });
      
      let query = supabase
        .from('usuario')
        .select(`
          *,
          salmonera:salmoneras(nombre),
          servicio:contratistas(nombre)
        `);

      // Apply filters based on user role
      if (profile?.role === 'superuser') {
        // Superuser sees all users
        if (empresaId && empresaTipo) {
          if (empresaTipo === 'salmonera') {
            query = query.eq('salmonera_id', empresaId);
          } else {
            query = query.eq('servicio_id', empresaId);
          }
        }
      } else if (profile?.role === 'admin_salmonera') {
        // Admin salmonera sees their own users + associated contractors
        if (empresaTipo === 'salmonera') {
          query = query.eq('salmonera_id', empresaId);
        } else {
          // Show contractors associated with this salmonera
          const { data: associations } = await supabase
            .from('salmonera_contratista')
            .select('contratista_id')
            .eq('salmonera_id', profile.salmonera_id)
            .eq('estado', 'activa');
          
          const contratistaIds = associations?.map(a => a.contratista_id) || [];
          if (contratistaIds.length > 0) {
            query = query.in('servicio_id', contratistaIds);
          } else {
            return [];
          }
        }
      } else if (profile?.role === 'admin_servicio') {
        // Admin servicio sees only their own users
        query = query.eq('servicio_id', profile.servicio_id);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      return (data || []).map(user => {
        let empresaNombre = 'Sin asignar';
        let empresaTipoActual: 'salmonera' | 'contratista' = 'salmonera';

        if (user.salmonera && typeof user.salmonera === 'object' && 'nombre' in user.salmonera) {
          empresaNombre = String(user.salmonera.nombre);
          empresaTipoActual = 'salmonera';
        } else if (user.servicio && typeof user.servicio === 'object' && 'nombre' in user.servicio) {
          empresaNombre = String(user.servicio.nombre);
          empresaTipoActual = 'contratista';
        }

        return {
          ...user,
          empresa_nombre: empresaNombre,
          empresa_tipo: empresaTipoActual
        };
      }) as UserByCompany[];
    },
    enabled: !!profile,
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
    inviteUser: inviteUserMutation.mutate,
    createUser: createUserMutation.mutate,
    isInviting: inviteUserMutation.isPending,
    isCreating: createUserMutation.isPending,
  };
};
