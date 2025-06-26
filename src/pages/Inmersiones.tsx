
import React, { useState } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Anchor } from "lucide-react";
import { InmersionesDataTable } from "@/components/inmersiones/InmersionesDataTable";
import { InmersionDetailsEnhanced } from "@/components/inmersiones/InmersionDetailsEnhanced";

const Inmersiones = () => {
  const [selectedInmersion, setSelectedInmersion] = useState<any>(null);

  const handleViewDetails = (inmersion: any) => {
    setSelectedInmersion(inmersion);
  };

  const handleBack = () => {
    setSelectedInmersion(null);
  };

  const handleStatusChange = () => {
    // Reload data when status changes
    setSelectedInmersion(null);
  };

  if (selectedInmersion) {
    return (
      <InmersionDetailsEnhanced
        inmersion={selectedInmersion}
        onBack={handleBack}
        onStatusChange={handleStatusChange}
      />
    );
  }

  return (
    <MainLayout
      title="Inmersiones"
      subtitle="Gestión de inmersiones y operaciones de buceo con sistema de notificaciones mejorado"
      icon={Anchor}
    >
      <InmersionesDataTable />
    </MainLayout>
  );
};

export default Inmersiones;
