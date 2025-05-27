
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MapPin, Building, Clock, Edit, Trash2, Eye, FileText, AlertTriangle } from "lucide-react";
import { Operacion } from "@/hooks/useOperaciones";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface OperacionCardProps {
  operacion: Operacion;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const OperacionCard = ({ operacion, onEdit, onDelete }: OperacionCardProps) => {
  const getEstadoBadge = (estado: string) => {
    const estadoMap: Record<string, { className: string; label: string; bgGradient: string }> = {
      activa: { 
        className: "bg-green-100 text-green-700 border-green-300", 
        label: "Activa",
        bgGradient: "from-green-50 to-green-100"
      },
      pausada: { 
        className: "bg-yellow-100 text-yellow-700 border-yellow-300", 
        label: "Pausada",
        bgGradient: "from-yellow-50 to-yellow-100"
      },
      completada: { 
        className: "bg-blue-100 text-blue-700 border-blue-300", 
        label: "Completada",
        bgGradient: "from-blue-50 to-blue-100"
      },
      cancelada: { 
        className: "bg-red-100 text-red-700 border-red-300", 
        label: "Cancelada",
        bgGradient: "from-red-50 to-red-100"
      }
    };
    return estadoMap[estado] || estadoMap.activa;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  const estadoInfo = getEstadoBadge(operacion.estado);

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-0 shadow-md">
      <div className={`h-1 bg-gradient-to-r ${estadoInfo.bgGradient}`} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-zinc-900 group-hover:text-blue-600 transition-colors">
                {operacion.codigo}
              </CardTitle>
              <p className="text-sm text-zinc-500 font-medium">{operacion.nombre}</p>
            </div>
          </div>
          <Badge variant="outline" className={`${estadoInfo.className} font-medium border`}>
            {estadoInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3 text-sm text-zinc-600 bg-gray-50 p-2 rounded-lg">
            <Building className="w-4 h-4 text-blue-500" />
            <span className="font-medium">Salmonera:</span>
            <span>{operacion.salmoneras?.nombre || "Sin salmonera"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-zinc-600 bg-gray-50 p-2 rounded-lg">
            <MapPin className="w-4 h-4 text-green-500" />
            <span className="font-medium">Sitio:</span>
            <span>{operacion.sitios?.nombre || "Sin sitio"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-zinc-600 bg-gray-50 p-2 rounded-lg">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span className="font-medium">Inicio:</span>
            <span>{formatDate(operacion.fecha_inicio)}</span>
          </div>
          {operacion.fecha_fin && (
            <div className="flex items-center gap-3 text-sm text-zinc-600 bg-gray-50 p-2 rounded-lg">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="font-medium">Fin:</span>
              <span>{formatDate(operacion.fecha_fin)}</span>
            </div>
          )}
          {operacion.contratistas && (
            <div className="flex items-center gap-3 text-sm text-zinc-600 bg-gray-50 p-2 rounded-lg">
              <Users className="w-4 h-4 text-indigo-500" />
              <span className="font-medium">Contratista:</span>
              <span>{operacion.contratistas.nombre}</span>
            </div>
          )}
        </div>

        {/* Equipo Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Equipo de Buceo:</span>
          </div>
          {operacion.equipo_buceo_id ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
              <Users className="w-3 h-3 mr-1" />
              Asignado
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Sin equipo
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex justify-between gap-2 pt-2">
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300">
              <Eye className="w-4 h-4" />
            </Button>
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit} className="hover:bg-green-50 hover:border-green-300">
                <Edit className="w-4 h-4" />
              </Button>
            )}
          </div>
          <Button variant="outline" size="sm" className="hover:bg-gray-50">
            <FileText className="w-4 h-4 mr-1" />
            Documentos
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
