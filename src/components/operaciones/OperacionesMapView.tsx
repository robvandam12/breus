
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";
import { SimpleMap } from "@/components/ui/simple-map";

export const OperacionesMapView = () => {
  const { operaciones, isLoading } = useOperaciones();
  const [selectedLocation, setSelectedLocation] = useState({ lat: -35.675147, lng: -71.542969 });

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Mapa de Operaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleMap
            onLocationSelect={handleLocationSelect}
            initialLat={selectedLocation.lat}
            initialLng={selectedLocation.lng}
            height="400px"
          />
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Ubicación seleccionada:</strong> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {operaciones.map((operacion) => (
          <Card key={operacion.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-sm">{operacion.nombre}</h3>
                <Badge variant={operacion.estado === 'activa' ? 'default' : 'secondary'}>
                  {operacion.estado}
                </Badge>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>Chile - Región {Math.floor(Math.random() * 15) + 1}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>Equipo asignado</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
