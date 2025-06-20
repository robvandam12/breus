
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Settings } from "lucide-react";
import { ModuleManagementDashboard } from "@/components/admin/ModuleManagementDashboard";

export default function ModuleManagement() {
  return (
    <MainLayout
      title="Gestión de Módulos"
      subtitle="Panel de administración y configuración de módulos del sistema"
      icon={Settings}
    >
      <ModuleManagementDashboard />
    </MainLayout>
  );
}
