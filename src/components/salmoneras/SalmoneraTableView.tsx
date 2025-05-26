
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Edit, Trash2, Eye } from "lucide-react";
import { Salmonera } from "@/hooks/useSalmoneras";

interface SalmoneraTableViewProps {
  salmoneras: Salmonera[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect?: (salmonera: Salmonera) => void;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

export const SalmoneraTableView = ({ 
  salmoneras, 
  onEdit, 
  onDelete, 
  onSelect,
  isDeleting = false, 
  isUpdating = false 
}: SalmoneraTableViewProps) => {
  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'activa':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'inactiva':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'suspendida':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Empresa</TableHead>
          <TableHead>RUT</TableHead>
          <TableHead>Contacto</TableHead>
          <TableHead>Sitios</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {salmoneras.map((salmonera) => (
          <TableRow key={salmonera.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800">
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-zinc-600" />
                </div>
                <div>
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">
                    {salmonera.nombre}
                  </div>
                  <div className="text-sm text-zinc-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {salmonera.direccion}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell className="font-mono text-sm text-zinc-600 dark:text-zinc-400">
              {salmonera.rut}
            </TableCell>
            <TableCell>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                {salmonera.telefono && <div>{salmonera.telefono}</div>}
                {salmonera.email && <div className="truncate max-w-[200px]">{salmonera.email}</div>}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-blue-100 text-blue-700">
                {salmonera.sitios_activos} sitios
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className={getEstadoBadgeColor(salmonera.estado)}>
                {salmonera.estado.charAt(0).toUpperCase() + salmonera.estado.slice(1)}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                {onSelect && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onSelect(salmonera)}
                    className="touch-target"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(salmonera.id)}
                  disabled={isUpdating}
                  className="touch-target"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onDelete(salmonera.id)}
                  disabled={isDeleting}
                  className="touch-target text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
