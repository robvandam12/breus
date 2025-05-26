
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error during auth callback:', error);
          toast({
            title: "Error de autenticación",
            description: "Hubo un problema al verificar tu email",
            variant: "destructive",
          });
          navigate('/login?error=auth_callback_error');
          return;
        }

        if (data.session) {
          toast({
            title: "Email confirmado",
            description: "Tu cuenta ha sido activada exitosamente",
          });
          // Redirect to dashboard after successful authentication
          navigate('/');
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast({
          title: "Error",
          description: "Error inesperado durante la verificación",
          variant: "destructive",
        });
        navigate('/login?error=unexpected_error');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Confirmando tu email...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
