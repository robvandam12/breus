
import React from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, AlertCircle } from "lucide-react";
import { PersonalPoolTable } from "@/components/users/PersonalPoolTable";
import { PersonalPoolStats } from "@/components/users/PersonalPoolStats";
import { useAuth } from "@/hooks/useAuth";
import { useUsersByCompany } from "@/hooks/useUsersByCompany";
import { EmptyState } from "@/components/layout/EmptyState";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PersonalPoolAdmin = () => {
  const { profile } = useAuth();
  const { usuarios, isLoading, error, createUser, inviteUser } = useUsersByCompany();

  console.log('🏢 PersonalPoolAdmin - Profile data:', {
    role: profile?.role,
    salmonera_id: profile?.salmonera_id,
    servicio_id: profile?.servicio_id,
    hasProfile: !!profile
  });

  // Helper function to extract valid ID
  const extractValidId = (id: any): string | null => {
    if (!id) return null;
    if (typeof id === 'object' && id.value !== undefined) {
      const value = id.value;
      if (value === 'undefined' || value === 'null' || !value) return null;
      return value;
    }
    if (typeof id === 'string') {
      if (id === 'undefined' || id === 'null' || id === '') return null;
      return id;
    }
    return null;
  };

  // Determinar tipo y ID de empresa basado en el perfil del usuario
  const salmoneraId = extractValidId(profile?.salmonera_id);
  const servicioId = extractValidId(profile?.servicio_id);
  
  const empresaType = salmoneraId ? 'salmonera' : 'contratista';
  const empresaId = salmoneraId || servicioId || '';

  console.log('🎯 Determined company info:', {
    empresaType,
    empresaId,
    salmoneraId,
    servicioId
  });

  // Verificar permisos de acceso
  if (!salmoneraId && !servicioId) {
    return (
      <MainLayout
        title="Company Personnel"
        subtitle="Manage your company's personnel"
        icon={Users}
      >
        <EmptyState
          icon={Users}
          title="No Company Association"
          description="You don't have an associated company to manage personnel. Please contact your administrator."
        />
      </MainLayout>
    );
  }

  if (profile?.role !== 'admin_salmonera' && profile?.role !== 'admin_servicio' && profile?.role !== 'superuser') {
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
    console.log('📝 Creating user with data:', userData);
    
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
  };

  const handleDeleteUser = async (id: string) => {
    console.log('🗑️ Delete user:', id);
  };

  const empresaNombre = empresaType === 'salmonera' ? 'salmon farm' : 'service company';

  return (
    <MainLayout
      title="Company Personnel"
      subtitle={`Manage ${empresaNombre} personnel`}
      icon={Users}
    >
      <div className="space-y-6">
        {/* Show error if there's an issue loading data */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading personnel data: {error.message || 'Unknown error'}. 
              Please refresh the page or contact support if the problem persists.
            </AlertDescription>
          </Alert>
        )}

        {/* Debug info (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <Alert>
            <AlertDescription>
              <strong>Debug Info:</strong> Company Type: {empresaType}, Company ID: {empresaId}, 
              Users Found: {usuarios.length}, Loading: {isLoading ? 'Yes' : 'No'}
            </AlertDescription>
          </Alert>
        )}

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
