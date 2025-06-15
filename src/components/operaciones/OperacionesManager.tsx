import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OperacionesTable } from "@/components/operaciones/OperacionesTable";
import { OperacionesMapView } from "@/components/operaciones/OperacionesMapView";
import { OperacionCardView } from "@/components/operaciones/OperacionCardView";
import OperacionDetailModal from "@/components/operaciones/OperacionDetailModal";
import { useOperaciones } from "@/hooks/useOperaciones";
import { List, MapPin, Grid3X3 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useOperacionesFilters } from "@/hooks/useOperacionesFilters";
import { OperacionesFilters } from "@/components/operaciones/OperacionesFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

export const OperacionesManager = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState(isMobile ? "cards" : "table");
  const [selectedOperacion, setSelectedOperacion] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
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

  const handleViewDetail = (operacion: any) => {
    setSelectedOperacion(operacion);
    setShowDetailModal(true);
  };

  const handleEdit = async (operacion: any) => {
    try {
      const { id, sitios, contratistas, salmoneras, ...cleanData } = operacion;
      await updateOperacion({ id, data: cleanData });
      toast({
        title: "Operación actualizada",
        description: "La operación ha sido actualizada exitosamente.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la operación.",
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="table" className="flex items-center gap-2">
            <List className="w-4 h-4" />
            Tabla
          </TabsTrigger>
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4" />
            Tarjetas
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Mapa
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="table">
          <OperacionesTable 
            operaciones={filteredOperaciones}
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
        
        <TabsContent value="cards">
          <OperacionCardView 
            operaciones={filteredOperaciones}
            onSelect={handleSelect}
            onEdit={handleEdit}
            onViewDetail={handleViewDetail}
            onDelete={handleDelete}
          />
        </TabsContent>
        
        <TabsContent value="map">
          <OperacionesMapView 
            operaciones={filteredOperaciones}
            onSelect={handleSelect}
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>

      {selectedOperacion && (
        <OperacionDetailModal 
          operacion={selectedOperacion}
          isOpen={showDetailModal}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};
