
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OperacionesTable } from "@/components/operaciones/OperacionesTable";
import { OperacionesMapView } from "@/components/operaciones/OperacionesMapView";
import { OperacionCardView } from "@/components/operaciones/OperacionCardView";
import { List, MapPin, Grid3X3 } from "lucide-react";

export const OperacionesManager = () => {
  const [activeTab, setActiveTab] = useState("table");

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
          <OperacionesTable />
        </TabsContent>
        
        <TabsContent value="cards">
          <OperacionCardView />
        </TabsContent>
        
        <TabsContent value="map">
          <OperacionesMapView />
        </TabsContent>
      </Tabs>
    </div>
  );
};
