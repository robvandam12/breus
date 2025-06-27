
import { MainLayout } from '@/components/layout/MainLayout';
import { Building } from 'lucide-react';

export default function Empresas() {
  return (
    <MainLayout
      title="Empresas"
      subtitle="Gestión de empresas del sistema"
      icon={Building}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold">Gestión de Empresas</h1>
        <p className="text-gray-600 mt-2">Administra salmoneras y contratistas.</p>
      </div>
    </MainLayout>
  );
}
