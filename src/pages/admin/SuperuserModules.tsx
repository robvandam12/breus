
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Settings } from "lucide-react";
import { SuperuserModuleManager } from "@/components/admin/SuperuserModuleManager";

export default function SuperuserModules() {
  return (
    <MainLayout
      title="Gestión Avanzada de Módulos"
      subtitle="Panel de administración completo para superusuarios"
      icon={Settings}
    >
      <SuperuserModuleManager />
    </MainLayout>
  );
}
