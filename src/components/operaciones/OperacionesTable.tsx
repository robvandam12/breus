
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
      activa: 'bg-green-100 text-green-800 border-green-200',
      pausada: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      completada: 'bg-blue-100 text-blue-800 border-blue-200',
      cancelada: 'bg-red-100 text-red-800 border-red-200',
      eliminada: 'bg-muted text-muted-foreground border-border',
    };
    return colors[estado] || 'bg-muted text-muted-foreground border-border';
  };
  
  const sortedOperaciones = useMemo(() => {
    if (!operaciones || operaciones.length === 0) return [];
    
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
    estimateSize: () => 80,
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
    return sortConfig.direction === 'ascending' ? 
      <ArrowUp className="w-4 h-4 ml-1 text-muted-foreground" /> : 
      <ArrowDown className="w-4 h-4 ml-1 text-muted-foreground" />;
  };

  const columns = [
    { key: 'codigo', label: 'Código' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'salmoneras.nombre', label: 'Salmonera' },
    { key: 'sitios.nombre', label: 'Sitio' },
    { key: 'estado', label: 'Estado' },
    { key: 'fecha_inicio', label: 'Fecha Inicio' },
  ];

  if (!operaciones || operaciones.length === 0) {
    return (
      <div className="text-center py-16 bg-card rounded-lg border border-border">
        <ListX className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No se encontraron operaciones</h3>
        <p className="text-muted-foreground">Intenta ajustar los filtros de búsqueda o crea una nueva operación.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div 
        ref={parentRef} 
        className="h-[600px] overflow-auto"
        style={{ contain: 'strict' }}
      >
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
          {/* Header fijo */}
          <div className="sticky top-0 bg-muted/95 backdrop-blur supports-[backdrop-filter]:bg-muted/95 z-10 border-b border-border">
            <div className="grid grid-cols-7 gap-4 p-4 text-sm font-medium text-muted-foreground">
              {columns.map(col => (
                <div 
                  key={col.key} 
                  onClick={() => requestSort(col.key)} 
                  className="cursor-pointer select-none hover:text-foreground transition-colors flex items-center"
                >
                  {col.label}
                  {renderSortArrow(col.key)}
                </div>
              ))}
              <div className="text-right">Acciones</div>
            </div>
          </div>

          {/* Filas virtualizadas */}
          {rowVirtualizer.getVirtualItems().map(virtualItem => {
            const operacion = sortedOperaciones[virtualItem.index];
            if (!operacion) return null;
            
            return (
              <div
                key={operacion.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start + 60}px)`, // +60 para el header
                }}
                className="grid grid-cols-7 gap-4 p-4 hover:bg-muted/50 transition-colors border-b border-border items-center"
              >
                <div className="font-medium text-foreground text-sm">
                  {operacion.codigo}
                </div>
                
                <div className="min-w-0">
                  <div className="font-medium text-foreground text-sm truncate">
                    {operacion.nombre}
                  </div>
                  {operacion.tareas && (
                    <div className="text-xs text-muted-foreground truncate mt-1">
                      {operacion.tareas}
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-foreground">
                  {operacion.salmoneras?.nombre || 'No asignada'}
                </div>
                
                <div className="text-sm text-foreground">
                  {operacion.sitios?.nombre || 'No asignado'}
                </div>
                
                <div>
                  <Badge className={getEstadoBadgeColor(operacion.estado)} variant="outline">
                    {operacion.estado}
                  </Badge>
                </div>
                
                <div className="text-sm text-foreground">
                  {new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}
                </div>
                
                <div className="flex justify-end">
                  {/* CORRECCIÓN: Solo botones Ver y Borrar, sin Editar */}
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetail(operacion)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"  
                      size="sm"
                      onClick={() => onDelete(operacion.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
