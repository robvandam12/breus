
import React, { useState } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { FullAnexoBravoForm } from "@/components/anexo-bravo/FullAnexoBravoForm";
import { AnexoBravoDataTable } from "@/components/anexo-bravo/AnexoBravoDataTable";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

export default function AnexoBravo() {
  const [showWizard, setShowWizard] = useState(false);

  const handleSubmit = async (data: any) => {
    console.log('Anexo Bravo submitted:', data);
    setShowWizard(false);
  };

  const handleCancel = () => {
    console.log('Anexo Bravo cancelled');
    setShowWizard(false);
  };

  if (showWizard) {
    return (
      <MainLayout
        title="Crear Anexo Bravo"
        subtitle="Formulario de Anexo Bravo para operaciones de buceo"
        icon={FileText}
        className="bg-white"
        contentClassName="bg-white"
      >
        <FullAnexoBravoForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Anexo Bravo"
      subtitle="Gestión de documentos Anexo Bravo para operaciones de buceo"
      icon={FileText}
      className="bg-white"
      contentClassName="bg-white"
      headerActions={
        <Button onClick={() => setShowWizard(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Crear Anexo Bravo
        </Button>
      }
    >
      <AnexoBravoDataTable />
    </MainLayout>
  );
}
