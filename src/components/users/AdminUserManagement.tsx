
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BaseUserManagement, BaseUser, UserManagementConfig } from "./BaseUserManagement";
import { UserInviteForm } from "./forms/UserInviteForm";
import { EditUserForm } from "./forms/EditUserForm";
import { InvitationManagement } from "@/components/invitations/InvitationManagement";
import { useUsuarios } from "@/hooks/useUsuarios";
import { Shield, Mail, CheckCircle, Clock } from "lucide-react";

export const AdminUserManagement = () => {
  const { usuarios, isLoading, updateUsuario, inviteUsuario, deleteUsuario } = useUsuarios();
  const [activeTab, setActiveTab] = useState("users");

  // Transform usuarios to BaseUser format
  const transformedUsers: BaseUser[] = usuarios.map(user => {
    // Handle salmonera and contratista data safely
    const salmoneraData = user.salmonera;
    const contratistaData = Array.isArray(user.contratista) && user.contratista.length > 0 
      ? user.contratista[0] 
      : null;
    
    // Determinar estado basado en perfil_completado y confirmación de email
    let estado: 'activo' | 'pendiente' = 'pendiente';
    
    if (user.perfil_completado) {
      estado = 'activo';
    }
    
    return {
      id: user.usuario_id,
      usuario_id: user.usuario_id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      rol: user.rol,
      estado: estado,
      empresa_nombre: salmoneraData?.nombre || contratistaData?.nombre || 'Sin asignar',
      empresa_tipo: user.salmonera_id ? 'salmonera' : 'contratista',
      created_at: user.created_at,
    };
  });

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
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Usuarios Activos</p>
                <p className="text-2xl font-bold">
                  {usuarios.filter(u => u.perfil_completado).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Usuarios Pendientes</p>
                <p className="text-2xl font-bold">
                  {usuarios.filter(u => !u.perfil_completado).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </>
    )
  };

  const handleUpdateUser = async (id: string, userData: any) => {
    await updateUsuario(id, userData);
  };

  const handleInviteUser = async (userData: any) => {
    await inviteUsuario(userData);
  };

  const handleDeleteUser = async (id: string) => {
    await deleteUsuario(id);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="users" className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Usuarios Registrados
        </TabsTrigger>
        <TabsTrigger value="invitations" className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Invitaciones
        </TabsTrigger>
      </TabsList>

      <TabsContent value="users">
        <BaseUserManagement
          users={transformedUsers}
          isLoading={isLoading}
          config={config}
          onUpdateUser={handleUpdateUser}
          onDeleteUser={handleDeleteUser}
          onInviteUser={handleInviteUser}
          EditUserForm={EditUserForm}
          InviteUserForm={UserInviteForm}
        />
      </TabsContent>

      <TabsContent value="invitations">
        <InvitationManagement />
      </TabsContent>
    </Tabs>
  );
};
