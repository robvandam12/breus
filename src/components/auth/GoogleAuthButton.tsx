
import { Button } from '@/components/ui/button';
import { Chrome } from 'lucide-react';
import { signInWithGoogle } from '@/integrations/supabase/auth';
import { useToast } from '@/hooks/use-toast';

interface GoogleAuthButtonProps {
  loading?: boolean;
  onAuthStart?: () => void;
}

export const GoogleAuthButton = ({ loading, onAuthStart }: GoogleAuthButtonProps) => {
  const { toast } = useToast();

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
