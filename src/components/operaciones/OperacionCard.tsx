
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MapPin, Building, Clock, Edit, Trash2, Eye } from "lucide-react";
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
    const estadoMap: Record<string, { className: string; label: string }> = {
      activa: { className: "bg-green-100 text-green-700", label: "Activa" },
      pausada: { className: "bg-yellow-100 text-yellow-700", label: "Pausada" },
      completada: { className: "bg-blue-100 text-blue-700", label: "Completada" },
      cancelada: { className: "bg-red-100 text-red-700", label: "Cancelada" }
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
    <Card className="ios-card hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-zinc-900">{operacion.codigo}</CardTitle>
              <p className="text-sm text-zinc-500">{operacion.nombre}</p>
            </div>
          </div>
          <Badge variant="secondary" className={estadoInfo.className}>
            {estadoInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <Building className="w-4 h-4" />
            <span>{operacion.salmoneras?.nombre || "Sin salmonera"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <MapPin className="w-4 h-4" />
            <span>{operacion.sitios?.nombre || "Sin sitio"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(operacion.fecha_inicio)}</span>
          </div>
          {operacion.fecha_fin && (
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <Clock className="w-4 h-4" />
              <span>Hasta {formatDate(operacion.fecha_fin)}</span>
            </div>
          )}
          {operacion.contratistas && (
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <Users className="w-4 h-4" />
              <span>{operacion.contratistas.nombre}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button variant="outline" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
