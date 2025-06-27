
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface InvitationRegistrationData {
  token: string;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
}

export const useInvitationRegistration = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const registerFromInvitation = async (data: InvitationRegistrationData) => {
    setIsRegistering(true);
    
    try {
      const { data: result, error } = await supabase.functions.invoke('register-from-invitation', {
        body: data
      });

      if (error) throw error;

      if (result.success) {
        toast({
          title: "Registro exitoso",
          description: "Tu cuenta ha sido creada correctamente. Puedes iniciar sesión ahora.",
        });
        return result;
      } else {
        throw new Error(result.error || 'Error en el registro');
      }
    } catch (error: any) {
      console.error('Error in registerFromInvitation:', error);
      toast({
        title: "Error en el registro",
        description: error.message || "No se pudo completar el registro",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    registerFromInvitation,
    isRegistering
  };
};
