
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface PoolPersonalItem {
  usuario_id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'supervisor' | 'buzo';
  matricula?: string;
  especialidades: string[];
  certificaciones: string[];
  disponible: boolean;
  invitado?: boolean;
  empresa_nombre?: string;
  empresa_tipo?: 'salmonera' | 'contratista';
}

export const usePoolPersonal = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: personal = [], isLoading } = useQuery({
    queryKey: ['pool-personal', profile?.role, profile?.salmonera_id],
    queryFn: async () => {
      console.log('Fetching pool personal...', { 
        userRole: profile?.role, 
        salmoneraId: profile?.salmonera_id 
      });
      
      if (!profile) return [];

      let query = supabase
        .from('usuario')
        .select(`
          *,
          salmonera:salmoneras(nombre),
          servicio:contratistas(nombre)
        `)
        .in('rol', ['supervisor', 'buzo']);

      // Filtrar según el rol del usuario actual
      if (profile.role === 'admin_salmonera' && profile.salmonera_id) {
        // Admin salmonera ve su personal + contratistas asociados
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
      } else if (profile.role === 'admin_servicio' && profile.servicio_id) {
        // Admin servicio ve solo su personal
        query = query.eq('servicio_id', profile.servicio_id);
      } else if (profile.role === 'superuser') {
        // Superuser ve todo
      } else {
        // Otros roles no tienen acceso
        return [];
      }

      const { data, error } = await query.order('nombre', { ascending: true });

      if (error) {
        console.error('Error fetching pool personal:', error);
        throw error;
      }

      console.log('Pool personal data:', data);

      return (data || []).map(user => {
        let empresaNombre = 'Sin asignar';
        let empresaTipo: 'salmonera' | 'contratista' = 'salmonera';

        if (user.salmonera && typeof user.salmonera === 'object' && 'nombre' in user.salmonera) {
          empresaNombre = String(user.salmonera.nombre);
          empresaTipo = 'salmonera';
        } else if (user.servicio && typeof user.servicio === 'object' && 'nombre' in user.servicio) {
          empresaNombre = String(user.servicio.nombre);
          empresaTipo = 'contratista';
        }

        // Safely parse perfil_buzo JSON
        const perfilBuzo = user.perfil_buzo && typeof user.perfil_buzo === 'object' && user.perfil_buzo !== null
          ? user.perfil_buzo as Record<string, any>
          : {};

        return {
          usuario_id: user.usuario_id,
          email: user.email || '',
          nombre: user.nombre,
          apellido: user.apellido,
          rol: user.rol as 'supervisor' | 'buzo',
          matricula: perfilBuzo.matricula || '',
          especialidades: Array.isArray(perfilBuzo.especialidades) ? perfilBuzo.especialidades : [],
          certificaciones: Array.isArray(perfilBuzo.certificaciones) ? perfilBuzo.certificaciones : [],
          disponible: true, // Por ahora siempre true, se puede agregar lógica más adelante
          empresa_nombre: empresaNombre,
          empresa_tipo: empresaTipo
        };
      }) as PoolPersonalItem[];
    },
    enabled: !!profile,
  });

  const addPersonalMutation = useMutation({
    mutationFn: async (personalData: any) => {
      // Esta función agregaría personal existente al pool
      console.log('Adding personal to pool:', personalData);
      // Por ahora solo simulamos éxito
      return personalData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pool-personal'] });
      toast({
        title: 'Personal agregado',
        description: 'El personal ha sido agregado al pool exitosamente.',
      });
    },
  });

  const invitePersonalMutation = useMutation({
    mutationFn: async (inviteData: any) => {
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
      queryClient.invalidateQueries({ queryKey: ['pool-personal'] });
      toast({
        title: 'Invitación enviada',
        description: 'La invitación ha sido enviada exitosamente.',
      });
    },
  });

  const updateDisponibilidadMutation = useMutation({
    mutationFn: async ({ personalId, disponible }: { personalId: string; disponible: boolean }) => {
      // Por ahora solo simulamos la actualización
      console.log('Updating disponibilidad:', { personalId, disponible });
      return { personalId, disponible };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pool-personal'] });
    },
  });

  return {
    personal,
    isLoading,
    addPersonal: addPersonalMutation.mutate,
    invitePersonal: invitePersonalMutation.mutate,
    updateDisponibilidad: updateDisponibilidadMutation.mutate,
    isInviting: invitePersonalMutation.isPending,
  };
};
