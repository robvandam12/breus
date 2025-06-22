
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Activity } from "lucide-react";
import { SystemMonitoringDashboard } from "@/components/admin/SystemMonitoringDashboard";

export default function SystemMonitoring() {
  return (
    <MainLayout
      title="Monitoreo del Sistema"
      subtitle="Supervisión en tiempo real, alertas y métricas de rendimiento"
      icon={Activity}
    >
      <SystemMonitoringDashboard />
    </MainLayout>
  );
}
