
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
  console.log('🎯 PersonalPoolAdmin component starting to render');
  
  const { profile } = useAuth();
  console.log('🔍 PersonalPoolAdmin - Profile state:', { 
    profile: profile ? {
      id: profile.usuario_id,
      role: profile.rol,
      salmonera_id: profile.salmonera_id,
      servicio_id: profile.servicio_id,
      nombre: profile.nombre,
      apellido: profile.apellido
    } : null
  });

  // Determinar tipo y ID de empresa basado en el perfil del usuario
  const empresaType = profile?.salmonera_id ? 'salmonera' : 'contratista';
  const empresaId = profile?.salmonera_id || profile?.servicio_id || '';

  console.log('🏢 Company info determined:', { empresaType, empresaId });

  const { usuarios, isLoading, createUser, inviteUser, error } = useUsersByCompany();

  console.log('📊 PersonalPoolAdmin - Hook results:', { 
    usuariosCount: usuarios?.length || 0, 
    isLoading, 
    error: error?.message,
    hasProfile: !!profile
  });

  // Verificar permisos de acceso
  if (!profile) {
    console.log('⏳ Profile not loaded yet, showing loading...');
    return (
      <MainLayout
        title="Company Personnel"
        subtitle="Loading..."
        icon={Users}
      >
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading profile...</div>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  if (!profile.salmonera_id && !profile.servicio_id && profile.rol !== 'superuser') {
    console.warn('⚠️ Access denied - no associated company:', {
      salmonera_id: profile.salmonera_id,
      servicio_id: profile.servicio_id,
      role: profile.rol
    });
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

  if (profile.rol !== 'admin_salmonera' && profile.rol !== 'admin_servicio' && profile.rol !== 'superuser') {
    console.warn('⚠️ Access denied - insufficient permissions:', {
      role: profile.rol,
      requiredRoles: ['admin_salmonera', 'admin_servicio', 'superuser']
    });
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

  // Mostrar error si hay problemas con la carga de datos
  if (error) {
    console.error('❌ Error loading company personnel:', error);
    return (
      <MainLayout
        title="Company Personnel"
        subtitle="Manage your company's personnel"
        icon={Users}
      >
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-red-600 mb-2">Error loading personnel data</div>
              <div className="text-sm text-gray-600">{error.message}</div>
              <div className="text-xs text-gray-400 mt-2">
                Check console for detailed error information
              </div>
            </div>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  console.log('✅ PersonalPoolAdmin - All checks passed, rendering main content');

  const handleCreateUser = async (userData: any) => {
    console.log('👤 Creating user with data:', userData);
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
    console.log('✏️ Update user:', id, userData);
    // TODO: Implementar actualización de usuario
  };

  const handleDeleteUser = async (id: string) => {
    console.log('🗑️ Delete user:', id);
    // TODO: Implementar eliminación de usuario
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
        <PersonalPoolStats usuarios={usuarios || []} empresaType={empresaType} />

        {/* Tabla principal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Company Personnel ({usuarios?.length || 0})
              {isLoading && (
                <span className="text-sm text-gray-500 ml-2">Loading...</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PersonalPoolTable
              usuarios={usuarios || []}
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
