
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Waves, Thermometer } from "lucide-react";
import { Immersion, getEstadoBadge, getTipoBadge, getVisibilidadBadge } from "@/utils/immersionUtils";

interface ImmersionTableRowProps {
  inmersion: Immersion;
}

export const ImmersionTableRow = ({ inmersion }: ImmersionTableRowProps) => {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
            <Waves className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="font-medium">{inmersion.codigo}</div>
        </div>
      </TableCell>
      <TableCell className="text-zinc-600">{inmersion.operacion}</TableCell>
      <TableCell className="text-zinc-600 text-xs">
        {inmersion.fecha}<br/>
        {inmersion.hora}
      </TableCell>
      <TableCell className="text-zinc-600">{inmersion.sitio}</TableCell>
      <TableCell className="text-zinc-600">{inmersion.buzo}</TableCell>
      <TableCell className="text-zinc-600">{inmersion.asistente}</TableCell>
      <TableCell className="text-zinc-600">{inmersion.profundidad}m</TableCell>
      <TableCell className="text-zinc-600">{inmersion.duracion} min</TableCell>
      <TableCell>
        <div className="space-y-1">
          <Badge variant="outline" className={getVisibilidadBadge(inmersion.visibilidad)}>
            {inmersion.visibilidad}
          </Badge>
          <div className="text-xs text-zinc-500">
            <Thermometer className="w-3 h-3 inline mr-1" />
            {inmersion.temperatura}°C
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={getTipoBadge(inmersion.tipo)}>
          {inmersion.tipo}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className={getEstadoBadge(inmersion.estado)}>
          {inmersion.estado}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button variant="outline" size="sm">
            Ver
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
      </TableCell>
    </TableRow>
  );
};
