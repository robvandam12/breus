
import { MainLayout } from '@/components/layout/MainLayout';
import { BuzoReports } from '@/components/dashboard/BuzoReports';
import { BarChart3 } from 'lucide-react';

export default function BuzoReportesPage() {
  return (
    <MainLayout
      title="Reportes"
      subtitle="Análisis de tu actividad como buzo profesional"
      icon={BarChart3}
    >
      <BuzoReports />
    </MainLayout>
  );
}
