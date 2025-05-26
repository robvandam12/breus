
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Usuario {
  usuario_id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'superuser' | 'admin_salmonera' | 'admin_servicio' | 'supervisor' | 'buzo';
  salmonera_id?: string;
  servicio_id?: string;
  perfil_completado?: boolean;
  perfil_buzo?: any;
  created_at: string;
  updated_at: string;
  salmonera?: {
    nombre: string;
    rut: string;
  };
  servicio?: {
    nombre: string;
    rut: string;
  };
}

export const useUsuarios = () => {
  const queryClient = useQueryClient();

  const { data: usuarios = [], isLoading } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usuario')
        .select(`
          *,
          salmonera:salmoneras(nombre, rut),
          servicio:contratistas(nombre, rut)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Usuario[];
    },
  });

  const updateUsuario = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Usuario> & { id: string }) => {
      const { data, error } = await supabase
        .from('usuario')
        .update(updates)
        .eq('usuario_id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast({
        title: 'Usuario actualizado',
        description: 'Los datos del usuario han sido actualizados exitosamente.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Error al actualizar el usuario: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const inviteUsuario = useMutation({
    mutationFn: async (invitationData: {
      email: string;
      nombre: string;
      apellido: string;
      rol: string;
      empresa_id?: string;
      tipo_empresa?: 'salmonera' | 'contratista';
    }) => {
      const token = crypto.randomUUID();
      
      const { data, error } = await supabase
        .from('usuario_invitaciones')
        .insert({
          ...invitationData,
          token,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitaciones'] });
      toast({
        title: 'Invitación enviada',
        description: 'La invitación ha sido enviada exitosamente.',
      });
    },
  });

  return {
    usuarios,
    isLoading,
    updateUsuario: updateUsuario.mutate,
    inviteUsuario: inviteUsuario.mutate,
    isUpdating: updateUsuario.isPending,
  };
};
