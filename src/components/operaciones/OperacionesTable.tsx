
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { OperacionesActions } from "./OperacionesActions";

interface OperacionesTableProps {
  operaciones: any[];
  onViewDetail: (operacion: any) => void;
  onEdit: (operacion: any) => void;
  onDelete: (operacionId: string) => void;
}

export const OperacionesTable = ({ operaciones, onViewDetail, onEdit, onDelete }: OperacionesTableProps) => {
  const getEstadoBadgeColor = (estado: string) => {
    const colors: Record<string, string> = {
      activa: 'bg-green-100 text-green-700',
      pausada: 'bg-yellow-100 text-yellow-700',
      completada: 'bg-blue-100 text-blue-700',
      cancelada: 'bg-red-100 text-red-700',
      eliminada: 'bg-gray-100 text-gray-700',
    };
    return colors[estado] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="ios-table-container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Salmonera</TableHead>
            <TableHead>Sitio</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha Inicio</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {operaciones.map((operacion) => (
            <TableRow key={operacion.id}>
              <TableCell>
                <div className="font-medium">{operacion.codigo}</div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{operacion.nombre}</div>
                {operacion.tareas && (
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {operacion.tareas}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {operacion.salmoneras?.nombre || 'No asignada'}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {operacion.sitios?.nombre || 'No asignado'}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getEstadoBadgeColor(operacion.estado)}>
                  {operacion.estado}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}
              </TableCell>
              <TableCell className="text-right">
                <OperacionesActions
                  onView={() => onViewDetail(operacion)}
                  onEdit={() => onEdit(operacion)}
                  onDelete={() => onDelete(operacion.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
