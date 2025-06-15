
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface AuthRouteWrapperProps {
  children: React.ReactNode;
}

export const AuthRouteWrapper = ({ children }: AuthRouteWrapperProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si ya está autenticado, redirigir al dashboard
    if (!loading && user) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Verificando sesión..." />
      </div>
    );
  }

  // Si está autenticado, no mostrar nada (ya se está redirigiendo)
  if (user) {
    return null;
  }

  return <>{children}</>;
};
