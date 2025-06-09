
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OperacionesTable } from "@/components/operaciones/OperacionesTable";
import { OperacionesMapView } from "@/components/operaciones/OperacionesMapView";
import { OperacionCardView } from "@/components/operaciones/OperacionCardView";
import { useOperaciones } from "@/hooks/useOperaciones";
import { List, MapPin, Grid3X3 } from "lucide-react";

export const OperacionesManager = () => {
  const [activeTab, setActiveTab] = useState("table");
  const [selectedOperacion, setSelectedOperacion] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { operaciones, updateOperacion, deleteOperacion } = useOperaciones();

  const handleViewDetail = (operacion: any) => {
    console.log('View detail for operation:', operacion);
    setSelectedOperacion(operacion);
    setShowDetailModal(true);
  };

  const handleEdit = async (operacion: any) => {
    try {
      // Extract the id from the operacion object and pass the rest as data
      const { id, ...data } = operacion;
      await updateOperacion({ id, data });
    } catch (error) {
      console.error('Error updating operation:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOperacion(id);
    } catch (error) {
      console.error('Error deleting operation:', error);
    }
  };

  const handleSelect = (operacion: any) => {
    console.log('Select operation:', operacion.id);
    handleViewDetail(operacion);
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
          />
        </TabsContent>
        
        <TabsContent value="map">
          <OperacionesMapView />
        </TabsContent>
      </Tabs>
    </div>
  );
};
