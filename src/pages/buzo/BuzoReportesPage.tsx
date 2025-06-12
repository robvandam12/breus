
import { MainLayout } from '@/components/layout/MainLayout';
import { BuzoReports } from '@/components/dashboard/BuzoReports';
import { BarChart3 } from 'lucide-react';

export default function BuzoReportesPage() {
  return (
    <MainLayout
      title="Mis Reportes"
      subtitle="Análisis detallado de tu actividad de buceo"
      icon={BarChart3}
    >
      <BuzoReports />
    </MainLayout>
  );
}
