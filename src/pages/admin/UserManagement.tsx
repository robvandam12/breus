
import { AdminUserManagement } from "@/components/users/AdminUserManagement";
import { MainLayout } from "@/components/layout/MainLayout";
import { EmptyState } from "@/components/layout/EmptyState";
import { Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function UserManagement() {
  const { profile } = useAuth();

  if (profile?.role !== 'superuser') {
    return (
      <MainLayout
        title="Gestión de Usuarios"
        subtitle="Administración completa de usuarios del sistema"
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
      title="Gestión de Usuarios"
      subtitle="Administración completa de usuarios del sistema"
      icon={Shield}
    >
      <AdminUserManagement />
    </MainLayout>
  );
}
