
import { ReactNode } from 'react';
import { useAuthRoles } from '@/hooks/useAuthRoles';

interface RequireSuperuserProps {
  children: ReactNode;
}

const RequireSuperuser = ({ children }: RequireSuperuserProps) => {
  const { currentRole, isLoading } = useAuthRoles();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (currentRole !== 'superuser') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireSuperuser;
