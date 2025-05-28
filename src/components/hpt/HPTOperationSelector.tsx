
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, MapPin, Building, Users, AlertTriangle } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useHPT } from "@/hooks/useHPT";

interface HPTOperationSelectorProps {
  onOperacionSelected: (operacionId: string) => void;
  selectedOperacionId?: string;
}

export const HPTOperationSelector = ({ onOperacionSelected, selectedOperacionId }: HPTOperationSelectorProps) => {
  const { operaciones, isLoading: operacionesLoading } = useOperaciones();
  const { hpts, isLoading: hptsLoading } = useHPT();
  const [selectedOperacion, setSelectedOperacion] = useState<any>(null);

  // Filter operations that don't have HPT
  const operacionesDisponibles = operaciones.filter(op => 
    !hpts.some(hpt => hpt.operacion_id === op.id)
  );

  useEffect(() => {
    if (selectedOperacionId) {
      const operacion = operaciones.find(op => op.id === selectedOperacionId);
      setSelectedOperacion(operacion);
    }
  }, [selectedOperacionId, operaciones]);

  const handleOperacionChange = (operacionId: string) => {
    const operacion = operaciones.find(op => op.id === operacionId);
    setSelectedOperacion(operacion);
    onOperacionSelected(operacionId);
  };

  if (operacionesLoading || hptsLoading) {
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
          <FileText className="w-5 h-5 text-blue-600" />
          Seleccionar Operación para HPT
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
              {operacionesDisponibles.map((operacion) => (
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
          
          {operacionesDisponibles.length === 0 && (
            <div className="flex items-center gap-2 mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <p className="text-sm text-yellow-700">
                No hay operaciones disponibles para crear HPT. Todas las operaciones ya tienen HPT asignado.
              </p>
            </div>
          )}
        </div>

        {selectedOperacion && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-3">Información de la Operación</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Fecha:</span>
                <span>{new Date(selectedOperacion.fecha_inicio).toLocaleDateString('es-CL')}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Salmonera:</span>
                <span>{selectedOperacion.salmoneras?.nombre || 'No especificada'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Sitio:</span>
                <span>{selectedOperacion.sitios?.nombre || 'No especificado'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Contratista:</span>
                <span>{selectedOperacion.contratistas?.nombre || 'No especificado'}</span>
              </div>

              {selectedOperacion.equipo_buceo_id && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Equipo:</span>
                  <Badge className="bg-green-100 text-green-700">Asignado</Badge>
                </div>
              )}
            </div>
            
            {selectedOperacion.tareas && (
              <div className="mt-3">
                <span className="font-medium text-blue-800">Tareas:</span>
                <p className="text-blue-700 mt-1">{selectedOperacion.tareas}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
