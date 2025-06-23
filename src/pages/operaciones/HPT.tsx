
import React, { useState } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { HPTWizardComplete } from "@/components/hpt/HPTWizardComplete";
import { HPTDataTable } from "@/components/hpt/HPTDataTable";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

export default function HPT() {
  const [showWizard, setShowWizard] = useState(false);

  if (showWizard) {
    return (
      <MainLayout
        title="Crear HPT - Hoja de Planificación de Trabajo"
        subtitle="Formulario de planificación para personal técnico de buceo"
        icon={FileText}
      >
        <HPTWizardComplete 
          onComplete={() => setShowWizard(false)}
          onCancel={() => setShowWizard(false)}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="HPT - Hoja de Planificación de Trabajo"
      subtitle="Gestión de documentos de planificación para operaciones de buceo"
      icon={FileText}
      actions={
        <Button onClick={() => setShowWizard(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Crear HPT
        </Button>
      }
    >
      <HPTDataTable />
    </MainLayout>
  );
}
