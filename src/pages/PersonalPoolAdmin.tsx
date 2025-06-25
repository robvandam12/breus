
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
        title="Company Personnel"
        subtitle="Manage your company's personnel"
        icon={Users}
      >
        <EmptyState
          icon={Users}
          title="Access Not Available"
          description="You don't have an associated company to manage personnel."
        />
      </MainLayout>
    );
  }

  if (profile.role !== 'admin_salmonera' && profile.role !== 'admin_servicio' && profile.role !== 'superuser') {
    return (
      <MainLayout
        title="Company Personnel"
        subtitle="Manage your company's personnel"
        icon={Users}
      >
        <EmptyState
          icon={Users}
          title="Access Denied"
          description="You don't have permissions to manage company personnel."
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

  const empresaNombre = empresaType === 'salmonera' ? 'salmon farm' : 'service company';

  return (
    <MainLayout
      title="Company Personnel"
      subtitle={`Manage ${empresaNombre} personnel`}
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
              Company Personnel ({usuarios.length})
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
