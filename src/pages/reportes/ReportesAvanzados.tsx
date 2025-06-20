
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { BarChart3 } from "lucide-react";
import { AdvancedReportsManager } from "@/components/reports/AdvancedReportsManager";

export default function ReportesAvanzados() {
  return (
    <MainLayout
      title="Reportes Avanzados"
      subtitle="Sistema de generación y análisis de reportes especializados"
      icon={BarChart3}
    >
      <AdvancedReportsManager />
    </MainLayout>
  );
}
