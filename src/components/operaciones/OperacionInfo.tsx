
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Building, Users } from "lucide-react";

interface OperacionInfoProps {
  operacion: any;
}

export const OperacionInfo = ({ operacion }: OperacionInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Información General
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-zinc-600">Código</label>
              <p className="text-zinc-900">{operacion.codigo}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-600">Nombre</label>
              <p className="text-zinc-900">{operacion.nombre}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-600">Estado</label>
              <Badge variant={operacion.estado === 'activa' ? 'default' : 'secondary'}>
                {operacion.estado}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-zinc-600">Fecha Inicio</label>
              <p className="text-zinc-900">
                {operacion.fecha_inicio ? new Date(operacion.fecha_inicio).toLocaleDateString('es-CL') : 'No definida'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-600">Fecha Fin</label>
              <p className="text-zinc-900">
                {operacion.fecha_fin ? new Date(operacion.fecha_fin).toLocaleDateString('es-CL') : 'No definida'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-600">Supervisor Asignado</label>
              <p className="text-zinc-900">{operacion.supervisor_asignado || 'No asignado'}</p>
            </div>
          </div>
        </div>

        {operacion.tareas && (
          <div>
            <label className="text-sm font-medium text-zinc-600">Tareas</label>
            <p className="text-zinc-700 mt-1">{operacion.tareas}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-xs text-zinc-500">Salmonera</p>
              <p className="text-sm font-medium">{operacion.salmonera?.nombre || 'No asignada'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-xs text-zinc-500">Contratista</p>
              <p className="text-sm font-medium">{operacion.contratista?.nombre || 'No asignado'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-600" />
            <div>
              <p className="text-xs text-zinc-500">Sitio</p>
              <p className="text-sm font-medium">{operacion.sitio?.nombre || 'No asignado'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
