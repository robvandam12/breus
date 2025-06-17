
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Plus, Calendar, Workflow, FileText } from "lucide-react";
import { OperacionesManager } from "@/components/operaciones/OperacionesManager";
import { CreateOperacionForm } from "@/components/operaciones/CreateOperacionForm";
import { OperationFlowWizard } from "@/components/operaciones/OperationFlowWizard";
import { OperationTemplateManager } from "@/components/operaciones/OperationTemplateManager";
import { useIsMobile } from '@/hooks/use-mobile';

export default function Operaciones() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showFlowWizard, setShowFlowWizard] = useState(false);
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const isMobile = useIsMobile();

  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
  };

  const handleCloseFlowWizard = () => {
    setShowFlowWizard(false);
  };

  const handleCreateFromTemplate = (template: any) => {
    setShowTemplateManager(false);
    setShowFlowWizard(true);
  };

  const renderDialog = (isOpen: boolean, onClose: () => void, children: React.ReactNode) => {
    if (isMobile) {
      return (
        <Drawer open={isOpen} onOpenChange={onClose}>
          <DrawerContent>
            <div className="p-4 pt-6 max-h-[90vh] overflow-y-auto">
              {children}
            </div>
          </DrawerContent>
        </Drawer>
      );
    }

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {children}
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <MainLayout
      title="Operaciones"
      subtitle="Gestión completa de operaciones de buceo y documentos asociados"
      icon={Calendar}
      headerChildren={
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowTemplateManager(true)}
            className="hidden md:flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Templates
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowFlowWizard(true)}
          >
            <Workflow className="w-4 h-4 mr-2" />
            Wizard Completo
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Operación
          </Button>
        </div>
      }
    >
      <OperacionesManager />

      {/* Formulario de creación simple */}
      {renderDialog(showCreateForm, handleCloseCreateForm, 
        <CreateOperacionForm onClose={handleCloseCreateForm} />
      )}

      {/* Wizard de flujo completo */}
      {renderDialog(showFlowWizard, handleCloseFlowWizard,
        <OperationFlowWizard 
          onStepChange={(stepId) => console.log('Wizard step:', stepId)}
        />
      )}

      {/* Gestión de templates */}
      {renderDialog(showTemplateManager, () => setShowTemplateManager(false),
        <OperationTemplateManager 
          onCreateFromTemplate={handleCreateFromTemplate}
        />
      )}
    </MainLayout>
  );
}
