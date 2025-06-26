
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface RegisterFromInvitationData {
  token: string;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
}

export const useInvitationRegistration = () => {
  const registerFromInvitationMutation = useMutation({
    mutationFn: async (data: RegisterFromInvitationData) => {
      console.log('Registrando desde invitación:', data);
      
      const { data: result, error } = await supabase.functions.invoke('register-from-invitation', {
        body: data
      });

      if (error) {
        console.error('Error en registro desde invitación:', error);
        throw error;
      }

      if (!result?.success) {
        throw new Error(result?.error || 'Error en el registro');
      }

      return result;
    },
    onSuccess: (result) => {
      console.log('Registro exitoso:', result);
      toast({
        title: "¡Cuenta creada exitosamente!",
        description: `Bienvenido a Breus. Tu cuenta ha sido asociada a la empresa.`,
      });
    },
    onError: (error: any) => {
      console.error('Error en registro:', error);
      toast({
        title: "Error en el registro",
        description: error.message || "No se pudo crear la cuenta. Intenta nuevamente.",
        variant: "destructive",
      });
    },
  });

  return {
    registerFromInvitation: registerFromInvitationMutation.mutateAsync,
    isRegistering: registerFromInvitationMutation.isPending,
  };
};
