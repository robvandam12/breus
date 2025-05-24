
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock, MapPin, Waves, Thermometer } from "lucide-react";
import { Immersion, getEstadoBadge, getTipoBadge, getVisibilidadBadge } from "@/utils/immersionUtils";

interface ImmersionCardProps {
  inmersion: Immersion;
}

export const ImmersionCard = ({ inmersion }: ImmersionCardProps) => {
  return (
    <Card className="ios-card hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
              <Waves className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-zinc-900">{inmersion.codigo}</CardTitle>
              <p className="text-sm text-zinc-500">{inmersion.operacion}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className={getTipoBadge(inmersion.tipo)}>
              {inmersion.tipo}
            </Badge>
            <Badge variant="secondary" className={getEstadoBadge(inmersion.estado)}>
              {inmersion.estado}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <Calendar className="w-4 h-4" />
            <span>{inmersion.fecha} - {inmersion.hora}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <MapPin className="w-4 h-4" />
            <span>{inmersion.sitio}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <Users className="w-4 h-4" />
            <span>Buzo: {inmersion.buzo}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <Users className="w-4 h-4" />
            <span>Asistente: {inmersion.asistente}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <Waves className="w-4 h-4" />
            <span>Profundidad: {inmersion.profundidad}m</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <Clock className="w-4 h-4" />
            <span>Duración: {inmersion.duracion} min</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="outline" className={getVisibilidadBadge(inmersion.visibilidad)}>
              Visibilidad {inmersion.visibilidad}
            </Badge>
            <Badge variant="outline">
              <Thermometer className="w-3 h-3 mr-1" />
              {inmersion.temperatura}°C
            </Badge>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm">
            Ver Bitácora
          </Button>
          <Button variant="outline" size="sm">
            Editar
          </Button>
          {inmersion.estado === "Programada" && (
            <Button size="sm">
              Iniciar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
