
import React from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { MapPin } from "lucide-react";
import { CentrosDataTable } from "@/components/empresas/CentrosDataTable";

const Centros = () => {
  return (
    <MainLayout
      title="Centros"
      subtitle="Gestión de centros de acuicultura"
      icon={MapPin}
    >
      <CentrosDataTable />
    </MainLayout>
  );
};

export default Centros;
