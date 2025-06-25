
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface EmailStatus {
  exists: boolean;
  hasUser: boolean;
  hasPendingInvitation: boolean;
  pendingInvitation?: {
    id: string;
    rol: string;
    estado: string;
    fecha_expiracion: string;
  };
  user?: {
    id: string;
    nombre: string;
    apellido: string;
    rol: string;
  };
}

export const useEmailValidation = (email: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['email-validation', email],
    queryFn: async (): Promise<EmailStatus> => {
      if (!email) {
        return {
          exists: false,
          hasUser: false,
          hasPendingInvitation: false
        };
      }

      // Verificar si existe usuario con ese email
      const { data: userData, error: userError } = await supabase
        .from('usuario')
        .select('usuario_id, nombre, apellido, rol')
        .eq('email', email.toLowerCase())
        .single();

      if (userError && userError.code !== 'PGRST116') {
        console.error('Error checking user:', userError);
        throw userError;
      }

      // Verificar si existe invitación pendiente
      const { data: invitationData, error: invitationError } = await supabase
        .from('usuario_invitaciones')
        .select('id, rol, estado, fecha_expiracion')
        .eq('email', email.toLowerCase())
        .eq('estado', 'pendiente')
        .gte('fecha_expiracion', new Date().toISOString())
        .single();

      if (invitationError && invitationError.code !== 'PGRST116') {
        console.error('Error checking invitation:', invitationError);
        throw invitationError;
      }

      return {
        exists: !!userData || !!invitationData,
        hasUser: !!userData,
        hasPendingInvitation: !!invitationData,
        pendingInvitation: invitationData ? {
          id: invitationData.id,
          rol: invitationData.rol,
          estado: invitationData.estado,
          fecha_expiracion: invitationData.fecha_expiracion
        } : undefined,
        user: userData ? {
          id: userData.usuario_id,
          nombre: userData.nombre,
          apellido: userData.apellido,
          rol: userData.rol
        } : undefined
      };
    },
    enabled: enabled && !!email && email.includes('@'),
  });
};
