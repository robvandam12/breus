
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, Edit, Trash2, Eye } from "lucide-react";
import { Salmonera } from "@/hooks/useSalmoneras";

interface SalmoneraTableViewProps {
  salmoneras: Salmonera[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewSitios: (id: string) => void;
  isDeleting: boolean;
  isUpdating: boolean;
}

export const SalmoneraTableView = ({ 
  salmoneras, 
  onEdit, 
  onDelete, 
  onViewSitios,
  isDeleting, 
  isUpdating 
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
    <Card className="ios-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empresa</TableHead>
            <TableHead>RUT</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-center">Sitios</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salmoneras.map((salmonera) => (
            <TableRow key={salmonera.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-zinc-600" />
                  </div>
                  <div>
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{salmonera.nombre}</div>
                    <div className="text-sm text-zinc-500">ID: {salmonera.id.slice(0, 8)}...</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-zinc-600 dark:text-zinc-400 font-mono">
                {salmonera.rut}
              </TableCell>
              <TableCell className="text-zinc-600 dark:text-zinc-400 max-w-xs truncate">
                {salmonera.direccion}
              </TableCell>
              <TableCell className="text-zinc-600 dark:text-zinc-400">
                {salmonera.telefono || '-'}
              </TableCell>
              <TableCell className="text-zinc-600 dark:text-zinc-400">
                {salmonera.email || '-'}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewSitios(salmonera.id)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  {salmonera.sitios_activos}
                </Button>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={`${getEstadoBadgeColor(salmonera.estado)} font-medium`}
                >
                  {salmonera.estado.charAt(0).toUpperCase() + salmonera.estado.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onViewSitios(salmonera.id)}
                    className="touch-target"
                    title="Ver sitios"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onEdit(salmonera.id)}
                    disabled={isUpdating}
                    className="touch-target"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDelete(salmonera.id)}
                    disabled={isDeleting}
                    className="touch-target text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
