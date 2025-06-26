
import React from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Anchor } from "lucide-react";
import { InmersionesDataTable } from "@/components/inmersiones/InmersionesDataTable";

const Inmersiones = () => {
  console.log('Inmersiones component rendering');
  
  return (
    <MainLayout
      title="Inmersiones"
      subtitle="Gestión de inmersiones y operaciones de buceo"
      icon={Anchor}
    >
      <div className="p-4">
        <InmersionesDataTable />
      </div>
    </MainLayout>
  );
};

export default Inmersiones;
