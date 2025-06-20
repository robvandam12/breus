
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Zap } from "lucide-react";
import { IntegrationsManager } from "@/components/integrations/IntegrationsManager";

export default function Integraciones() {
  return (
    <MainLayout
      title="Integraciones"
      subtitle="Gestión de APIs externas y sincronización de datos"
      icon={Zap}
    >
      <IntegrationsManager />
    </MainLayout>
  );
}
