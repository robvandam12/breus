
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: string;
}

export const ProtectedRoute = ({ 
  children, 
  requiredPermission, 
  requiredRole 
}: ProtectedRouteProps) => {
  const { user, profile, loading, hasPermission, isRole } = useAuth();
  const navigate = useNavigate();
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Timeout de seguridad para evitar pantallas de carga infinitas
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.warn('ProtectedRoute: Loading timeout reached');
      setTimeoutReached(true);
      if (!user && loading) {
        console.log('ProtectedRoute: Forcing redirect to login due to timeout');
        navigate('/login', { replace: true });
      }
    }, 12000); // 12 segundos

    return () => clearTimeout(timeout);
  }, [loading, user, navigate]);

  useEffect(() => {
    console.log('ProtectedRoute: Auth state', { 
      loading, 
      hasUser: !!user, 
      hasProfile: !!profile,
      timeoutReached 
    });

    if (!loading && !user) {
      console.log('ProtectedRoute: No user, redirecting to login');
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate, timeoutReached]);

  // Si ha pasado el timeout y aún está cargando, mostrar error
  if (timeoutReached && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error de Conexión
          </h2>
          <p className="text-gray-600 mb-4">
            No se pudo verificar la autenticación. Por favor, intenta nuevamente.
          </p>
          <button 
            onClick={() => {
              setTimeoutReached(false);
              navigate('/login', { replace: true });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Ir a Login
          </button>
        </div>
      </div>
    );
  }

  if (loading && !timeoutReached) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Verificando autenticación..." />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Check role requirement
  if (requiredRole && !isRole(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Acceso Denegado
          </h2>
          <p className="text-gray-600">
            No tienes permisos para acceder a esta sección.
          </p>
        </div>
      </div>
    );
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Permisos Insuficientes
          </h2>
          <p className="text-gray-600">
            No tienes los permisos necesarios para realizar esta acción.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
