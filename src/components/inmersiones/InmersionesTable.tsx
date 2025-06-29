
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye } from 'lucide-react';
import type { Inmersion } from '@/hooks/useInmersiones';

interface InmersionesTableProps {
  inmersiones: Inmersion[];
  onEdit: (inmersion: Inmersion) => void;
  onView: (inmersion: Inmersion) => void;
  onDelete: (inmersion: Inmersion) => void;
}

export const InmersionesTable = ({
  inmersiones,
  onEdit,
  onView,
  onDelete
}: InmersionesTableProps) => {

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'planificada':
        return 'default';
      case 'en_progreso':
        return 'secondary';
      case 'completada':
        return 'outline';
      case 'cancelada':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatFecha = (fecha?: string) => {
    if (!fecha) return 'No definida';
    return new Date(fecha).toLocaleDateString('es-CL');
  };

  return (
    <div className="rounded-2xl border border-gray-200/50 overflow-hidden bg-white/80 backdrop-blur-sm ios-card">
      <Table>
        <TableHeader className="bg-gray-50/80">
          <TableRow className="hover:bg-gray-50/50">
            <TableHead className="font-semibold text-gray-700">Código</TableHead>
            <TableHead className="font-semibold text-gray-700">Objetivo</TableHead>
            <TableHead className="font-semibold text-gray-700">Operación</TableHead>
            <TableHead className="font-semibold text-gray-700">Buzo Principal</TableHead>
            <TableHead className="font-semibold text-gray-700">Estado</TableHead>
            <TableHead className="font-semibold text-gray-700">Fecha</TableHead>
            <TableHead className="font-semibold text-gray-700">Prof. Máx</TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inmersiones.map((inmersion) => (
            <TableRow key={inmersion.inmersion_id} className="hover:bg-blue-50/30 transition-colors">
              <TableCell>
                <div className="font-mono text-sm text-gray-600">
                  {inmersion.codigo}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-gray-900">{inmersion.objetivo}</p>
                  {inmersion.external_operation_code && (
                    <p className="text-sm text-gray-600">
                      Ext: {inmersion.external_operation_code}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-gray-700">
                {inmersion.operacion?.nombre || inmersion.operacion_nombre || 'Independiente'}
              </TableCell>
              <TableCell className="text-gray-700">
                {inmersion.buzo_principal || 'No asignado'}
              </TableCell>
              <TableCell>
                <Badge variant={getEstadoBadgeVariant(inmersion.estado)}>
                  {inmersion.estado.replace('_', ' ').toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-700">
                {formatFecha(inmersion.fecha_inmersion)}
              </TableCell>
              <TableCell className="text-gray-700">
                {inmersion.profundidad_max}m
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-1 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(inmersion)}
                    className="h-8 w-8 p-0 hover:bg-blue-100 ios-button"
                  >
                    <Eye className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(inmersion)}
                    className="h-8 w-8 p-0 hover:bg-orange-100 ios-button"
                  >
                    <Edit className="h-4 w-4 text-orange-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(inmersion)}
                    className="h-8 w-8 p-0 hover:bg-red-100 ios-button"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
