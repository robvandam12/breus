
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Plus, Calendar } from "lucide-react";
import { OperacionesManager } from "@/components/operaciones/OperacionesManager";
import { CreateOperacionForm } from "@/components/operaciones/CreateOperacionForm";
import { useIsMobile } from '@/hooks/use-mobile';

export default function Operaciones() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const isMobile = useIsMobile();

  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
  };

  return (
    <MainLayout
      title="Operaciones"
      subtitle="Gestión de operaciones de buceo y documentos asociados"
      icon={Calendar}
      headerChildren={
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo
        </Button>
      }
    >
      <OperacionesManager />

      {isMobile ? (
        <Drawer open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DrawerContent>
            <div className="p-4 pt-6 max-h-[90vh] overflow-y-auto">
              <CreateOperacionForm onClose={handleCloseCreateForm} />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <CreateOperacionForm onClose={handleCloseCreateForm} />
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
}
