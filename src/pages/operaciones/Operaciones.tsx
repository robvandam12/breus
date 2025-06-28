
import { MainLayout } from '@/components/layout/MainLayout';
import { Building } from 'lucide-react';
import { OperacionesManager } from '@/components/operaciones/OperacionesManager';

export default function Operaciones() {
  return (
    <MainLayout
      title="Operaciones"
      subtitle="Gestión de operaciones de buceo"
      icon={Building}
    >
      <OperacionesManager />
    </MainLayout>
  );
}
