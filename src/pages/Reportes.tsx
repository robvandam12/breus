
import { MainLayout } from '@/components/layout/MainLayout';
import { BuzoReports } from '@/components/dashboard/BuzoReports';
import { BarChart3 } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';

export default function Reportes() {
  const { profile } = useAuth();

  return (
    <MainLayout
      title="Reportes y Estadísticas"
      subtitle={profile?.role === 'buzo' ? "Análisis de tu actividad como buzo profesional" : "Análisis de actividad del sistema"}
      icon={BarChart3}
    >
      {profile?.role === 'buzo' ? (
        <BuzoReports />
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Reportes para otros roles en desarrollo</p>
        </div>
      )}
    </MainLayout>
  );
}
