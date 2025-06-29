
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus, Building } from 'lucide-react';
import { OperacionesTable } from '@/components/operaciones/OperacionesTable';
import { CreateOperacionForm } from '@/components/operaciones/CreateOperacionForm';
import { useOperacionesMutations } from '@/hooks/useOperacionesMutations';
import { useOperaciones } from '@/hooks/useOperaciones';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { OperacionFormData } from '@/components/operaciones/CreateOperacionForm';

export default function Operaciones() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { createOperacion, isCreating } = useOperacionesMutations();
  const { operaciones, isLoading } = useOperaciones();

  const handleCreateOperacion = async (data: OperacionFormData) => {
    try {
      // Validar que los campos requeridos estén presentes
      if (!data.codigo || !data.nombre || !data.fecha_inicio) {
        console.error('Missing required fields');
        return;
      }

      // Crear el objeto con el tipo correcto
      const operacionData = {
        codigo: data.codigo,
        nombre: data.nombre,
        fecha_inicio: data.fecha_inicio,
        estado: data.estado || 'activa' as const,
        fecha_fin: data.fecha_fin,
        centro_id: data.centro_id,
        contratista_id: data.contratista_id,
        salmonera_id: data.salmonera_id,
        tareas: data.tareas
      } satisfies OperacionFormData;
      
      await createOperacion(operacionData);
      setShowCreateForm(false);
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Error creating operacion:', error);
    }
  };

  const handleEdit = async (operacion: any) => {
    // Implementar lógica de edición
    console.log('Edit operacion:', operacion.id);
  };

  const handleView = (operacion: any) => {
    // Implementar lógica de visualización
    console.log('View operacion:', operacion.id);
  };

  const handleDelete = async (operacion: any) => {
    // Implementar lógica de eliminación
    console.log('Delete operacion:', operacion.id);
  };

  const handleViewDocuments = (operacion: any) => {
    // Implementar lógica de visualización de documentos
    console.log('View documents for operacion:', operacion.id);
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
          isLoading={isCreating}
        />
      </MainLayout>
    );
  }

  // Transformar operaciones para que coincidan con el tipo esperado por la tabla
  const operacionesParaTabla = operaciones.map(operacion => ({
    ...operacion,
    tipo_trabajo: 'Buceo' as const // Valor por defecto
  }));

  return (
    <MainLayout
      title="Operaciones"
      subtitle="Gestión de operaciones de buceo"
      icon={Building}
      headerChildren={headerActions}
    >
      <OperacionesTable 
        operaciones={operacionesParaTabla}
        onEdit={(operacion) => handleEdit(operacion)}
        onView={(operacion) => handleView(operacion)}
        onDelete={(operacion) => handleDelete(operacion)}
        onViewDocuments={(operacion) => handleViewDocuments(operacion)}
      />

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Nueva Operación</DialogTitle>
          </DialogHeader>
          <CreateOperacionForm
            onSubmit={handleCreateOperacion}
            onCancel={() => setShowCreateDialog(false)}
            isLoading={isCreating}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
