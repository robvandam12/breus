
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OperacionCard } from "./OperacionCard";
import { OperacionDetails } from "./OperacionDetails";
import { OperacionesMapView } from "./OperacionesMapView";
import { OperacionesCalendarView } from "./OperacionesCalendarView";
import { useOperaciones } from "@/hooks/useOperaciones";
import { Calendar, Eye, MapPin, CalendarDays } from "lucide-react";

export const OperacionesManager = () => {
  const { operaciones, isLoading } = useOperaciones();
  const [selectedOperacion, setSelectedOperacion] = useState<string | null>(null);
  const [activeView, setActiveView] = useState('lista');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Gestión de Operaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeView} onValueChange={setActiveView}>
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="lista">Lista</TabsTrigger>
              <TabsTrigger value="mapa">Mapa</TabsTrigger>
              <TabsTrigger value="calendario">Calendario</TabsTrigger>
            </TabsList>

            <TabsContent value="lista" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {operaciones.map((operacion) => (
                  <div key={operacion.id} className="relative">
                    <OperacionCard 
                      operacion={operacion}
                      onEdit={() => {}}
                      onDelete={() => {}}
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedOperacion(operacion.id)}
                        className="bg-white/90 backdrop-blur-sm"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {operaciones.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay operaciones disponibles</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="mapa" className="mt-6">
              <OperacionesMapView />
            </TabsContent>

            <TabsContent value="calendario" className="mt-6">
              <OperacionesCalendarView />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog para detalles de operación */}
      <Dialog open={!!selectedOperacion} onOpenChange={() => setSelectedOperacion(null)}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          {selectedOperacion && (
            <OperacionDetails
              operacionId={selectedOperacion}
              onClose={() => setSelectedOperacion(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
