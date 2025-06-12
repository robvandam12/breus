
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OperacionesTable } from "@/components/operaciones/OperacionesTable";
import { OperacionesMapView } from "@/components/operaciones/OperacionesMapView";
import { OperacionCardView } from "@/components/operaciones/OperacionCardView";
import OperacionDetailModal from "@/components/operaciones/OperacionDetailModal";
import { useOperaciones } from "@/hooks/useOperaciones";
import { List, MapPin, Grid3X3 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const OperacionesManager = () => {
  const [activeTab, setActiveTab] = useState("table");
  const [selectedOperacion, setSelectedOperacion] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { operaciones, updateOperacion, deleteOperacion, checkCanDelete } = useOperaciones();

  const handleViewDetail = (operacion: any) => {
    console.log('View detail for operation:', operacion);
    setSelectedOperacion(operacion);
    setShowDetailModal(true);
  };

  const handleEdit = async (operacion: any) => {
    try {
      // Limpiar datos para evitar enviar relaciones
      const { id, sitios, contratistas, salmoneras, ...cleanData } = operacion;
      
      console.log('Updating operation with clean data:', cleanData);
      
      await updateOperacion({ id, data: cleanData });
      
      toast({
        title: "Operación actualizada",
        description: "La operación ha sido actualizada exitosamente.",
      });
    } catch (error: any) {
      console.error('Error updating operation:', error);
      
      if (error?.code === 'PGRST204' && error?.message?.includes('contratistas')) {
        toast({
          title: "Error de datos",
          description: "Error al actualizar la operación. Verifique los datos del contratista.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "No se pudo actualizar la operación.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Verificar si se puede eliminar
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
      console.error('Error deleting operation:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la operación.",
        variant: "destructive",
      });
    }
  };

  const handleSelect = (operacion: any) => {
    console.log('Select operation:', operacion.id);
    handleViewDetail(operacion);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedOperacion(null);
  };

  return (
    <div className="space-y-6">
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
            operaciones={operaciones}
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
        
        <TabsContent value="cards">
          <OperacionCardView 
            operaciones={operaciones}
            onSelect={handleSelect}
            onEdit={handleEdit}
            onViewDetail={handleViewDetail}
            onDelete={handleDelete}
          />
        </TabsContent>
        
        <TabsContent value="map">
          <OperacionesMapView 
            operaciones={operaciones}
            onSelect={handleSelect}
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
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
