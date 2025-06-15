
import React from "react";
import { BaseUserManagement, BaseUser, UserManagementConfig } from "./BaseUserManagement";
import { UserSearchSelect } from "@/components/usuarios/UserSearchSelect";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface CompanyUserManagementProps {
  empresaType: 'salmonera' | 'servicio';
  empresaId: string;
  users: any[];
  onCreateUser: (userData: any) => Promise<void>;
  onUpdateUser: (id: string, userData: any) => Promise<void>;
  onDeleteUser: (id: string) => Promise<void>;
}

export const CompanyUserManagement = ({
  empresaType,
  empresaId,
  users,
  onCreateUser,
  onUpdateUser,
  onDeleteUser
}: CompanyUserManagementProps) => {
  
  // Transform users to BaseUser format
  const transformedUsers: BaseUser[] = users.map(user => ({
    id: user.id || user.usuario_id,
    usuario_id: user.usuario_id,
    email: user.email,
    nombre: user.nombre,
    apellido: user.apellido,
    rol: user.rol,
    estado: user.estado || 'activo',
    empresa_nombre: 'Esta empresa',
    empresa_tipo: empresaType === 'servicio' ? 'contratista' : 'salmonera',
    created_at: user.created_at,
  }));

  const allowedRoles = empresaType === 'salmonera' 
    ? ['admin_salmonera', 'supervisor', 'buzo']
    : ['admin_servicio', 'supervisor', 'buzo'];

  const config: UserManagementConfig = {
    title: "Personal de la Empresa",
    showSearch: true,
    customActions: (user: BaseUser) => (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onDeleteUser(user.id)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    )
  };

  // Custom invite form that uses UserSearchSelect
  const CustomInviteForm = ({ onSubmit, onCancel }: any) => {
    const handleSelectUser = async (user: any) => {
      await onSubmit({
        usuario_id: user.usuario_id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: user.rol,
        empresa_id: empresaId,
        tipo_empresa: empresaType === 'servicio' ? 'contratista' : 'salmonera'
      });
    };

    const handleInviteUser = async (data: {
      email: string;
      nombre: string;
      apellido: string;
      rol: string;
    }) => {
      await onSubmit({
        ...data,
        empresa_id: empresaId,
        tipo_empresa: empresaType === 'servicio' ? 'contratista' : 'salmonera'
      });
    };

    return (
      <UserSearchSelect
        onSelectUser={handleSelectUser}
        onInviteUser={handleInviteUser}
        allowedRoles={allowedRoles}
        empresaType={empresaType === 'servicio' ? 'contratista' : 'salmonera'}
        empresaId={empresaId}
        placeholder="Buscar usuario existente o invitar nuevo..."
      />
    );
  };

  return (
    <BaseUserManagement
      users={transformedUsers}
      isLoading={false}
      config={config}
      onCreateUser={onCreateUser}
      onUpdateUser={onUpdateUser}
      onDeleteUser={onDeleteUser}
      InviteUserForm={CustomInviteForm}
    />
  );
};
