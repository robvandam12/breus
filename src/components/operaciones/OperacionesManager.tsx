
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  Filter,
  Calendar
} from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useOperacionesFilters } from "@/hooks/useOperacionesFilters";
import { OperacionesTable } from "./OperacionesTable";
import { OperacionCardView } from "./OperacionCardView";
import { OperacionesMapView } from "./OperacionesMapView";
import OperacionDetailModal from "./OperacionDetailModal";
import { CreateOperacionForm } from "./CreateOperacionForm";
import { EditOperacionForm } from "./EditOperacionForm";
import { WizardDialog } from "@/components/forms/WizardDialog";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { OperacionConRelaciones } from '@/hooks/useOperacionesQuery';

export const OperacionesManager = () => {
  const { 
    operaciones, 
    isLoading, 
    createOperacion, 
    updateOperacion, 
    deleteOperacion, 
    checkCanDelete,
    isDeleting 
  } = useOperaciones();
  
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredOperaciones
  } = useOperacionesFilters(operaciones);

  const [activeTab, setActiveTab] = useState("table");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedOperacion, setSelectedOperacion] = useState<OperacionConRelaciones | null>(null);
  const [editingOperacion, setEditingOperacion] = useState<OperacionConRelaciones | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    open: boolean;
    operacion: OperacionConRelaciones | null;
  }>({ open: false, operacion: null });

  const handleCreateOperacion = async (data: any) => {
    try {
      await createOperacion(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating operacion:', error);
    }
  };

  const handleEditOperacion = async (data: any) => {
    if (editingOperacion) {
      try {
        await updateOperacion({ id: editingOperacion.id, data });
        setEditingOperacion(null);
      } catch (error) {
        console.error('Error updating operacion:', error);
      }
    }
  };

  const handleDeleteClick = async (operacionId: string) => {
    const operacion = operaciones.find(op => op.id === operacionId);
    if (operacion) {
      const canDeleteResult = await checkCanDelete(operacionId);
      if (!canDeleteResult.canDelete) {
        alert(`No se puede eliminar la operación porque ${canDeleteResult.reason}`);
        return;
      }
      setDeleteConfirmation({ open: true, operacion });
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmation.operacion) {
      try {
        await deleteOperacion(deleteConfirmation.operacion.id);
        setDeleteConfirmation({ open: false, operacion: null });
      } catch (error) {
        console.error('Error deleting operacion:', error);
      }
    }
  };

  const handleViewDetail = (operacion: OperacionConRelaciones) => {
    setSelectedOperacion(operacion);
  };

  const handleEdit = (operacion: OperacionConRelaciones) => {
    setEditingOperacion(operacion);
  };

  const handleViewDocuments = (operacion: OperacionConRelaciones) => {
    // Abrir modal de detalle en la pestaña de documentos
    setSelectedOperacion(operacion);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Cargando operaciones...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar operaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="activa">Activa</SelectItem>
              <SelectItem value="pausada">Pausada</SelectItem>
              <SelectItem value="completada">Completada</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <WizardDialog
          triggerText="Nueva Operación"
          triggerIcon={Plus}
          triggerClassName="bg-blue-600 hover:bg-blue-700"
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          size="xl"
        >
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Nueva Operación</h2>
              <p className="text-sm text-gray-600 mt-1">
                Crear una nueva operación de buceo
              </p>
            </div>
            <CreateOperacionForm
              onSubmit={handleCreateOperacion}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </div>
        </WizardDialog>
      </div>

      {/* Tabs de visualización */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="table">Tabla</TabsTrigger>
          <TabsTrigger value="cards">Tarjetas</TabsTrigger>
          <TabsTrigger value="map">Mapa</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          {filteredOperaciones.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay operaciones registradas
                </h3>
                <p className="text-gray-500 mb-4">
                  Comienza creando la primera operación
                </p>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)} 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Operación
                </Button>
              </CardContent>
            </Card>
          ) : (
            <OperacionesTable
              operaciones={filteredOperaciones}
              onEdit={handleEdit}
              onView={handleViewDetail}
              onDelete={handleDeleteClick}
              onViewDocuments={handleViewDocuments}
              isDeleting={isDeleting}
            />
          )}
        </TabsContent>

        <TabsContent value="cards" className="space-y-4">
          <OperacionCardView
            operaciones={filteredOperaciones}
            onSelect={handleViewDetail}
            onEdit={handleEdit}
            onViewDetail={handleViewDetail}
            onDelete={handleDeleteClick}
          />
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <OperacionesMapView
            operaciones={filteredOperaciones}
            onSelect={handleViewDetail}
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </TabsContent>
      </Tabs>

      {/* Modal de detalle */}
      {selectedOperacion && (
        <OperacionDetailModal
          operacion={selectedOperacion}
          isOpen={!!selectedOperacion}
          onClose={() => setSelectedOperacion(null)}
        />
      )}

      {/* Modal de edición */}
      <WizardDialog
        triggerText=""
        open={!!editingOperacion}
        onOpenChange={() => setEditingOperacion(null)}
        size="xl"
        hideButton
      >
        {editingOperacion && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Editar Operación</h2>
              <p className="text-sm text-gray-600 mt-1">
                Modificar los datos de la operación
              </p>
            </div>
            <EditOperacionForm
              operacion={editingOperacion}
              onSubmit={handleEditOperacion}
              onCancel={() => setEditingOperacion(null)}
            />
          </div>
        )}
      </WizardDialog>

      {/* Confirmación de eliminación */}
      <DeleteConfirmationDialog
        open={deleteConfirmation.open}
        onOpenChange={(open) => setDeleteConfirmation({ open, operacion: null })}
        title="Eliminar Operación"
        description="¿Estás seguro de que deseas eliminar esta operación? Se eliminará toda la información asociada."
        itemName={deleteConfirmation.operacion?.nombre || ''}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
    </div>
  );
};
