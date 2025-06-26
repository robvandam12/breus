
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
      // Verificar que la invitación sea válida
      const { data: invitation, error: invitationError } = await supabase
        .from('usuario_invitaciones')
        .select('*')
        .eq('token', data.token)
        .eq('estado', 'pendiente')
        .gt('fecha_expiracion', new Date().toISOString())
        .single();

      if (invitationError || !invitation) {
        throw new Error('Invitación no válida o expirada');
      }

      // Crear la cuenta de usuario
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            nombre: data.nombre,
            apellido: data.apellido,
            role: invitation.rol
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Crear el perfil del usuario
        const { error: profileError } = await supabase
          .from('usuario')
          .insert([{
            usuario_id: authData.user.id,
            email: data.email,
            nombre: data.nombre,
            apellido: data.apellido,
            rol: invitation.rol,
            salmonera_id: invitation.tipo_empresa === 'salmonera' ? invitation.empresa_id : null,
            servicio_id: invitation.tipo_empresa === 'contratista' ? invitation.empresa_id : null
          }]);

        if (profileError) throw profileError;

        // Marcar la invitación como aceptada
        await supabase
          .from('usuario_invitaciones')
          .update({ 
            estado: 'aceptada',
            updated_at: new Date().toISOString()
          })
          .eq('token', data.token);
      }

      toast({
        title: "Cuenta creada exitosamente",
        description: "Ya puedes iniciar sesión con tu nueva cuenta",
      });

    } catch (error: any) {
      console.error('Error in invitation registration:', error);
      toast({
        title: "Error",
        description: error.message || "Error al crear la cuenta",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    registerFromInvitation,
    isRegistering,
  };
};
