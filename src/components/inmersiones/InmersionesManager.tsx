
import React, { useState, useMemo, useCallback, lazy, Suspense } from 'react';
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
import { InmersionDetailModal } from "./InmersionDetailModal";
import { UnifiedInmersionForm } from "./UnifiedInmersionForm";
import { WizardDialog } from "@/components/forms/WizardDialog";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";

// Lazy loading de componentes pesados
const InmersionesTable = lazy(() => import("./InmersionesTable").then(module => ({ 
  default: module.InmersionesTable 
})));

const InmersionCardView = lazy(() => import("./InmersionCardView").then(module => ({ 
  default: module.InmersionCardView 
})));

const InmersionesMapView = lazy(() => import("./InmersionesMapViewEnhanced").then(module => ({ 
  default: module.InmersionesMapViewEnhanced 
})));

// Componente de loading para tabs
const TabLoadingSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="p-4">
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export const InmersionesManager = React.memo(() => {
  const { profile } = useAuth();
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

  // Usar debounce para búsqueda y filtros
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const debouncedStatusFilter = useDebounce(statusFilter, 100);

  // Memoizar inmersiones filtradas
  const filteredInmersiones = useMemo(() => {
    console.log('Filtering inmersiones:', {
      total: inmersiones.length,
      searchTerm: debouncedSearchTerm,
      statusFilter: debouncedStatusFilter
    });

    return inmersiones.filter(inmersion => {
      const matchesSearch = !debouncedSearchTerm ||
                           inmersion.codigo?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           inmersion.objetivo?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesStatus = debouncedStatusFilter === "all" || inmersion.estado === debouncedStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [inmersiones, debouncedSearchTerm, debouncedStatusFilter]);

  // Memoizar handlers
  const handleCreateInmersion = useCallback(async (data: any) => {
    try {
      console.log('Creating inmersion from manager:', data);
      await createInmersion(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating inmersion:', error);
    }
  }, [createInmersion]);

  const handleEditInmersion = useCallback(async (data: any) => {
    if (editingInmersion) {
      try {
        console.log('Updating inmersion:', editingInmersion.inmersion_id, data);
        await updateInmersion(editingInmersion.inmersion_id, data);
        setEditingInmersion(null);
      } catch (error) {
        console.error('Error updating inmersion:', error);
      }
    }
  }, [editingInmersion, updateInmersion]);

  const handleDeleteClick = useCallback((inmersion: Inmersion) => {
    console.log('Delete clicked for inmersion:', inmersion.inmersion_id, inmersion.codigo);
    setDeleteConfirmation({ open: true, inmersion });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
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
  }, [deleteConfirmation.inmersion, deleteInmersion]);

  const handleViewDetail = useCallback((inmersion: Inmersion) => {
    setSelectedInmersion(inmersion);
  }, []);

  const handleEdit = useCallback((inmersion: Inmersion) => {
    // Verificar permisos antes de permitir edición
    const canEdit = profile?.role === 'superuser' || 
                   profile?.role === 'admin_salmonera' || 
                   profile?.role === 'admin_servicio' ||
                   inmersion.supervisor_id === profile?.id;
    
    if (canEdit) {
      setEditingInmersion(inmersion);
    } else {
      console.warn('User does not have permission to edit this inmersion');
    }
  }, [profile]);

  // Verificar permisos para mostrar botón de crear
  const canCreate = useMemo(() => {
    return profile?.role === 'superuser' || 
           profile?.role === 'admin_salmonera' || 
           profile?.role === 'admin_servicio' ||
           profile?.role === 'supervisor';
  }, [profile?.role]);

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
        
        {canCreate && (
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
        )}
      </div>

      {/* Tabs de visualización con lazy loading */}
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
                  {canCreate ? 'Comienza creando la primera inmersión' : 'No tienes permisos para crear inmersiones'}
                </p>
                {canCreate && (
                  <Button 
                    onClick={() => setIsCreateDialogOpen(true)} 
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Inmersión
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Suspense fallback={<TabLoadingSkeleton />}>
              <InmersionesTable
                inmersiones={filteredInmersiones}
                onEdit={handleEdit}
                onView={handleViewDetail}
                onDelete={handleDeleteClick}
              />
            </Suspense>
          )}
        </TabsContent>

        <TabsContent value="cards" className="space-y-4">
          <Suspense fallback={<TabLoadingSkeleton />}>
            <InmersionCardView
              inmersiones={filteredInmersiones}
              onSelect={handleViewDetail}
              onEdit={handleEdit}
              onViewDetail={handleViewDetail}
              onDelete={handleDeleteClick}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Suspense fallback={<TabLoadingSkeleton />}>
            <InmersionesMapView
              inmersiones={filteredInmersiones}
              onSelect={handleViewDetail}
              onViewDetail={handleViewDetail}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          </Suspense>
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
});

InmersionesManager.displayName = 'InmersionesManager';
