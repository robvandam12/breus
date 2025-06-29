
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  Calendar
} from "lucide-react";
import { useInmersiones, type Inmersion } from "@/hooks/useInmersiones";
import { InmersionesTable } from "./InmersionesTable";
import { InmersionCardView } from "./InmersionCardView";
import { InmersionesMapView } from "./InmersionesMapView";
import { InmersionDetailModal } from "./InmersionDetailModal";
import { UnifiedInmersionForm } from "./UnifiedInmersionForm";
import { WizardDialog } from "@/components/forms/WizardDialog";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const InmersionesManager = () => {
  const { 
    inmersiones, 
    isLoading, 
    createInmersion, 
    updateInmersion, 
    deleteInmersion,
    isDeleting 
  } = useInmersiones();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("table");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedInmersion, setSelectedInmersion] = useState<Inmersion | null>(null);
  const [editingInmersion, setEditingInmersion] = useState<Inmersion | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    open: boolean;
    inmersion: Inmersion | null;
  }>({ open: false, inmersion: null });

  // Filter inmersions
  const filteredInmersiones = inmersiones.filter(inmersion => {
    const matchesSearch = inmersion.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inmersion.objetivo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || inmersion.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateInmersion = async (data: any) => {
    try {
      console.log('Creating inmersion from manager:', data);
      await createInmersion(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating inmersion:', error);
    }
  };

  const handleEditInmersion = async (data: any) => {
    if (editingInmersion) {
      try {
        console.log('Updating inmersion:', editingInmersion.inmersion_id, data);
        await updateInmersion({ id: editingInmersion.inmersion_id, data });
        setEditingInmersion(null);
      } catch (error) {
        console.error('Error updating inmersion:', error);
      }
    }
  };

  const handleDeleteClick = (inmersion: Inmersion) => {
    console.log('Delete clicked for inmersion:', inmersion.inmersion_id, inmersion.codigo);
    setDeleteConfirmation({ open: true, inmersion });
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmation.inmersion) {
      const inmersionId = deleteConfirmation.inmersion.inmersion_id;
      const inmersionCodigo = deleteConfirmation.inmersion.codigo;
      try {
        console.log('Confirming delete for inmersion:', inmersionId, inmersionCodigo);
        await deleteInmersion(inmersionId);
        setDeleteConfirmation({ open: false, inmersion: null });
      } catch (error) {
        console.error('Error deleting inmersion:', error);
        // No cerrar el dialog si hay error para que el usuario pueda intentar de nuevo
      }
    }
  };

  const handleViewDetail = (inmersion: Inmersion) => {
    setSelectedInmersion(inmersion);
  };

  const handleEdit = (inmersion: Inmersion) => {
    setEditingInmersion(inmersion);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando inmersiones...</p>
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
              placeholder="Buscar inmersiones..."
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
              <SelectItem value="planificada">Planificada</SelectItem>
              <SelectItem value="en_progreso">En Progreso</SelectItem>
              <SelectItem value="completada">Completada</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <WizardDialog
          triggerText="Nueva Inmersión"
          triggerIcon={Plus}
          triggerClassName="bg-blue-600 hover:bg-blue-700"
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          size="xl"
        >
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Nueva Inmersión</h2>
              <p className="text-sm text-gray-600 mt-1">
                Crear una nueva inmersión de buceo
              </p>
            </div>
            <UnifiedInmersionForm
              onSubmit={handleCreateInmersion}
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
          {filteredInmersiones.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay inmersiones registradas
                </h3>
                <p className="text-gray-500 mb-4">
                  Comienza creando la primera inmersión
                </p>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)} 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Inmersión
                </Button>
              </CardContent>
            </Card>
          ) : (
            <InmersionesTable
              inmersiones={filteredInmersiones}
              onEdit={handleEdit}
              onView={handleViewDetail}
              onDelete={handleDeleteClick}
            />
          )}
        </TabsContent>

        <TabsContent value="cards" className="space-y-4">
          <InmersionCardView
            inmersiones={filteredInmersiones}
            onSelect={handleViewDetail}
            onEdit={handleEdit}
            onViewDetail={handleViewDetail}
            onDelete={handleDeleteClick}
          />
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <InmersionesMapView
            inmersiones={filteredInmersiones}
            onSelect={handleViewDetail}
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </TabsContent>
      </Tabs>

      {/* Modal de detalle */}
      {selectedInmersion && (
        <InmersionDetailModal
          inmersion={selectedInmersion}
          isOpen={!!selectedInmersion}
          onClose={() => setSelectedInmersion(null)}
        />
      )}

      {/* Modal de edición */}
      <WizardDialog
        triggerText=""
        open={!!editingInmersion}
        onOpenChange={() => setEditingInmersion(null)}
        size="xl"
        hideButton
      >
        {editingInmersion && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Editar Inmersión</h2>
              <p className="text-sm text-gray-600 mt-1">
                Modificar los datos de la inmersión
              </p>
            </div>
            <UnifiedInmersionForm
              initialData={editingInmersion}
              onSubmit={handleEditInmersion}
              onCancel={() => setEditingInmersion(null)}
            />
          </div>
        )}
      </WizardDialog>

      {/* Confirmación de eliminación */}
      <DeleteConfirmationDialog
        open={deleteConfirmation.open}
        onOpenChange={(open) => !isDeleting && setDeleteConfirmation({ open, inmersion: open ? deleteConfirmation.inmersion : null })}
        title="Eliminar Inmersión"
        description="¿Estás seguro de que deseas eliminar esta inmersión? Se eliminará toda la información asociada."
        itemName={deleteConfirmation.inmersion?.codigo || ''}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
    </div>
  );
};
