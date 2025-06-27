
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { BuzoRestrictedView } from '@/components/dashboard/BuzoRestrictedView';
import { CustomizableDashboard } from '@/components/dashboard/CustomizableDashboard';
import { MainLayout } from '@/components/layout/MainLayout';
import { LayoutGrid } from 'lucide-react';

export default function Index() {
  const { profile } = useAuth();

  // Si el usuario es buzo, mostrar vista restringida
  if (profile?.role === 'buzo') {
    return <BuzoRestrictedView />;
  }

  // Para otros roles, mostrar dashboard personalizable
  return (
    <MainLayout
      title="Dashboard"
      subtitle="Panel de control principal"
      icon={LayoutGrid}
    >
      <CustomizableDashboard />
    </MainLayout>
  );
}
