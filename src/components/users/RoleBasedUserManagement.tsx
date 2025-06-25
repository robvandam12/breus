
import { useState } from "react";
import { BaseUserManagement, BaseUser, UserManagementConfig } from "./BaseUserManagement";
import { useRoleBasedUsers } from "@/hooks/useRoleBasedUsers";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building, UserCheck } from "lucide-react";
import { CreateUserForm } from "./CreateUserForm";
import { EditUserForm } from "./EditUserForm";
import { InviteUserForm } from "./InviteUserForm";

export const RoleBasedUserManagement = () => {
  const { profile } = useAuth();
  const { usuarios, isLoading, inviteUser, updateUser, deleteUser } = useRoleBasedUsers();

  // Configuración según el rol
  const getConfig = (): UserManagementConfig => {
    const baseConfig = {
      showCreateButton: false,
      showInviteButton: true,
      showDeleteButton: true,
      showSearch: true,
    };

    switch (profile?.role) {
      case 'superuser':
        return {
          ...baseConfig,
          title: 'Gestión Global de Usuarios',
          showCreateButton: true,
          allowedRoles: ['superuser', 'admin_salmonera', 'admin_servicio', 'supervisor', 'buzo'],
        };
      case 'admin_salmonera':
        return {
          ...baseConfig,
          title: 'Personal de la Salmonera',
          allowedRoles: ['admin_salmonera', 'supervisor', 'buzo'],
        };
      case 'admin_servicio':
        return {
          ...baseConfig,
          title: 'Personal del Contratista',
          allowedRoles: ['admin_servicio', 'supervisor', 'buzo'],
        };
      default:
        return {
          ...baseConfig,
          title: 'Gestión de Usuarios',
        };
    }
  };

  // Estadísticas personalizadas
  const getCustomStats = () => {
    const totalUsers = usuarios.length;
    const salmoneraUsers = usuarios.filter(u => u.empresa_tipo === 'salmonera').length;
    const contratistaUsers = usuarios.filter(u => u.empresa_tipo === 'contratista').length;
    const activeUsers = usuarios.filter(u => u.estado_buzo === 'activo' || u.estado_buzo === 'disponible').length;

    return (
      <>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>

        {profile?.role === 'superuser' && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Salmoneras</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{salmoneraUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contratistas</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contratistaUsers}</div>
              </CardContent>
            </Card>
          </>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
          </CardContent>
        </Card>
      </>
    );
  };

  // Mapear usuarios al formato BaseUser
  const mappedUsers: BaseUser[] = usuarios.map(user => ({
    id: user.usuario_id,
    usuario_id: user.usuario_id,
    email: user.email,
    nombre: user.nombre,
    apellido: user.apellido,
    rol: user.rol,
    estado: user.estado_buzo as 'activo' | 'inactivo' | 'pendiente',
    empresa_nombre: user.empresa_nombre,
    empresa_tipo: user.empresa_tipo,
    created_at: user.created_at,
  }));

  const handleCreateUser = async (userData: any) => {
    // Determinar empresa según el rol del usuario actual
    let empresaData = {};
    
    if (profile?.role === 'admin_salmonera' && profile?.salmonera_id) {
      empresaData = {
        salmonera_id: profile.salmonera_id,
        tipo_empresa: 'salmonera'
      };
    } else if (profile?.role === 'admin_servicio' && profile?.servicio_id) {
      empresaData = {
        servicio_id: profile.servicio_id,
        tipo_empresa: 'contratista'
      };
    }

    await inviteUser({
      ...userData,
      ...empresaData
    });
  };

  const handleUpdateUser = async (id: string, userData: any) => {
    await updateUser({ id, userData });
  };

  const handleDeleteUser = async (id: string) => {
    await deleteUser(id);
  };

  return (
    <BaseUserManagement
      users={mappedUsers}
      isLoading={isLoading}
      config={{
        ...getConfig(),
        customStats: getCustomStats(),
      }}
      onCreateUser={handleCreateUser}
      onUpdateUser={handleUpdateUser}
      onDeleteUser={handleDeleteUser}
      onInviteUser={handleCreateUser}
      CreateUserForm={CreateUserForm}
      EditUserForm={EditUserForm}
      InviteUserForm={InviteUserForm}
    />
  );
};
