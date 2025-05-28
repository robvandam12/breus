
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Anchor, Calendar, MapPin, Building, Users, AlertTriangle, CheckCircle } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useHPT } from "@/hooks/useHPT";
import { useAnexoBravo } from "@/hooks/useAnexoBravo";

interface InmersionOperationSelectorProps {
  onOperacionSelected: (operacionId: string) => void;
  selectedOperacionId?: string;
}

export const InmersionOperationSelector = ({ onOperacionSelected, selectedOperacionId }: InmersionOperationSelectorProps) => {
  const { operaciones, isLoading: operacionesLoading } = useOperaciones();
  const { hpts } = useHPT();
  const { anexosBravo } = useAnexoBravo();
  const [selectedOperacion, setSelectedOperacion] = useState<any>(null);
  const [validationStatus, setValidationStatus] = useState<{
    hasHPT: boolean;
    hasAnexoBravo: boolean;
    canProceed: boolean;
  }>({ hasHPT: false, hasAnexoBravo: false, canProceed: false });

  useEffect(() => {
    if (selectedOperacionId) {
      const operacion = operaciones.find(op => op.id === selectedOperacionId);
      setSelectedOperacion(operacion);
      validateOperation(selectedOperacionId);
    }
  }, [selectedOperacionId, operaciones, hpts, anexosBravo]);

  const validateOperation = (operacionId: string) => {
    const hasSignedHPT = hpts.some(hpt => 
      hpt.operacion_id === operacionId && hpt.firmado
    );
    
    const hasSignedAnexoBravo = anexosBravo.some(anexo => 
      anexo.operacion_id === operacionId && anexo.firmado
    );

    setValidationStatus({
      hasHPT: hasSignedHPT,
      hasAnexoBravo: hasSignedAnexoBravo,
      canProceed: hasSignedHPT && hasSignedAnexoBravo
    });
  };

  const handleOperacionChange = (operacionId: string) => {
    const operacion = operaciones.find(op => op.id === operacionId);
    setSelectedOperacion(operacion);
    validateOperation(operacionId);
    onOperacionSelected(operacionId);
  };

  if (operacionesLoading) {
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
              {operaciones.map((operacion) => (
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
        </div>

        {selectedOperacion && (
          <>
            {/* Validation Status */}
            <div className={`p-4 rounded-lg border ${
              validationStatus.canProceed 
                ? 'bg-green-50 border-green-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                {validationStatus.canProceed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                )}
                <span className={`font-medium ${
                  validationStatus.canProceed ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  {validationStatus.canProceed 
                    ? 'Operación lista para inmersión' 
                    : 'Documentación pendiente'
                  }
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  {validationStatus.hasHPT ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  )}
                  <span className={validationStatus.hasHPT ? 'text-green-700' : 'text-red-700'}>
                    HPT {validationStatus.hasHPT ? 'Firmado' : 'Pendiente'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {validationStatus.hasAnexoBravo ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  )}
                  <span className={validationStatus.hasAnexoBravo ? 'text-green-700' : 'text-red-700'}>
                    Anexo Bravo {validationStatus.hasAnexoBravo ? 'Firmado' : 'Pendiente'}
                  </span>
                </div>
              </div>

              {!validationStatus.canProceed && (
                <p className="text-xs text-yellow-700 mt-2">
                  Para crear una inmersión, la operación debe tener HPT y Anexo Bravo firmados.
                </p>
              )}
            </div>

            {/* Operation Details */}
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
          </>
        )}
      </CardContent>
    </Card>
  );
};
