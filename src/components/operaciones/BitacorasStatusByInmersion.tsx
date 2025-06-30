
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, User, Users, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { useBitacorasSupervisor } from "@/hooks/useBitacorasSupervisor";
import { useBitacorasBuzo } from "@/hooks/useBitacorasBuzo";

interface BitacorasStatusByInmersionProps {
  inmersionId: string;
  inmersionCodigo: string;
  onCreateSupervisorBitacora?: () => void;
  onCreateBuzoBitacora?: () => void;
}

export const BitacorasStatusByInmersion = ({ 
  inmersionId, 
  inmersionCodigo,
  onCreateSupervisorBitacora,
  onCreateBuzoBitacora
}: BitacorasStatusByInmersionProps) => {
  const { bitacorasSupervisor } = useBitacorasSupervisor();
  const { bitacorasBuzo } = useBitacorasBuzo();

  // Encontrar bitácoras relacionadas con esta inmersión
  const bitacoraSupervisor = bitacorasSupervisor.find(bs => bs.inmersion_id === inmersionId);
  const bitacorasBuzoInmersion = bitacorasBuzo.filter(bb => bb.inmersion_id === inmersionId);

  // Calcular estadísticas
  const cuadrillaSize = bitacoraSupervisor?.datos_cuadrilla?.length || 0;
  const buzosWithBitacora = bitacorasBuzoInmersion.length;
  const pendingBuzosBitacoras = Math.max(0, cuadrillaSize - buzosWithBitacora);

  const getStatusIcon = (condition: boolean) => {
    return condition ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <Clock className="w-4 h-4 text-amber-600" />
    );
  };

  const getStatusBadge = (condition: boolean, completedText: string, pendingText: string) => {
    return condition ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        {completedText}
      </Badge>
    ) : (
      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
        {pendingText}
      </Badge>
    );
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Estado de Bitácoras - {inmersionCodigo}
          </div>
          <div className="flex gap-2">
            {/* Botones de acción */}
            {!bitacoraSupervisor && onCreateSupervisorBitacora && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onCreateSupervisorBitacora}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <User className="w-3 h-3 mr-1" />
                Crear Supervisor
              </Button>
            )}
            {bitacoraSupervisor?.firmado && pendingBuzosBitacoras > 0 && onCreateBuzoBitacora && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onCreateBuzoBitacora}
                className="text-teal-600 border-teal-200 hover:bg-teal-50"
              >
                <Users className="w-3 h-3 mr-1" />
                Crear Buzo
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Status Bitácora Supervisor */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(!!bitacoraSupervisor?.firmado)}
            <div>
              <p className="font-medium text-sm">Bitácora de Supervisor</p>
              <p className="text-xs text-gray-600">
                {bitacoraSupervisor ? 
                  `Código: ${bitacoraSupervisor.codigo}` : 
                  'No existe bitácora de supervisor'
                }
              </p>
            </div>
          </div>
          <div className="text-right">
            {bitacoraSupervisor ? (
              getStatusBadge(
                bitacoraSupervisor.firmado, 
                'Firmada', 
                'Sin firmar'
              )
            ) : (
              <Badge variant="secondary">Pendiente</Badge>
            )}
          </div>
        </div>

        {/* Status Bitácoras de Buzo */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(pendingBuzosBitacoras === 0 && cuadrillaSize > 0)}
            <div>
              <p className="font-medium text-sm">Bitácoras de Buzos</p>
              <p className="text-xs text-gray-600">
                {cuadrillaSize > 0 ? 
                  `${buzosWithBitacora} de ${cuadrillaSize} buzos han completado su bitácora` :
                  'No hay cuadrilla definida en bitácora supervisor'
                }
              </p>
            </div>
          </div>
          <div className="text-right">
            <Badge className={
              pendingBuzosBitacoras === 0 && cuadrillaSize > 0 ? 
              "bg-green-100 text-green-800 border-green-200" : 
              "bg-amber-100 text-amber-800 border-amber-200"
            }>
              {buzosWithBitacora}/{cuadrillaSize}
            </Badge>
          </div>
        </div>

        {/* Detalles de cuadrilla si existe */}
        {bitacoraSupervisor?.datos_cuadrilla && bitacoraSupervisor.datos_cuadrilla.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs font-medium text-gray-700 mb-2">Miembros de Cuadrilla:</p>
            <div className="grid grid-cols-1 gap-1">
              {bitacoraSupervisor.datos_cuadrilla.map((member, index) => {
                const hasBitacora = bitacorasBuzoInmersion.some(bb => 
                  bb.buzo === member.nombre || bb.buzo_rut === member.matricula
                );
                
                return (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        hasBitacora ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      {member.nombre} ({member.rol})
                    </span>
                    {hasBitacora ? (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    ) : (
                      <Clock className="w-3 h-3 text-gray-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Advertencias */}
        {!bitacoraSupervisor && (
          <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-800">Bitácora supervisor requerida</p>
              <p className="text-amber-700">
                Debe crear y firmar la bitácora de supervisor antes de que los buzos puedan crear sus bitácoras individuales.
              </p>
            </div>
          </div>
        )}

        {bitacoraSupervisor && !bitacoraSupervisor.firmado && (
          <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-800">Firma pendiente</p>
              <p className="text-amber-700">
                La bitácora de supervisor debe ser firmada para habilitar la creación de bitácoras de buzo.
              </p>
            </div>
          </div>
        )}

        {/* Resumen general */}
        <div className="pt-2 border-t text-xs text-gray-500">
          <div className="flex justify-between">
            <span>Estado general:</span>
            <span className={
              bitacoraSupervisor?.firmado && pendingBuzosBitacoras === 0 && cuadrillaSize > 0 ?
              "text-green-600 font-medium" : "text-amber-600 font-medium"
            }>
              {bitacoraSupervisor?.firmado && pendingBuzosBitacoras === 0 && cuadrillaSize > 0 ?
                'Completado' : 'En progreso'
              }
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
