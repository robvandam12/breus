
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface PersonalProfile {
  usuario_id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'supervisor' | 'buzo';
  salmonera_id?: string;
  servicio_id?: string;
  perfil_buzo?: {
    rut?: string;
    telefono?: string;
    matricula?: string;
    especialidades?: string[];
    certificacion_nivel?: string;
    fecha_vencimiento_certificacion?: string;
    experiencia_anos?: string;
    direccion?: string;
    ciudad?: string;
    region?: string;
    fecha_nacimiento?: string;
    contacto_emergencia_nombre?: string;
    contacto_emergencia_telefono?: string;
    contacto_emergencia_relacion?: string;
    observaciones_medicas?: string;
  };
  perfil_completado?: boolean;
  created_at: string;
  updated_at: string;
}

export const usePersonalProfiles = () => {
  const queryClient = useQueryClient();

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ['personal-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usuario')
        .select('*')
        .in('rol', ['supervisor', 'buzo'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PersonalProfile[];
    },
  });

  const updateProfile = useMutation({
    mutationFn: async ({ id, profileData }: { id: string; profileData: any }) => {
      const { data, error } = await supabase
        .from('usuario')
        .update({
          perfil_buzo: profileData,
          perfil_completado: true
        })
        .eq('usuario_id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal-profiles'] });
      toast({
        title: 'Perfil actualizado',
        description: 'Los datos del perfil han sido actualizados exitosamente.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Error al actualizar el perfil: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Helper function to get user data for forms
  const getUserData = (userId: string) => {
    const user = profiles.find(p => p.usuario_id === userId);
    if (!user || !user.perfil_buzo) return null;

    return {
      nombre_completo: `${user.nombre} ${user.apellido}`,
      rut: user.perfil_buzo.rut,
      matricula: user.perfil_buzo.matricula,
      telefono: user.perfil_buzo.telefono,
      especialidades: user.perfil_buzo.especialidades || [],
      certificacion_nivel: user.perfil_buzo.certificacion_nivel,
      rol: user.rol
    };
  };

  return {
    profiles,
    isLoading,
    updateProfile: updateProfile.mutate,
    getUserData,
    isUpdating: updateProfile.isPending,
  };
};
