
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const SimpleProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, session, loading } = useAuth();

  console.log('SimpleProtectedRoute - loading:', loading, 'user:', !!user, 'session:', !!session);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Check both user and session for better reliability
  if (!user || !session) {
    console.log('SimpleProtectedRoute - No user or session, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
