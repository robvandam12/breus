
import { BarChart3 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { BuzoReports } from '@/components/dashboard/BuzoReports';

export default function BuzoReportesPage() {
  return (
    <MainLayout 
      title="Reportes" 
      subtitle="Análisis de actividad y desempeño como buzo"
      icon={BarChart3}
    >
      <BuzoReports />
    </MainLayout>
  );
}
