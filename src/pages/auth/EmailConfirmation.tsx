
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AuthLayout } from './AuthLayout';

export const EmailConfirmation = () => {
  const [isResending, setIsResending] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') || '';

  const handleResendEmail = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "No se encontró la dirección de email",
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      toast({
        title: "Email reenviado",
        description: "Se ha enviado un nuevo email de confirmación",
      });
    } catch (error: any) {
      console.error('Error resending email:', error);
      toast({
        title: "Error",
        description: error.message || "Error al reenviar el email",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout 
      title="Confirma tu email" 
      subtitle="Te hemos enviado un enlace de confirmación"
    >
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-xl">Revisa tu email</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-gray-600">
              Hemos enviado un enlace de confirmación a:
            </p>
            <p className="font-medium text-gray-900">{email}</p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-500 text-center">
              Haz clic en el enlace del email para activar tu cuenta. 
              Si no ves el email, revisa tu carpeta de spam.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleResendEmail}
              disabled={isResending}
              variant="outline"
              className="w-full"
            >
              {isResending ? (
                <>
                  <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                  Reenviando...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Reenviar email
                </>
              )}
            </Button>

            <Button 
              onClick={() => navigate('/login')}
              variant="ghost"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al login
            </Button>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default EmailConfirmation;
