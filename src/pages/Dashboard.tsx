
import React from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Home } from "lucide-react";
import { IndependentImmersionManager } from "@/components/inmersiones/IndependentImmersionManager";

const Dashboard = () => {
  return (
    <MainLayout
      title="Dashboard"
      subtitle="Panel principal de administración"
      icon={Home}
    >
      <IndependentImmersionManager />
    </MainLayout>
  );
};

export default Dashboard;
