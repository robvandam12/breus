
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  Calendar,
  Building2,
  Users,
  MapPin,
  MoreHorizontal,
  Filter,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useOperacionesMutations } from "@/hooks/useOperacionesMutations";
import { CreateOperacionForm } from "./CreateOperacionForm";
import { WizardDialog } from "@/components/forms/WizardDialog";
import { OperacionesTable } from "./OperacionesTable";
import { OperacionCardView } from "./OperacionCardView";
import { OperacionesMapView } from "./OperacionesMapView";
import OperacionDetail from "./OperacionDetail";
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';

export const OperacionesManager = () => {
  const { operaciones, isLoading } = useOperaciones();
  const { createOperacion, deleteOperacion, checkCanDelete, isDeleting } = useOperacionesMutations();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("table");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedOperacion, setSelectedOperacion] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    operacion: any | null;
  }>({
    open: false,
    operacion: null
  });

  const filteredOperaciones = operaciones.filter(operacion =>
    operacion.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operacion.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateOperacion = async (data: any) => {
    try {
      await createOperacion(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating operacion:', error);
    }
  };

  const handleViewDetail = (operacion: any) => {
    setSelectedOperacion(operacion);
    setShowDetail(true);
  };

  const handleEdit = (operacion: any) => {
    // Implementar edición
    console.log('Edit operacion:', operacion);
  };

  const handleDeleteClick = async (operacionId: string) => {
    const operacion = operaciones.find(op => op.id === operacionId);
    if (!operacion) return;

    const canDeleteResult = await checkCanDelete(operacionId);
    if (!canDeleteResult.canDelete) {
      // Mostrar mensaje de error
      console.error(`No se puede eliminar: ${canDeleteResult.reason}`);
      return;
    }

    setDeleteDialog({
      open: true,
      operacion
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialog.operacion) {
      try {
        await deleteOperacion(deleteDialog.operacion.id);
        setDeleteDialog({ open: false, operacion: null });
      } catch (error) {
        console.error('Error deleting operacion:', error);
      }
    }
  };

  const handleViewDocuments = (operacion: any) => {
    // Implementar vista de documentos
    console.log('View documents for:', operacion);
  };

  if (showDetail && selectedOperacion) {
    return <OperacionDetail operacion={selectedOperacion} />;
  }

  return (
    <div className="space-y-6">
      {/* Header con búsqueda y acciones */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar operaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          
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
      </div>

      {/* Tabs de visualización */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="table">Tabla</TabsTrigger>
          <TabsTrigger value="cards">Tarjetas</TabsTrigger>
          <TabsTrigger value="map">Mapa</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p>Cargando operaciones...</p>
              </CardContent>
            </Card>
          ) : filteredOperaciones.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay operaciones registradas
                </h3>
                <p className="text-gray-500 mb-4">
                  Comienza creando la primera operación
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
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
          {isLoading ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p>Cargando operaciones...</p>
              </CardContent>
            </Card>
          ) : (
            <OperacionCardView
              operaciones={filteredOperaciones}
              onSelect={handleViewDetail}
              onEdit={handleEdit}
              onViewDetail={handleViewDetail}
              onDelete={handleDeleteClick}
            />
          )}
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

      {/* Dialog de confirmación de eliminación */}
      <DeleteConfirmationDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, operacion: null })}
        title="Eliminar Operación"
        description="¿Estás seguro de que deseas eliminar esta operación? Se eliminará toda la información asociada, incluyendo inmersiones y bitácoras."
        itemName={deleteDialog.operacion?.nombre || ''}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
    </div>
  );
};
