
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  requiredPermission 
}: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
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

  // Allow access if no specific role/permission is required
  if (!requiredRole && !requiredPermission) {
    console.log('ProtectedRoute - No specific requirements, allowing access');
    return <>{children}</>;
  }

  // If we need to check role but profile is not loaded yet, wait a bit more
  if (requiredRole && !profile) {
    // Give it a few seconds to load profile, otherwise allow access
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
  if (requiredRole && profile && profile.role !== requiredRole) {
    console.log('ProtectedRoute - Role mismatch, redirecting to home');
    return <Navigate to="/" replace />;
  }

  // Check permission-based access (future implementation)
  if (requiredPermission && profile) {
    // This would use the hasPermission method from useAuth
    // For now, just allow access
  }

  console.log('ProtectedRoute - Access granted');
  return <>{children}</>;
};
