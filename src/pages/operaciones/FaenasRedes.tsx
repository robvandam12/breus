
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Network } from "lucide-react";
import { NetworkOperationsManager } from "@/components/network/NetworkOperationsManager";

export default function FaenasRedes() {
  return (
    <MainLayout
      title="Faenas de Redes"
      subtitle="Gestión de operaciones y faenas en sistemas de redes marinas"
      icon={Network}
    >
      <NetworkOperationsManager />
    </MainLayout>
  );
}
