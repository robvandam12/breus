import { useState } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { HPTDataTable } from "@/components/hpt/HPTDataTable";
import { HPTWizardComplete } from "@/components/hpt/HPTWizardComplete";

export default function HPT() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateHPT = () => {
    setShowCreateForm(true);
  };

  const handleHPTComplete = () => {
    setShowCreateForm(false);
  };

  const handleHPTCancel = () => {
    setShowCreateForm(false);
  };

  return (
    <MainLayout
      title="HPT - Hoja de Planificación de Trabajo"
      subtitle="Gestión de Hojas de Planificación de Trabajo para operaciones de buceo"
      icon={FileText}
      headerChildren={
        <Button onClick={handleCreateHPT} className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva HPT
        </Button>
      }
    >
      {showCreateForm ? (
        <HPTWizardComplete
          onComplete={handleHPTComplete}
          onCancel={handleHPTCancel}
        />
      ) : (
        <HPTDataTable />
      )}
    </MainLayout>
  );
}
