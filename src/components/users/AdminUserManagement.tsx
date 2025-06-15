
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BaseUserManagement, BaseUser, UserManagementConfig } from "./BaseUserManagement";
import { UserInviteForm } from "./forms/UserInviteForm";
import { useUsuarios } from "@/hooks/useUsuarios";
import { Shield } from "lucide-react";

export const AdminUserManagement = () => {
  const { usuarios, isLoading, updateUsuario, inviteUsuario } = useUsuarios();

  // Transform usuarios to BaseUser format
  const transformedUsers: BaseUser[] = usuarios.map(user => ({
    id: user.usuario_id,
    usuario_id: user.usuario_id,
    email: user.email,
    nombre: user.nombre,
    apellido: user.apellido,
    rol: user.rol,
    estado: user.perfil_completado ? 'activo' : 'pendiente',
    empresa_nombre: user.salmonera?.nombre || user.servicio?.nombre || 'Sin asignar',
    empresa_tipo: user.salmonera_id ? 'salmonera' : 'contratista',
    created_at: user.created_at,
  }));

  const config: UserManagementConfig = {
    title: "Gestión de Usuarios",
    showInviteButton: true,
    showDeleteButton: false,
    showSearch: true,
    customStats: (
      <>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Superusers</p>
                <p className="text-2xl font-bold">
                  {usuarios.filter(u => u.rol === 'superuser').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Admins Salmonera</p>
                <p className="text-2xl font-bold">
                  {usuarios.filter(u => u.rol === 'admin_salmonera').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Supervisores</p>
                <p className="text-2xl font-bold">
                  {usuarios.filter(u => u.rol === 'supervisor').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-600" />
              <div>
                <p className="text-sm text-gray-600">Buzos</p>
                <p className="text-2xl font-bold">
                  {usuarios.filter(u => u.rol === 'buzo').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </>
    )
  };

  const handleUpdateUser = async (id: string, userData: any) => {
    updateUsuario({ id, ...userData });
  };

  const handleInviteUser = async (userData: any) => {
    inviteUsuario(userData);
  };

  return (
    <BaseUserManagement
      users={transformedUsers}
      isLoading={isLoading}
      config={config}
      onUpdateUser={handleUpdateUser}
      onInviteUser={handleInviteUser}
      InviteUserForm={UserInviteForm}
    />
  );
};
