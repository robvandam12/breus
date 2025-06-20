
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Settings } from "lucide-react";
import { NetworkMaintenanceManager } from "@/components/network/NetworkMaintenanceManager";

export default function MantencionRedes() {
  return (
    <MainLayout
      title="Mantención de Redes"
      subtitle="Gestión de mantenimiento preventivo y correctivo de sistemas de redes"
      icon={Settings}
    >
      <NetworkMaintenanceManager />
    </MainLayout>
  );
}
