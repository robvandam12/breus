
import { Button } from '@/components/ui/button';
import { Chrome } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GoogleAuthButtonProps {
  loading?: boolean;
  onAuthStart?: () => void;
}

export const GoogleAuthButton = ({ loading, onAuthStart }: GoogleAuthButtonProps) => {
  const { toast } = useToast();

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      onAuthStart?.();
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign in error:', error);
      toast({
        title: "Error de autenticación",
        description: "No se pudo iniciar sesión con Google. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full flex items-center gap-3 h-12"
      onClick={handleGoogleSignIn}
      disabled={loading}
    >
      <Chrome className="w-5 h-5" />
      {loading ? 'Conectando...' : 'Continuar con Google'}
    </Button>
  );
};
