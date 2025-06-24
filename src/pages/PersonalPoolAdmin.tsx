
import React from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { PersonalPoolTable } from "@/components/users/PersonalPoolTable";
import { PersonalPoolStats } from "@/components/users/PersonalPoolStats";
import { useAuth } from "@/hooks/useAuth";
import { useUsersByCompany } from "@/hooks/useUsersByCompany";
import { EmptyState } from "@/components/layout/EmptyState";

const PersonalPoolAdmin = () => {
  const { profile } = useAuth();
  const { usuarios, isLoading, createUser, inviteUser } = useUsersByCompany();

  // Determinar tipo y ID de empresa basado en el perfil del usuario
  const empresaType = profile?.salmonera_id ? 'salmonera' : 'contratista';
  const empresaId = profile?.salmonera_id || profile?.servicio_id || '';

  // Verificar permisos de acceso
  if (!profile?.salmonera_id && !profile?.servicio_id) {
    return (
      <MainLayout
        title="Personal de la Empresa"
        subtitle="Gestión del personal de su empresa"
        icon={Users}
      >
        <EmptyState
          icon={Users}
          title="Acceso No Disponible"
          description="No tienes una empresa asociada para gestionar personal."
        />
      </MainLayout>
    );
  }

  if (profile.role !== 'admin_salmonera' && profile.role !== 'admin_servicio' && profile.role !== 'superuser') {
    return (
      <MainLayout
        title="Personal de la Empresa"
        subtitle="Gestión del personal de su empresa"
        icon={Users}
      >
        <EmptyState
          icon={Users}
          title="Acceso Denegado"
          description="No tienes permisos para gestionar el personal de la empresa."
        />
      </MainLayout>
    );
  }

  const handleCreateUser = async (userData: any) => {
    if (userData.usuario_id) {
      // Usuario existente - agregar a la empresa
      await createUser({
        ...userData,
        empresa_id: empresaId,
        tipo_empresa: empresaType
      });
    } else {
      // Invitar nuevo usuario
      await inviteUser({
        ...userData,
        empresa_id: empresaId,
        tipo_empresa: empresaType
      });
    }
  };

  const handleUpdateUser = async (id: string, userData: any) => {
    console.log('Update user:', id, userData);
  };

  const handleDeleteUser = async (id: string) => {
    console.log('Delete user:', id);
  };

  const empresaNombre = empresaType === 'salmonera' ? 'la salmonera' : 'la empresa de servicio';

  return (
    <MainLayout
      title="Personal de la Empresa"
      subtitle={`Gestión del personal de ${empresaNombre}`}
      icon={Users}
    >
      <div className="space-y-6">
        {/* Estadísticas */}
        <PersonalPoolStats usuarios={usuarios} empresaType={empresaType} />

        {/* Tabla principal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Personal de la Empresa ({usuarios.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PersonalPoolTable
              usuarios={usuarios}
              isLoading={isLoading}
              onCreateUser={handleCreateUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              empresaType={empresaType}
              empresaId={empresaId}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PersonalPoolAdmin;
