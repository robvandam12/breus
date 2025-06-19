
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export interface UserProfile {
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  rut?: string;
  telefono?: string;
  matricula?: string;
  certificaciones?: string[];
  experiencia_anos?: number;
  especialidades?: string[];
  perfil_buzo?: any;
}

export const useUserProfile = () => {
  const { user } = useAuth();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('usuario')
        .select('*')
        .eq('usuario_id', user.id)
        .single();

      if (error) throw error;
      return data as UserProfile;
    },
    enabled: !!user?.id,
  });

  const getFormDefaults = () => {
    if (!profile) return {};
    
    return {
      nombre: profile.nombre || '',
      apellido: profile.apellido || '',
      email: profile.email || user?.email || '',
      rut: profile.perfil_buzo?.rut || '',
      telefono: profile.perfil_buzo?.telefono || '',
      matricula: profile.perfil_buzo?.matricula || '',
      certificaciones: profile.perfil_buzo?.certificaciones || [],
      experiencia_anos: profile.perfil_buzo?.experiencia_anos || 0,
      especialidades: profile.perfil_buzo?.especialidades || [],
    };
  };

  const getFullName = () => {
    if (!profile) return '';
    return `${profile.nombre} ${profile.apellido}`.trim();
  };

  return {
    profile,
    isLoading,
    error,
    getFormDefaults,
    getFullName,
    user,
  };
};
