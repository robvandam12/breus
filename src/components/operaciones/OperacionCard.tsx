
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MapPin, Building, Clock } from "lucide-react";

interface Operacion {
  id: number;
  codigo: string;
  nombre: string;
  salmonera: string;
  sitio: string;
  fechaInicio: string;
  fechaFin: string;
  supervisor: string;
  buzos: number;
  estado: string;
  prioridad: "Alta" | "Media" | "Baja";
  tipo: string;
}

interface OperacionCardProps {
  operacion: Operacion;
}

export const OperacionCard = ({ operacion }: OperacionCardProps) => {
  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Activa":
        return "bg-emerald-100 text-emerald-700";
      case "En Preparación":
        return "bg-amber-100 text-amber-700";
      case "Completada":
        return "bg-blue-100 text-blue-700";
      case "Pausada":
        return "bg-red-100 text-red-700";
      default:
        return "bg-zinc-100 text-zinc-700";
    }
  };

  const getPrioridadBadge = (prioridad: string) => {
    switch (prioridad) {
      case "Alta":
        return "bg-red-100 text-red-700";
      case "Media":
        return "bg-amber-100 text-amber-700";
      case "Baja":
        return "bg-green-100 text-green-700";
      default:
        return "bg-zinc-100 text-zinc-700";
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case "Mantenimiento":
        return "bg-purple-100 text-purple-700";
      case "Inspección":
        return "bg-cyan-100 text-cyan-700";
      case "Limpieza":
        return "bg-green-100 text-green-700";
      case "Emergencia":
        return "bg-red-100 text-red-700";
      default:
        return "bg-zinc-100 text-zinc-700";
    }
  };

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
          <div className="flex flex-col gap-2">
            <Badge variant="outline" className={getPrioridadBadge(operacion.prioridad)}>
              {operacion.prioridad}
            </Badge>
            <Badge variant="secondary" className={getEstadoBadge(operacion.estado)}>
              {operacion.estado}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <Building className="w-4 h-4" />
            <span>{operacion.salmonera}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <MapPin className="w-4 h-4" />
            <span>{operacion.sitio}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <Calendar className="w-4 h-4" />
            <span>{operacion.fechaInicio}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <Clock className="w-4 h-4" />
            <span>Hasta {operacion.fechaFin}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <Users className="w-4 h-4" />
            <span>{operacion.supervisor}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <Users className="w-4 h-4" />
            <span>{operacion.buzos} buzos</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <Badge variant="outline" className={getTipoBadge(operacion.tipo)}>
            {operacion.tipo}
          </Badge>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm">
            Ver Detalles
          </Button>
          <Button variant="outline" size="sm">
            Editar
          </Button>
          {operacion.estado === "En Preparación" && (
            <Button size="sm">
              Activar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
