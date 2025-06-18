
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Plus, Calendar, Workflow } from "lucide-react";
import { OperacionesManager } from "@/components/operaciones/OperacionesManager";
import { CreateOperacionForm } from "@/components/operaciones/CreateOperacionForm";
import { OperationFlowWizard } from "@/components/operaciones/OperationFlowWizard";
import { useIsMobile } from '@/hooks/use-mobile';
import { useSearchParams } from 'react-router-dom';
import { useOperationNotifications } from '@/hooks/useOperationNotifications';
import { toast } from '@/hooks/use-toast';

export default function Operaciones() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showFlowWizard, setShowFlowWizard] = useState(false);
  const [wizardOperacionId, setWizardOperacionId] = useState<string | undefined>();
  
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  
  // Obtener parámetros de URL para manejar el estado inicial
  const wizardParam = searchParams.get('wizard');

  // Setup notifications para operaciones globales
  useOperationNotifications();

  useEffect(() => {
    // Manejar parámetros de URL
    if (wizardParam === 'new') {
      setShowFlowWizard(true);
      setWizardOperacionId(undefined);
    } else if (wizardParam) {
      setShowFlowWizard(true);
      setWizardOperacionId(wizardParam);
    }

    // Limpiar parámetros después de procesarlos
    if (wizardParam) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('wizard');
      
      const newUrl = newParams.toString() ? 
        `${window.location.pathname}?${newParams.toString()}` : 
        window.location.pathname;
      
      window.history.replaceState({}, '', newUrl);
    }
  }, [wizardParam]);

  // Escuchar eventos de actualización de operaciones
  useEffect(() => {
    const handleOperationUpdated = (event: CustomEvent) => {
      const { type } = event.detail;
      
      switch (type) {
        case 'hpt_completed':
          toast({
            title: "HPT Completado",
            description: "El HPT ha sido firmado. Puede continuar con el siguiente paso.",
          });
          break;
        case 'anexo_completed':
          toast({
            title: "Anexo Bravo Completado", 
            description: "El Anexo Bravo ha sido firmado. Puede continuar con el siguiente paso.",
          });
          break;
      }
    };

    const handleOperationReady = (event: CustomEvent) => {
      toast({
        title: "¡Operación Lista!",
        description: "La operación está completamente configurada y lista para inmersiones.",
      });
    };

    window.addEventListener('operationUpdated', handleOperationUpdated as EventListener);
    window.addEventListener('operationReady', handleOperationReady as EventListener);

    return () => {
      window.removeEventListener('operationUpdated', handleOperationUpdated as EventListener);
      window.removeEventListener('operationReady', handleOperationReady as EventListener);
    };
  }, []);

  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
  };

  const handleCloseFlowWizard = () => {
    setShowFlowWizard(false);
    setWizardOperacionId(undefined);
  };

  const handleWizardComplete = () => {
    setShowFlowWizard(false);
    setWizardOperacionId(undefined);
    toast({
      title: "¡Operación completada!",
      description: "La operación está lista para ejecutarse",
    });
  };

  const handleStartWizard = (operacionId?: string) => {
    setWizardOperacionId(operacionId);
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
      <OperacionesManager onStartWizard={handleStartWizard} />

      {/* Formulario de creación simple */}
      {renderDialog(showCreateForm, handleCloseCreateForm, 
        <CreateOperacionForm onClose={handleCloseCreateForm} />
      )}

      {/* Wizard de flujo completo */}
      {renderDialog(showFlowWizard, handleCloseFlowWizard,
        <OperationFlowWizard 
          operacionId={wizardOperacionId}
          onStepChange={(stepId) => console.log('Wizard step:', stepId)}
          onComplete={handleWizardComplete}
          onCancel={handleCloseFlowWizard}
        />
      )}
    </MainLayout>
  );
}
