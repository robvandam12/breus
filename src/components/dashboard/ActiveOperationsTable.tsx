
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, Calendar, Users, MapPin } from "lucide-react";

interface Operation {
  id: number;
  codigo: string;
  salmonera: string;
  sitio: string;
  fechaInicio: string;
  fechaFin: string;
  supervisor: string;
  buzos: number;
  estado: string;
  prioridad: "Alta" | "Media" | "Baja";
}

interface ActiveOperationsTableProps {
  operations: Operation[];
}

export const ActiveOperationsTable = ({ operations }: ActiveOperationsTableProps) => {
  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Activa":
        return "bg-emerald-100 text-emerald-700";
      case "En Preparación":
        return "bg-amber-100 text-amber-700";
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

  return (
    <Card className="ios-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
              <Building className="w-4 h-4 text-cyan-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-zinc-900">
                Operaciones Activas
              </CardTitle>
              <p className="text-sm text-zinc-500">
                {operations.length} operaciones en curso
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Ver Todas
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Operación</TableHead>
              <TableHead>Sitio</TableHead>
              <TableHead>Fechas</TableHead>
              <TableHead>Equipo</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {operations.map((operation) => (
              <TableRow key={operation.id}>
                <TableCell>
                  <div className="font-medium">{operation.codigo}</div>
                  <div className="text-sm text-zinc-500">{operation.salmonera}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-zinc-600">
                    <MapPin className="w-4 h-4" />
                    <span>{operation.sitio}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-zinc-600">
                    <Calendar className="w-4 h-4" />
                    <div>
                      <div>{operation.fechaInicio}</div>
                      <div className="text-xs text-zinc-500">hasta {operation.fechaFin}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-zinc-600">
                    <Users className="w-4 h-4" />
                    <div>
                      <div>{operation.supervisor}</div>
                      <div className="text-xs text-zinc-500">{operation.buzos} buzos</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getPrioridadBadge(operation.prioridad)}>
                    {operation.prioridad}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getEstadoBadge(operation.estado)}>
                    {operation.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="outline" size="sm">
                      Ver
                    </Button>
                    <Button variant="outline" size="sm">
                      Gestionar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
