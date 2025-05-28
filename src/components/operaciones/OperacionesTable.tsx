
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Eye, Trash2, Users } from "lucide-react";
import { EditOperacionDialog } from "./EditOperacionDialog";
import { useRouter } from "@/hooks/useRouter";

interface OperacionesTableProps {
  operaciones: any[];
  onDelete: (id: string) => void;
}

export const OperacionesTable = ({ operaciones, onDelete }: OperacionesTableProps) => {
  const router = useRouter();
  const [editingOperacion, setEditingOperacion] = useState<any>(null);

  const getEstadoBadge = (estado: string) => {
    const colors: Record<string, string> = {
      activa: 'bg-green-100 text-green-700',
      completada: 'bg-blue-100 text-blue-700',
      cancelada: 'bg-red-100 text-red-700',
      suspendida: 'bg-yellow-100 text-yellow-700',
    };
    return colors[estado] || 'bg-gray-100 text-gray-700';
  };

  const handleViewDetails = (operacion: any) => {
    router.navigateTo(`/operaciones/${operacion.id}`);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Operación</TableHead>
            <TableHead>Salmonera</TableHead>
            <TableHead>Contratista</TableHead>
            <TableHead>Sitio</TableHead>
            <TableHead>Fechas</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Equipo</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {operaciones.map((operacion) => (
            <TableRow key={operacion.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{operacion.nombre}</div>
                  <div className="text-sm text-zinc-500">{operacion.codigo}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {operacion.salmoneras?.nombre || 'No asignada'}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {operacion.contratistas?.nombre || 'No asignado'}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {operacion.sitios?.nombre || 'No asignado'}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-xs">
                  <div>Inicio: {new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}</div>
                  {operacion.fecha_fin && (
                    <div>Fin: {new Date(operacion.fecha_fin).toLocaleDateString('es-CL')}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getEstadoBadge(operacion.estado)}>
                  {operacion.estado}
                </Badge>
              </TableCell>
              <TableCell>
                {operacion.equipo_buceo_id ? (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">Asignado</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">Sin equipo</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(operacion)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalles
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setEditingOperacion(operacion)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(operacion.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingOperacion && (
        <EditOperacionDialog
          operacion={editingOperacion}
          isOpen={!!editingOperacion}
          onClose={() => setEditingOperacion(null)}
        />
      )}
    </>
  );
};
