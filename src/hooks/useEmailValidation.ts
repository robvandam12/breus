
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

      try {
        // Verificar si existe usuario registrado
        console.log('Checking for existing user...');
        const { data: userData, error: userError } = await supabase
          .from('usuario')
          .select('nombre, apellido, rol')
          .eq('email', email.toLowerCase())
          .maybeSingle();

        console.log('User query result:', { userData, userError });

        if (userError) {
          console.error('Error checking user:', userError);
          // Si es un error de RLS, continuar sin fallar completamente
          if (userError.code !== 'PGRST116' && !userError.message.includes('row-level security')) {
            throw userError;
          }
        }

        // Verificar si existe invitación pendiente
        console.log('Checking for pending invitation...');
        const { data: invitationData, error: invitationError } = await supabase
          .from('usuario_invitaciones')
          .select('rol, fecha_expiracion')
          .eq('email', email.toLowerCase())
          .eq('estado', 'pendiente')
          .gt('fecha_expiracion', new Date().toISOString())
          .maybeSingle();

        console.log('Invitation query result:', { invitationData, invitationError });

        if (invitationError) {
          console.error('Error checking invitation:', invitationError);
          // Si es un error de RLS, continuar sin fallar completamente
          if (invitationError.code !== 'PGRST116' && !invitationError.message.includes('row-level security')) {
            throw invitationError;
          }
        }

        const hasUser = !!userData;
        const hasPendingInvitation = !!invitationData;
        const exists = hasUser || hasPendingInvitation;

        const result = {
          exists,
          hasUser,
          hasPendingInvitation,
          user: userData || undefined,
          pendingInvitation: invitationData || undefined
        };

        console.log('Email validation result:', result);
        return result;

      } catch (error) {
        console.error('Email validation error:', error);
        // En caso de error, devolver resultado por defecto que permite continuar
        return {
          exists: false,
          hasUser: false,
          hasPendingInvitation: false
        };
      }
    },
    enabled: enabled && !!email && email.includes('@'),
    staleTime: 30000, // 30 segundos
    retry: (failureCount, error) => {
      console.log('Retry attempt:', failureCount, error);
      // Solo reintentar una vez para errores de red, no para errores de RLS
      return failureCount < 1 && !error?.message?.includes('row-level security');
    }
  });
};
