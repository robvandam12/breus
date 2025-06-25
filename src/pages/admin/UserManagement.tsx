
import { MainLayout } from "@/components/layout/MainLayout";
import { EmptyState } from "@/components/layout/EmptyState";
import { Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { RoleBasedUserManagement } from "@/components/users/RoleBasedUserManagement";

export default function UserManagement() {
  const { profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determinar si estamos en la ruta de admin (solo superuser) o empresas (otros roles)
  const isAdminRoute = location.pathname === '/admin/users';
  const isEmpresasRoute = location.pathname === '/empresas/usuarios';

  // Redirección automática: si un usuario no-superuser accede a /admin/users, redirigir a /empresas/usuarios
  useEffect(() => {
    if (isAdminRoute && profile?.role && ['admin_salmonera', 'admin_servicio'].includes(profile.role)) {
      console.log('🔄 Redirecting non-superuser from /admin/users to /empresas/usuarios');
      navigate('/empresas/usuarios', { replace: true });
      return;
    }
  }, [isAdminRoute, profile?.role, navigate]);

  // Verificar acceso según la ruta
  let hasAccess = false;
  let title = 'Gestión de Usuarios';
  let subtitle = 'Administración de usuarios del sistema';

  if (isAdminRoute) {
    // Ruta /admin/users - solo superuser
    hasAccess = profile?.role === 'superuser';
    title = 'Gestión Global de Usuarios';
    subtitle = 'Administración completa de usuarios del sistema';
  } else if (isEmpresasRoute) {
    // Ruta /empresas/usuarios - admin_salmonera y admin_servicio
    hasAccess = profile?.role && ['admin_salmonera', 'admin_servicio'].includes(profile.role);
    
    if (profile?.role === 'admin_salmonera') {
      title = 'Personal de la Salmonera';
      subtitle = 'Gestión de usuarios de la salmonera y contratistas asociados';
    } else if (profile?.role === 'admin_servicio') {
      title = 'Personal del Contratista';
      subtitle = 'Gestión de usuarios del contratista';
    }
  }

  if (!hasAccess) {
    return (
      <MainLayout
        title="Gestión de Usuarios"
        subtitle="Administración de usuarios del sistema"
        icon={Shield}
      >
        <EmptyState
          icon={Shield}
          title="Acceso Denegado"
          description="No tienes permisos para acceder a esta sección."
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title={title}
      subtitle={subtitle}
      icon={Shield}
    >
      <RoleBasedUserManagement />
    </MainLayout>
  );
}
