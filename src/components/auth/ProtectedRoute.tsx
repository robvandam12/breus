
import { useAuth } from '@/hooks/useAuth';
import { useModularSystem } from '@/hooks/useModularSystem';
import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
  requiredModule?: string;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  requiredPermission,
  requiredModule 
}: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const { hasModuleAccess, isSuperuser } = useModularSystem();
  const location = useLocation();

  console.log('ProtectedRoute - loading:', loading, 'user:', !!user, 'profile:', !!profile);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('ProtectedRoute - No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Allow access if no specific role/permission/module is required
  if (!requiredRole && !requiredPermission && !requiredModule) {
    console.log('ProtectedRoute - No specific requirements, allowing access');
    return <>{children}</>;
  }

  // If we need to check role/module but profile is not loaded yet, wait a bit more
  if ((requiredRole || requiredModule) && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  // Check role-based access
  if (requiredRole && profile && profile.role !== requiredRole && !isSuperuser) {
    console.log('ProtectedRoute - Role mismatch, redirecting to home');
    return <Navigate to="/" replace />;
  }

  // Check module-based access
  if (requiredModule && !isSuperuser && !hasModuleAccess(requiredModule)) {
    console.log('ProtectedRoute - Module access denied:', requiredModule);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Módulo No Disponible
          </h3>
          <p className="text-gray-600 mb-4">
            Tu empresa no tiene acceso al módulo requerido para esta funcionalidad.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Contacta a tu administrador para activar el módulo: <span className="font-mono text-blue-600">{requiredModule}</span>
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // Check permission-based access (future implementation)
  if (requiredPermission && profile) {
    // This would use the hasPermission method from useAuth
    // For now, just allow access
  }

  console.log('ProtectedRoute - Access granted');
  return <>{children}</>;
};
