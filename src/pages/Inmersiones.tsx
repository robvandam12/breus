
import React from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Anchor } from "lucide-react";
import { InmersionesManager } from "@/components/inmersiones/InmersionesManager";

const Inmersiones = () => {
  return (
    <MainLayout
      title="Inmersiones"
      subtitle="Gestión de inmersiones y operaciones de buceo"
      icon={Anchor}
    >
      <InmersionesManager />
    </MainLayout>
  );
};

export default Inmersiones;
