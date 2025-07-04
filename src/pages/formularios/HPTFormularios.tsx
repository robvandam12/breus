import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import { HPTWizardComplete } from '@/components/hpt/HPTWizardComplete';

export default function HPTFormularios() {
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
      title="HPT"
      subtitle="Hojas de Planificación de Trabajo"
      icon={FileText}
      headerChildren={
        <Button onClick={handleCreateHPT} className="gap-2">
          <Plus className="w-4 h-4" />
          Crear HPT
        </Button>
      }
    >
      {showCreateForm ? (
        <HPTWizardComplete
          onComplete={handleHPTComplete}
          onCancel={handleHPTCancel}
        />
      ) : (
        <div>
          {/* Content of the HPTFormularios page */}
          <p>Aquí irá la tabla o listado de HPTs existentes.</p>
        </div>
      )}
    </MainLayout>
  );
}
