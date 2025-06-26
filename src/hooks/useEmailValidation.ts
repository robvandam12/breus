
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface EmailValidationResult {
  exists: boolean;
  hasUser: boolean;
  hasPendingInvitation: boolean;
  user?: {
    nombre: string;
    apellido: string;
    rol: string;
  };
  pendingInvitation?: {
    rol: string;
    fecha_expiracion: string;
  };
}

export const useEmailValidation = (email: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['email-validation', email],
    queryFn: async (): Promise<EmailValidationResult> => {
      if (!email || !email.includes('@')) {
        return {
          exists: false,
          hasUser: false,
          hasPendingInvitation: false
        };
      }

      console.log('Validating email:', email);

      // Verificar si existe usuario registrado
      const { data: userData, error: userError } = await supabase
        .from('usuario')
        .select('nombre, apellido, rol')
        .eq('email', email.toLowerCase())
        .single();

      if (userError && userError.code !== 'PGRST116') {
        console.error('Error checking user:', userError);
      }

      // Verificar si existe invitación pendiente
      const { data: invitationData, error: invitationError } = await supabase
        .from('usuario_invitaciones')
        .select('rol, fecha_expiracion')
        .eq('email', email.toLowerCase())
        .eq('estado', 'pendiente')
        .gt('fecha_expiracion', new Date().toISOString())
        .single();

      if (invitationError && invitationError.code !== 'PGRST116') {
        console.error('Error checking invitation:', invitationError);
      }

      const hasUser = !!userData;
      const hasPendingInvitation = !!invitationData;
      const exists = hasUser || hasPendingInvitation;

      console.log('Email validation result:', {
        email,
        exists,
        hasUser,
        hasPendingInvitation
      });

      return {
        exists,
        hasUser,
        hasPendingInvitation,
        user: userData || undefined,
        pendingInvitation: invitationData || undefined
      };
    },
    enabled: enabled && !!email && email.includes('@'),
    staleTime: 30000, // 30 segundos
    retry: 1
  });
};
