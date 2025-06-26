
import React from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { CustomizableDashboard } from "@/components/dashboard/CustomizableDashboard";
import { BarChart3 } from "lucide-react";

const Dashboard = () => {
  return (
    <MainLayout
      title="Dashboard"
      subtitle="Panel de control principal"
      icon={BarChart3}
    >
      <CustomizableDashboard />
    </MainLayout>
  );
};

export default Dashboard;
