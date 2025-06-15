
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface AuthRouteWrapperProps {
  children: React.ReactNode;
}

export const AuthRouteWrapper = ({ children }: AuthRouteWrapperProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Timeout de seguridad
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.warn('AuthRouteWrapper: Loading timeout reached');
      setTimeoutReached(true);
    }, 10000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    console.log('AuthRouteWrapper: Auth state', { 
      loading, 
      hasUser: !!user,
      timeoutReached,
      redirecting
    });

    // Si ya está autenticado y no está redirigiendo, redirigir al dashboard
    if (!loading && user && !redirecting) {
      console.log('AuthRouteWrapper: User authenticated, redirecting to dashboard');
      setRedirecting(true);
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate, timeoutReached, redirecting]);

  // Si ha pasado el timeout y aún está cargando, permitir mostrar el formulario
  if (timeoutReached && loading) {
    console.log('AuthRouteWrapper: Timeout reached, showing auth form');
    return <>{children}</>;
  }

  if (loading && !timeoutReached) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Verificando sesión..." />
      </div>
    );
  }

  // Si está autenticado y redirigiendo, mostrar loading
  if (user && redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Redirigiendo..." />
      </div>
    );
  }

  // Si está autenticado pero no redirigiendo, no mostrar nada
  if (user) {
    return null;
  }

  return <>{children}</>;
};
