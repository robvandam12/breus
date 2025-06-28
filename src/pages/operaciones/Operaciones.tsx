
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus, Building } from 'lucide-react';
import { OperacionesTable } from '@/components/operaciones/OperacionesTable';
import { CreateOperacionForm } from '@/components/operaciones/CreateOperacionForm';
import { useOperacionesMutations } from '@/hooks/useOperacionesMutations';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { OperacionFormData } from '@/components/operaciones/CreateOperacionForm';

export default function Operaciones() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { createOperacion } = useOperacionesMutations();

  const handleCreateOperacion = async (data: OperacionFormData) => {
    try {
      await createOperacion.mutateAsync(data);
      setShowCreateForm(false);
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Error creating operacion:', error);
    }
  };

  const headerActions = (
    <>
      <Button onClick={() => setShowCreateForm(true)} className="gap-2">
        <Plus className="w-4 h-4" />
        Nueva Operación
      </Button>
      <Button onClick={() => setShowCreateDialog(true)} variant="outline" className="gap-2">
        <Plus className="w-4 h-4" />
        Crear con Dialog
      </Button>
    </>
  );

  if (showCreateForm) {
    return (
      <MainLayout
        title="Nueva Operación"
        subtitle="Crear una nueva operación de buceo"
        icon={Building}
      >
        <CreateOperacionForm
          onSubmit={handleCreateOperacion}
          onCancel={() => setShowCreateForm(false)}
          isLoading={createOperacion.isPending}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Operaciones"
      subtitle="Gestión de operaciones de buceo"
      icon={Building}
      headerChildren={headerActions}
    >
      <OperacionesTable />

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Nueva Operación</DialogTitle>
          </DialogHeader>
          <CreateOperacionForm
            onSubmit={handleCreateOperacion}
            onCancel={() => setShowCreateDialog(false)}
            isLoading={createOperacion.isPending}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
