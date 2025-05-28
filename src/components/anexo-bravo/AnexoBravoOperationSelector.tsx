
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, MapPin, Building, Users } from "lucide-react";
import { useOperacionValidation } from "@/hooks/useOperacionValidation";

interface AnexoBravoOperationSelectorProps {
  onOperacionSelected: (operacionData: any) => void;
  selectedOperacionId?: string;
}

export const AnexoBravoOperationSelector = ({ onOperacionSelected, selectedOperacionId }: AnexoBravoOperationSelectorProps) => {
  const { operacionesConDocumentos, getOperacionesDisponiblesParaAnexoBravo, isLoading } = useOperacionValidation();
  const [selectedOperacion, setSelectedOperacion] = useState<any>(null);

  const operacionesDisponibles = getOperacionesDisponiblesParaAnexoBravo();

  useEffect(() => {
    if (selectedOperacionId) {
      const operacion = operacionesConDocumentos.find(op => op.id === selectedOperacionId);
      setSelectedOperacion(operacion);
      if (operacion) {
        onOperacionSelected(operacion);
      }
    }
  }, [selectedOperacionId, operacionesConDocumentos, onOperacionSelected]);

  const handleOperacionChange = (operacionId: string) => {
    const operacion = operacionesConDocumentos.find(op => op.id === operacionId);
    setSelectedOperacion(operacion);
    if (operacion) {
      // Preparar datos completos para autopopulación
      const operacionData = {
        id: operacion.id,
        codigo: operacion.codigo,
        nombre: operacion.nombre,
        fecha_inicio: operacion.fecha_inicio,
        salmonera: operacion.salmoneras?.nombre || '',
        sitio: operacion.sitios?.nombre || '',
        contratista: operacion.contratistas?.nombre || '',
        tareas: operacion.tareas || '',
        salmonera_id: operacion.salmonera_id,
        sitio_id: operacion.sitio_id,
        contratista_id: operacion.contratista_id,
        equipo_buceo_id: operacion.equipo_buceo_id
      };
      onOperacionSelected(operacionData);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm bg-gray-50/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
            <p className="ml-3 text-gray-600 text-sm">Cargando operaciones...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <FileText className="w-5 h-5 text-blue-600" />
            Seleccionar Operación para Anexo Bravo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operación <span className="text-red-500">*</span>
            </label>
            <Select value={selectedOperacion?.id || ''} onValueChange={handleOperacionChange}>
              <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Seleccione una operación" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg">
                {operacionesDisponibles.map((operacion) => (
                  <SelectItem key={operacion.id} value={operacion.id} className="py-3">
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{operacion.codigo}</span>
                          <span className="text-gray-400">-</span>
                          <span className="text-gray-700">{operacion.nombre}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span>{operacion.salmoneras?.nombre}</span>
                          <span>•</span>
                          <span>{new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {operacion.estado}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {operacionesDisponibles.length === 0 && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  No hay operaciones disponibles para crear Anexo Bravo. Todas las operaciones ya tienen Anexo Bravo asignado.
                </p>
              </div>
            )}
          </div>

          {selectedOperacion && (
            <Card className="border border-blue-100 bg-blue-50/50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Información de la Operación
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="font-medium text-blue-800">Fecha:</span>
                    <span className="text-blue-700">{new Date(selectedOperacion.fecha_inicio).toLocaleDateString('es-CL')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="font-medium text-blue-800">Salmonera:</span>
                    <span className="text-blue-700">{selectedOperacion.salmoneras?.nombre || 'No especificada'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="font-medium text-blue-800">Sitio:</span>
                    <span className="text-blue-700">{selectedOperacion.sitios?.nombre || 'No especificado'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="font-medium text-blue-800">Contratista:</span>
                    <span className="text-blue-700">{selectedOperacion.contratistas?.nombre || 'No especificado'}</span>
                  </div>
                </div>
                
                {selectedOperacion.tareas && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <span className="font-medium text-blue-800 text-sm">Descripción de Tareas:</span>
                    <p className="text-blue-700 text-sm mt-1 leading-relaxed">{selectedOperacion.tareas}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
