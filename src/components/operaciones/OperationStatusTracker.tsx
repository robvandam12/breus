
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Users, 
  FileText,
  Shield,
  Settings
} from "lucide-react";

interface OperationStatus {
  id: string;
  nombre: string;
  estado: 'planificacion' | 'preparacion' | 'ejecucion' | 'finalizacion' | 'completada';
  progreso: number;
  fechaInicio: string;
  fechaFin?: string;
  documentos: {
    hpt: boolean;
    anexoBravo: boolean;
    bitacorasSupervisor: number;
    bitacorasBuzo: number;
  };
  equipo: {
    supervisor: boolean;
    buzos: number;
    equipoCompleto: boolean;
  };
  alertas: number;
}

interface OperationStatusTrackerProps {
  operaciones: OperationStatus[];
}

export const OperationStatusTracker = ({ operaciones }: OperationStatusTrackerProps) => {
  const getEstadoBadge = (estado: OperationStatus['estado']) => {
    switch (estado) {
      case 'planificacion':
        return <Badge className="bg-gray-100 text-gray-800">Planificación</Badge>;
      case 'preparacion':
        return <Badge className="bg-blue-100 text-blue-800">Preparación</Badge>;
      case 'ejecucion':
        return <Badge className="bg-green-100 text-green-800">Ejecución</Badge>;
      case 'finalizacion':
        return <Badge className="bg-yellow-100 text-yellow-800">Finalización</Badge>;
      case 'completada':
        return <Badge className="bg-emerald-100 text-emerald-800">Completada</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconocido</Badge>;
    }
  };

  const getEstadoIcon = (estado: OperationStatus['estado']) => {
    switch (estado) {
      case 'planificacion':
        return <Clock className="w-4 h-4 text-gray-600" />;
      case 'preparacion':
        return <Settings className="w-4 h-4 text-blue-600" />;
      case 'ejecucion':
        return <Activity className="w-4 h-4 text-green-600" />;
      case 'finalizacion':
        return <FileText className="w-4 h-4 text-yellow-600" />;
      case 'completada':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Estado de Operaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {operaciones.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No hay operaciones activas</p>
          </div>
        ) : (
          operaciones.map((operacion) => (
            <div key={operacion.id} className="p-4 border rounded-lg space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getEstadoIcon(operacion.estado)}
                  <div>
                    <h4 className="font-medium">{operacion.nombre}</h4>
                    <p className="text-sm text-gray-600">
                      Inicio: {new Date(operacion.fechaInicio).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {operacion.alertas > 0 && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {operacion.alertas}
                    </Badge>
                  )}
                  {getEstadoBadge(operacion.estado)}
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso General</span>
                  <span>{operacion.progreso}%</span>
                </div>
                <Progress value={operacion.progreso} className="h-2" />
              </div>

              {/* Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="space-y-2">
                  <h5 className="font-medium flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    Documentos
                  </h5>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span>HPT</span>
                      {operacion.documentos.hpt ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Anexo Bravo</span>
                      {operacion.documentos.anexoBravo ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Equipo
                  </h5>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Supervisor</span>
                      {operacion.equipo.supervisor ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Buzos</span>
                      <span className="text-xs">{operacion.equipo.buzos} asignados</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Bitácoras
                  </h5>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Supervisor</span>
                      <span className="text-xs">{operacion.documentos.bitacorasSupervisor}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Buzo</span>
                      <span className="text-xs">{operacion.documentos.bitacorasBuzo}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
