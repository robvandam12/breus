
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Clock, Building, Users } from "lucide-react";

interface InmersionData {
  inmersion_id: string;
  codigo: string;
  fecha_inmersion: string;
  objetivo: string;
  supervisor: string;
  buzo_principal: string;
  hora_inicio: string;
  hora_fin?: string;
  operacion: any;
  equipo_buceo_id?: string;
}

interface InmersionContextInfoProps {
  inmersionData: InmersionData;
}

export const InmersionContextInfo = ({ inmersionData }: InmersionContextInfoProps) => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <h4 className="font-medium text-blue-900 mb-2">Información de Contexto</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span><strong>Inmersión:</strong> {inmersionData.codigo}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span><strong>Fecha:</strong> {new Date(inmersionData.fecha_inmersion).toLocaleDateString('es-CL')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span><strong>Horario:</strong> {inmersionData.hora_inicio} - {inmersionData.hora_fin || 'En curso'}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span><strong>Operación:</strong> {inmersionData.operacion?.nombre || 'Sin operación'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span><strong>Buzo Principal:</strong> {inmersionData.buzo_principal}</span>
            </div>
            {inmersionData.operacion?.equipos_buceo && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600" />
                <span><strong>Equipo:</strong> {inmersionData.operacion.equipos_buceo.nombre}</span>
                <Badge variant="outline" className="bg-green-100 text-green-700 text-xs">
                  Equipo Asignado
                </Badge>
              </div>
            )}
          </div>
        </div>
        <div className="mt-3">
          <span className="font-medium">Objetivo:</span>
          <p className="text-sm text-blue-800 mt-1">{inmersionData.objetivo}</p>
        </div>
      </CardContent>
    </Card>
  );
};
