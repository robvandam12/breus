import { useState, useMemo, useRef } from "react";
import { useVirtualizer } from '@tanstack/react-virtual';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { OperacionesActions } from "./OperacionesComponents";
import { ArrowUp, ArrowDown, ListX } from "lucide-react";
import type { OperacionConRelaciones } from "@/hooks/useOperaciones";

interface OperacionesTableProps {
  operaciones: OperacionConRelaciones[];
  onViewDetail: (operacion: OperacionConRelaciones) => void;
  onEdit: (operacion: OperacionConRelaciones) => void;
  onDelete: (operacionId: string) => void;
}

export const OperacionesTable = ({ operaciones, onViewDetail, onEdit, onDelete }: OperacionesTableProps) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof OperacionConRelaciones | string; direction: 'ascending' | 'descending' } | null>({ key: 'created_at', direction: 'descending' });
  
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
  
  const sortedOperaciones = useMemo(() => {
    let sortableItems = [...operaciones];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const key = sortConfig.key;
        let aValue: any;
        let bValue: any;

        if (key === 'salmoneras.nombre') {
          aValue = a.salmoneras?.nombre || '';
          bValue = b.salmoneras?.nombre || '';
        } else if (key === 'sitios.nombre') {
          aValue = a.sitios?.nombre || '';
          bValue = b.sitios?.nombre || '';
        } else {
          aValue = a[key as keyof OperacionConRelaciones];
          bValue = b[key as keyof OperacionConRelaciones];
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [operaciones, sortConfig]);

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: sortedOperaciones.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 73, // Altura estimada de la fila en píxeles
    overscan: 5,
  });

  const requestSort = (key: keyof OperacionConRelaciones | string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const renderSortArrow = (key: keyof OperacionConRelaciones | string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? <ArrowUp className="w-4 h-4 ml-1 text-gray-600" /> : <ArrowDown className="w-4 h-4 ml-1 text-gray-600" />;
  };

  const columns = [
    { key: 'codigo', label: 'Código' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'salmoneras.nombre', label: 'Salmonera' },
    { key: 'sitios.nombre', label: 'Sitio' },
    { key: 'estado', label: 'Estado' },
    { key: 'fecha_inicio', label: 'Fecha Inicio' },
  ];

  if (operaciones.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg">
        <ListX className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-800 mb-2">No se encontraron operaciones</h3>
        <p className="text-gray-500">Intenta ajustar los filtros de búsqueda o crea una nueva operación.</p>
      </div>
    );
  }

  return (
    <div ref={parentRef} className="h-[70vh] overflow-auto rounded-lg border relative">
      <table className="w-full caption-bottom text-sm" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
        <TableHeader className="sticky top-0 bg-gray-50 z-10">
          <TableRow>
            {columns.map(col => (
               <TableHead key={col.key} onClick={() => requestSort(col.key)} className="cursor-pointer select-none hover:bg-gray-100 transition-colors">
                 <div className="flex items-center">
                   {col.label}
                   {renderSortArrow(col.key)}
                 </div>
               </TableHead>
            ))}
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rowVirtualizer.getVirtualItems().map(virtualItem => {
            const operacion = sortedOperaciones[virtualItem.index];
            return (
              <TableRow
                key={operacion.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                className="hover:bg-gray-50"
              >
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
                  <Badge className={getEstadoBadgeColor(operacion.estado)} variant="outline">
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
            );
          })}
        </TableBody>
      </table>
    </div>
  );
};
