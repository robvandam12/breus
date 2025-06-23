
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Network } from "lucide-react";
import { NetworkMaintenanceManager } from "@/components/network/NetworkMaintenanceManager";

export default function NetworkMaintenance() {
  return (
    <MainLayout
      title="Mantención de Redes"
      subtitle="Gestión completa de formularios operativos para mantención y faenas en sistemas de redes marinas"
      icon={Network}
    >
      <NetworkMaintenanceManager />
    </MainLayout>
  );
}
