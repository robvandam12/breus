
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OperacionesTable } from "@/components/operaciones/OperacionesTable";
import { OperacionesMapView } from "@/components/operaciones/OperacionesMapView";
import { OperacionCardView } from "@/components/operaciones/OperacionCardView";
import OperacionDetailModal from "@/components/operaciones/OperacionDetailModal";
import { OperationFlowWizard } from "@/components/operaciones/OperationFlowWizard";
import { OperationStatusTracker } from "@/components/operaciones/OperationStatusTracker";
import { OperationTemplateManager } from "@/components/operaciones/OperationTemplateManager";
import { ValidationGateway } from "@/components/operaciones/ValidationGateway";
import { useOperaciones } from "@/hooks/useOperaciones";
import { List, MapPin, Grid3X3, Workflow, BarChart3, FileTemplate, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useOperacionesFilters } from "@/hooks/useOperacionesFilters";
import { OperacionesFilters } from "@/components/operaciones/OperacionesFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

export const OperacionesManager = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState(isMobile ? "cards" : "status");
  const [selectedOperacion, setSelectedOperacion] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFlowWizard, setShowFlowWizard] = useState(false);
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const [showValidationGateway, setShowValidationGateway] = useState(false);
  const [selectedOperacionForValidation, setSelectedOperacionForValidation] = useState<string | null>(null);
  
  const { 
    operaciones, 
    isLoading,
    updateOperacion, 
    deleteOperacion, 
    checkCanDelete 
  } = useOperaciones();
  
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredOperaciones
  } = useOperacionesFilters(operaciones);

  // Preparar datos para OperationStatusTracker
  const operacionesStatus = filteredOperaciones.map(op => ({
    id: op.id,
    nombre: op.nombre,
    estado: op.estado as 'planificacion' | 'preparacion' | 'ejecucion' | 'finalizacion' | 'completada',
    progreso: op.estado === 'completada' ? 100 : op.estado === 'activa' ? 60 : 30,
    fechaInicio: op.fecha_inicio,
    fechaFin: op.fecha_fin,
    documentos: {
      hpt: true, // Esto debería venir de una consulta real
      anexoBravo: true,
      bitacorasSupervisor: 2,
      bitacorasBuzo: 3
    },
    equipo: {
      supervisor: !!op.supervisor_asignado_id,
      buzos: 2, // Esto debería calcularse desde el equipo de buceo
      equipoCompleto: !!op.equipo_buceo_id
    },
    alertas: 0
  }));

  const handleViewDetail = (operacion: any) => {
    setSelectedOperacion(operacion);
    setShowDetailModal(true);
  };

  const handleStartFlowWizard = (operacionId?: string) => {
    if (operacionId) {
      setSelectedOperacion(operaciones.find(op => op.id === operacionId));
    }
    setShowFlowWizard(true);
  };

  const handleValidateOperacion = (operacionId: string) => {
    setSelectedOperacionForValidation(operacionId);
    setShowValidationGateway(true);
  };

  const handleCreateFromTemplate = (template: any) => {
    toast({
      title: "Template seleccionado",
      description: `Creando operación basada en "${template.nombre}"`,
    });
    setShowTemplateManager(false);
    setShowFlowWizard(true);
  };

  const handleEdit = async (operacion: any) => {
    try {
      // Limpiar datos para enviar solo los campos válidos de la tabla operacion
      const cleanData = {
        codigo: operacion.codigo,
        nombre: operacion.nombre,
        tareas: operacion.tareas,
        fecha_inicio: operacion.fecha_inicio,
        fecha_fin: operacion.fecha_fin,
        estado: operacion.estado,
        estado_aprobacion: operacion.estado_aprobacion,
        salmonera_id: operacion.salmonera_id,
        contratista_id: operacion.contratista_id,
        sitio_id: operacion.sitio_id,
        servicio_id: operacion.servicio_id,
        equipo_buceo_id: operacion.equipo_buceo_id,
        supervisor_asignado_id: operacion.supervisor_asignado_id
      };

      // Remover campos undefined o null
      Object.keys(cleanData).forEach(key => {
        if (cleanData[key as keyof typeof cleanData] === undefined) {
          delete cleanData[key as keyof typeof cleanData];
        }
      });

      console.log('Sending cleaned data to update:', cleanData);
      
      await updateOperacion({ id: operacion.id, data: cleanData });
      toast({
        title: "Operación actualizada",
        description: "La operación ha sido actualizada exitosamente.",
      });
    } catch (error: any) {
      console.error('Error updating operacion:', error);
      toast({
        title: "Error",
        description: `No se pudo actualizar la operación: ${error.message || 'Error desconocido'}`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { canDelete, reason } = await checkCanDelete(id);
      if (!canDelete) {
        toast({
          title: "No se puede eliminar",
          description: `La operación no se puede eliminar porque ${reason}.`,
          variant: "destructive",
        });
        return;
      }
      await deleteOperacion(id);
      toast({
        title: "Operación eliminada",
        description: "La operación ha sido eliminada exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la operación.",
        variant: "destructive",
      });
    }
  };

  const handleSelect = (operacion: any) => {
    handleViewDetail(operacion);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedOperacion(null);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 items-center">
          <Skeleton className="h-10 flex-1 min-w-64" />
          <Skeleton className="h-10 w-48" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OperacionesFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setShowFlowWizard(true)}>
          <Workflow className="w-4 h-4 mr-2" />
          Wizard Completo
        </Button>
        <Button variant="outline" onClick={() => setShowTemplateManager(true)}>
          <FileTemplate className="w-4 h-4 mr-2" />
          Templates
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-muted p-1 h-10">
          <TabsTrigger value="status" className="flex items-center gap-2 text-sm">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Estado</span>
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2 text-sm">
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Tabla</span>
          </TabsTrigger>
          <TabsTrigger value="cards" className="flex items-center gap-2 text-sm">
            <Grid3X3 className="w-4 h-4" />
            <span className="hidden sm:inline">Tarjetas</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Mapa</span>
          </TabsTrigger>
          <TabsTrigger value="validation" className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Validar</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="status" className="mt-6">
          <OperationStatusTracker operaciones={operacionesStatus} />
        </TabsContent>
        
        <TabsContent value="table" className="mt-6">
          <OperacionesTable 
            operaciones={filteredOperaciones}
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
        
        <TabsContent value="cards" className="mt-6">
          <OperacionCardView 
            operaciones={filteredOperaciones}
            onSelect={handleSelect}
            onEdit={handleEdit}
            onViewDetail={handleViewDetail}
            onDelete={handleDelete}
          />
        </TabsContent>
        
        <TabsContent value="map" className="mt-6">
          <OperacionesMapView 
            operaciones={filteredOperaciones}
            onSelect={handleSelect}
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="validation" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Validación de Operaciones</h3>
            <div className="grid gap-4">
              {filteredOperaciones.map((operacion) => (
                <div key={operacion.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{operacion.nombre}</h4>
                    <p className="text-sm text-gray-600">Código: {operacion.codigo}</p>
                  </div>
                  <Button onClick={() => handleValidateOperacion(operacion.id)}>
                    <Shield className="w-4 h-4 mr-2" />
                    Validar
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {selectedOperacion && (
        <OperacionDetailModal 
          operacion={selectedOperacion}
          isOpen={showDetailModal}
          onClose={handleCloseDetail}
        />
      )}

      <Dialog open={showFlowWizard} onOpenChange={setShowFlowWizard}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Flujo Completo de Operación</DialogTitle>
          </DialogHeader>
          <OperationFlowWizard 
            operacionId={selectedOperacion?.id}
            onStepChange={(stepId) => console.log('Step changed:', stepId)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showTemplateManager} onOpenChange={setShowTemplateManager}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gestión de Templates</DialogTitle>
          </DialogHeader>
          <OperationTemplateManager 
            onCreateFromTemplate={handleCreateFromTemplate}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showValidationGateway} onOpenChange={setShowValidationGateway}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <ValidationGateway 
            operacionId={selectedOperacionForValidation || ''}
            onValidationComplete={() => {
              setShowValidationGateway(false);
              setSelectedOperacionForValidation(null);
              toast({
                title: "Validación completada",
                description: "La operación ha sido validada exitosamente.",
              });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
