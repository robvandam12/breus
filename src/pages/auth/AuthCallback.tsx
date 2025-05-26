
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Procesando autenticación...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error during auth callback:', error);
          setStatus('error');
          setMessage('Error durante la verificación del email. Por favor intenta nuevamente.');
          setTimeout(() => navigate('/login?error=auth_callback_error'), 3000);
          return;
        }

        if (data.session) {
          setStatus('success');
          setMessage('¡Email verificado exitosamente! Redirigiendo...');
          // Redirect to dashboard after successful authentication
          setTimeout(() => navigate('/'), 2000);
        } else {
          setStatus('error');
          setMessage('No se pudo verificar el email. Por favor intenta nuevamente.');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage('Error inesperado durante la verificación.');
        setTimeout(() => navigate('/login?error=unexpected_error'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          {status === 'loading' && (
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          {status === 'success' && (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          )}
          {status === 'error' && (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          )}
        </div>
        
        <h2 className={`text-xl font-semibold mb-2 ${
          status === 'success' ? 'text-green-800' : 
          status === 'error' ? 'text-red-800' : 'text-gray-800'
        }`}>
          {status === 'loading' && 'Verificando Email'}
          {status === 'success' && '¡Email Verificado!'}
          {status === 'error' && 'Error de Verificación'}
        </h2>
        
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default AuthCallback;
