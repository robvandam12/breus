
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OperacionesTable } from "@/components/operaciones/OperacionesTable";
import { OperacionesMapView } from "@/components/operaciones/OperacionesMapView";
import { OperacionCardView } from "@/components/operaciones/OperacionCardView";
import OperacionDetailModal from "@/components/operaciones/OperacionDetailModal";
import { OperationFlowWizard } from "@/components/operaciones/OperationFlowWizard";
import { ValidationGateway } from "@/components/operaciones/ValidationGateway";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useOperationInmersionIntegration } from "@/hooks/useOperationInmersionIntegration";
import { List, MapPin, Grid3X3, Workflow, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useOperacionesFilters } from "@/hooks/useOperacionesFilters";
import { OperacionesFilters } from "@/components/operaciones/OperacionesFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

interface OperacionesManagerProps {
  onStartWizard?: (operacionId?: string) => void;
}

export const OperacionesManager = ({ onStartWizard }: OperacionesManagerProps) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState(isMobile ? "cards" : "table");
  const [selectedOperacion, setSelectedOperacion] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFlowWizard, setShowFlowWizard] = useState(false);
  const [showValidationGateway, setShowValidationGateway] = useState(false);
  const [selectedOperacionForValidation, setSelectedOperacionForValidation] = useState<string | null>(null);
  
  const { 
    operaciones, 
    isLoading,
    updateOperacion, 
    deleteOperacion, 
    checkCanDelete 
  } = useOperaciones();

  const { validateBeforeInmersion } = useOperationInmersionIntegration();
  
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredOperaciones
  } = useOperacionesFilters(operaciones);

  const handleViewDetail = (operacion: any) => {
    setSelectedOperacion(operacion);
    setShowDetailModal(true);
  };

  const handleStartFlowWizard = (operacionId?: string) => {
    if (onStartWizard) {
      onStartWizard(operacionId);
    } else {
      if (operacionId) {
        setSelectedOperacion(operaciones.find(op => op.id === operacionId));
      }
      setShowFlowWizard(true);
    }
  };

  const handleValidateOperacion = (operacionId: string) => {
    setSelectedOperacionForValidation(operacionId);
    setShowValidationGateway(true);
  };

  const handleCreateInmersion = async (operacionId: string) => {
    try {
      const validation = await validateBeforeInmersion(operacionId);
      
      if (!validation.canProceed) {
        toast({
          title: "Operación no lista",
          description: validation.message,
          variant: "destructive",
        });
        
        // Mostrar wizard de validación
        handleValidateOperacion(operacionId);
        return;
      }

      // Redirigir a crear inmersión
      window.location.href = `/inmersiones?operacion=${operacionId}`;
    } catch (error) {
      console.error('Error validating for inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo validar la operación para inmersiones",
        variant: "destructive",
      });
    }
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted p-1 h-10">
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
        </TabsList>
        
        <TabsContent value="table" className="mt-6">
          <OperacionesTable 
            operaciones={filteredOperaciones}
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStartWizard={handleStartFlowWizard}
            onCreateInmersion={handleCreateInmersion}
          />
        </TabsContent>
        
        <TabsContent value="cards" className="mt-6">
          <OperacionCardView 
            operaciones={filteredOperaciones}
            onSelect={handleSelect}
            onEdit={handleEdit}
            onViewDetail={handleViewDetail}
            onDelete={handleDelete}
            onStartWizard={handleStartFlowWizard}
            onCreateInmersion={handleCreateInmersion}
          />
        </TabsContent>
        
        <TabsContent value="map" className="mt-6">
          <OperacionesMapView 
            operaciones={filteredOperaciones}
            onSelect={handleSelect}
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStartWizard={handleStartFlowWizard}
            onCreateInmersion={handleCreateInmersion}
          />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <OperacionDetailModal
        operacion={selectedOperacion}
        isOpen={showDetailModal}
        onClose={handleCloseDetail}
        onStartWizard={handleStartFlowWizard}
        onCreateInmersion={handleCreateInmersion}
      />

      {/* Dialogs */}
      <Dialog open={showFlowWizard} onOpenChange={setShowFlowWizard}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <OperationFlowWizard 
            operacionId={selectedOperacion?.id}
            onStepChange={(stepId) => console.log('Wizard step:', stepId)}
            onComplete={() => setShowFlowWizard(false)}
            onCancel={() => setShowFlowWizard(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showValidationGateway} onOpenChange={setShowValidationGateway}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              Validación de Operación
            </DialogTitle>
          </DialogHeader>
          {selectedOperacionForValidation && (
            <ValidationGateway 
              operacionId={selectedOperacionForValidation}
              onValidationComplete={() => setShowValidationGateway(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
