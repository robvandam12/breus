
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Users, CheckCircle, AlertTriangle } from "lucide-react";
import type { OperacionFull } from "@/hooks/useOperacionDetails";

interface OperacionResumenTabProps {
  operacion: OperacionFull;
  compliance: {
    hasTeam: boolean;
    hasValidHPT: boolean;
    hasValidAnexo: boolean;
    canExecute: boolean;
  } | null;
}

export const OperacionResumenTab: React.FC<OperacionResumenTabProps> = ({ operacion, compliance }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm">Sitio: {operacion.sitio_nombre || 'No asignado'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm">Contratista: {operacion.contratista_nombre || 'No asignado'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm">
              Fecha inicio: {new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}
            </span>
          </div>
          {operacion.fecha_fin && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm">
                Fecha fin: {new Date(operacion.fecha_fin).toLocaleDateString('es-CL')}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Estado de Cumplimiento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Equipo Asignado</span>
            {compliance?.hasTeam ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">HPT Válido</span>
            {compliance?.hasValidHPT ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Anexo Bravo Válido</span>
            {compliance?.hasValidAnexo ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Puede Ejecutar Inmersiones</span>
            {compliance?.canExecute ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
