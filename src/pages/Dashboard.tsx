
import { MainLayout } from '@/components/layout/MainLayout';
import { Home } from 'lucide-react';

export default function Dashboard() {
  return (
    <MainLayout
      title="Dashboard"
      subtitle="Resumen general de actividades"
      icon={Home}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold">Bienvenido al Dashboard</h1>
        <p className="text-gray-600 mt-2">Panel principal del sistema.</p>
      </div>
    </MainLayout>
  );
}
