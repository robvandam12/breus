
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, MapPin, Users } from "lucide-react";
import { useOperacionValidation } from "@/hooks/useOperacionValidation";

interface AnexoBravoOperationSelectorProps {
  selectedOperacionId: string;
  onSelectOperacion: (operacionId: string) => void;
  onCreateAnexoBravo: () => void;
}

export const AnexoBravoOperationSelector = ({ 
  selectedOperacionId, 
  onSelectOperacion, 
  onCreateAnexoBravo 
}: AnexoBravoOperationSelectorProps) => {
  const { 
    operacionesConDocumentos, 
    getOperacionesDisponiblesParaAnexoBravo 
  } = useOperacionValidation();

  const operacionesDisponibles = getOperacionesDisponiblesParaAnexoBravo();
  const selectedOperacion = operacionesConDocumentos.find(op => op.id === selectedOperacionId);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Seleccionar Operación para Anexo Bravo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Select value={selectedOperacionId} onValueChange={onSelectOperacion}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una operación para crear Anexo Bravo..." />
              </SelectTrigger>
              <SelectContent>
                {operacionesDisponibles.map((operacion) => (
                  <SelectItem key={operacion.id} value={operacion.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{operacion.codigo}</span>
                      <span>-</span>
                      <span>{operacion.nombre}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={onCreateAnexoBravo}
            disabled={!selectedOperacionId}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <FileText className="w-4 h-4 mr-2" />
            Crear Anexo Bravo
          </Button>
        </div>

        {selectedOperacion && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3">Información de la Operación</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Fecha:</span>
                <span>{new Date(selectedOperacion.fecha_inicio).toLocaleDateString('es-CL')}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Sitio:</span>
                <span>{selectedOperacion.sitios?.nombre || 'No asignado'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Equipo:</span>
                {selectedOperacion.equipo_buceo_id ? (
                  <Badge variant="outline" className="bg-green-100 text-green-700">
                    Asignado
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-100 text-red-700">
                    Sin equipo
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-medium">Contratista:</span>
                <span>{selectedOperacion.contratistas?.nombre || 'No asignado'}</span>
              </div>
            </div>
            
            {selectedOperacion.tareas && (
              <div className="mt-3">
                <span className="font-medium text-blue-900">Tareas:</span>
                <p className="text-blue-700 mt-1">{selectedOperacion.tareas}</p>
              </div>
            )}
          </div>
        )}

        {operacionesDisponibles.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p>No hay operaciones disponibles para crear Anexo Bravo</p>
            <p className="text-sm">Todas las operaciones ya tienen Anexo Bravo asociado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
