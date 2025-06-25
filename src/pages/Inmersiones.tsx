
import React from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Anchor } from "lucide-react";
import { InmersionesDataTable } from "@/components/inmersiones/InmersionesDataTable";

const Inmersiones = () => {
  return (
    <MainLayout
      title="Inmersiones"
      subtitle="Gestión de inmersiones y operaciones de buceo"
      icon={Anchor}
    >
      <InmersionesDataTable />
    </MainLayout>
  );
};

export default Inmersiones;
