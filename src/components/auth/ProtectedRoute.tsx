
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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Allow access even if profile is not loaded yet - avoid infinite loading
  // Profile will be loaded asynchronously
  
  // Check role-based access only if profile is loaded and role is required
  if (requiredRole && profile && profile.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Check permission-based access (future implementation)
  if (requiredPermission && profile) {
    // This would use the hasPermission method from useAuth
    // For now, just allow access
  }

  return <>{children}</>;
};
