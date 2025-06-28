
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Settings } from "lucide-react";
import { SuperuserModuleManager } from "@/components/admin/SuperuserModuleManager";
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function ModuleManagement() {
  const { profile } = useAuth();

  // Verificar permisos de superuser
  if (profile?.role !== 'superuser') {
    return (
      <MainLayout
        title="Acceso Denegado"
        subtitle="No tienes permisos para acceder a esta sección"
        icon={Shield}
      >
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Acceso Restringido
              </h3>
              <p className="text-gray-600">
                Solo los superusuarios pueden acceder al panel de gestión de módulos.
              </p>
            </div>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Gestión de Módulos"
      subtitle="Panel de administración y configuración de módulos del sistema"
      icon={Settings}
    >
      <SuperuserModuleManager />
    </MainLayout>
  );
}
