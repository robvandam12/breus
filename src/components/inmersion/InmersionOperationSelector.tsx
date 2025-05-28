
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Anchor, Calendar, MapPin, Building, Users, AlertTriangle } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";

interface InmersionOperationSelectorProps {
  onOperacionSelected: (operacionId: string) => void;
  selectedOperacionId?: string;
}

export const InmersionOperationSelector = ({ onOperacionSelected, selectedOperacionId }: InmersionOperationSelectorProps) => {
  const { operaciones, isLoading } = useOperaciones();
  const [selectedOperacion, setSelectedOperacion] = useState<any>(null);

  // Filter operations that have teams and valid documents
  const operacionesValidas = operaciones.filter(op => 
    op.equipo_buceo_id // Must have a diving team assigned
  );

  const handleOperacionChange = (operacionId: string) => {
    const operacion = operaciones.find(op => op.id === operacionId);
    setSelectedOperacion(operacion);
    onOperacionSelected(operacionId);
  };

  if (isLoading) {
    return (
      <Card className="ios-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-500">Cargando operaciones...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="ios-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Anchor className="w-5 h-5 text-blue-600" />
          Seleccionar Operación para Inmersión
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Operación <span className="text-red-500">*</span>
          </label>
          <Select value={selectedOperacion?.id || ''} onValueChange={handleOperacionChange}>
            <SelectTrigger className="ios-input">
              <SelectValue placeholder="Seleccione una operación" />
            </SelectTrigger>
            <SelectContent>
              {operacionesValidas.map((operacion) => (
                <SelectItem key={operacion.id} value={operacion.id}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{operacion.codigo}</span>
                    <span>-</span>
                    <span>{operacion.nombre}</span>
                    <Badge variant="outline" className="ml-2">
                      {operacion.estado}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {operacionesValidas.length === 0 && (
            <div className="flex items-center gap-2 mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <p className="text-sm text-yellow-700">
                No hay operaciones válidas disponibles. Las operaciones deben tener un equipo de buceo asignado.
              </p>
            </div>
          )}
        </div>

        {selectedOperacion && (
          <Card className="border border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <h3 className="font-medium text-blue-900">Información de la Operación</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Fecha inicio: {new Date(selectedOperacion.fecha_inicio).toLocaleDateString('es-CL')}</span>
              </div>
              
              {selectedOperacion.sitios && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Sitio: {selectedOperacion.sitios.nombre}</span>
                </div>
              )}
              
              {selectedOperacion.contratistas && (
                <div className="flex items-center gap-2 text-sm">
                  <Building className="w-4 h-4 text-blue-600" />
                  <span>Contratista: {selectedOperacion.contratistas.nombre}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Equipo de buceo: {selectedOperacion.equipo_buceo_id ? 'Asignado' : 'No asignado'}</span>
              </div>
              
              <Badge className="bg-blue-100 text-blue-800">
                {selectedOperacion.estado}
              </Badge>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};
