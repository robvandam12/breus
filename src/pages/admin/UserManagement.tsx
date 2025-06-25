
import { MainLayout } from "@/components/layout/MainLayout";
import { EmptyState } from "@/components/layout/EmptyState";
import { Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { RoleBasedUserManagement } from "@/components/users/RoleBasedUserManagement";

export default function UserManagement() {
  const { profile } = useAuth();

  // Permitir acceso a superuser, admin_salmonera y admin_servicio
  const hasAccess = profile?.role && ['superuser', 'admin_salmonera', 'admin_servicio'].includes(profile.role);

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

  // Determinar título y subtítulo según el rol
  const getTitle = () => {
    switch (profile?.role) {
      case 'superuser':
        return 'Gestión Global de Usuarios';
      case 'admin_salmonera':
        return 'Personal de la Salmonera';
      case 'admin_servicio':
        return 'Personal del Contratista';
      default:
        return 'Gestión de Usuarios';
    }
  };

  const getSubtitle = () => {
    switch (profile?.role) {
      case 'superuser':
        return 'Administración completa de usuarios del sistema';
      case 'admin_salmonera':
        return 'Gestión de usuarios de la salmonera y contratistas asociados';
      case 'admin_servicio':
        return 'Gestión de usuarios del contratista';
      default:
        return 'Administración de usuarios del sistema';
    }
  };

  return (
    <MainLayout
      title={getTitle()}
      subtitle={getSubtitle()}
      icon={Shield}
    >
      <RoleBasedUserManagement />
    </MainLayout>
  );
}
