
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Mail, RefreshCw } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { useAuth } from '@/hooks/useAuth';

export const EmailConfirmation = () => {
  const [searchParams] = useSearchParams();
  const [isResending, setIsResending] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const email = searchParams.get('email') || '';

  const handleResendEmail = async () => {
    if (!email) return;
    
    setIsResending(true);
    try {
      // Re-enviar email de confirmación
      await signUp(email, '', {}); // Solo para reenviar
    } catch (error) {
      console.error('Error reenviando email:', error);
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    // Si no hay email en los params, redirigir al registro
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  return (
    <AuthLayout 
      title="Confirma tu Email" 
      subtitle="Te hemos enviado un enlace de confirmación"
    >
      <div className="mt-8 text-center">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-xl">Revisa tu Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Hemos enviado un enlace de confirmación a:
            </p>
            <p className="font-semibold text-blue-600">{email}</p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Pasos a seguir:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Revisa tu bandeja de entrada</li>
                    <li>Haz clic en el enlace de confirmación</li>
                    <li>Serás redirigido automáticamente a la aplicación</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-gray-500 mb-4">
                ¿No recibiste el email?
              </p>
              <Button
                onClick={handleResendEmail}
                disabled={isResending}
                variant="outline"
                className="w-full"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Reenviando...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Reenviar Email
                  </>
                )}
              </Button>
            </div>

            <div className="pt-4 border-t">
              <Button
                onClick={() => navigate('/login')}
                variant="ghost"
                className="w-full"
              >
                Volver al Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
};

export default EmailConfirmation;
