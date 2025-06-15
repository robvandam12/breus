
import React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from "lucide-react";
import type { Inmersion } from "@/types/inmersion";

interface OperacionInfo {
  id: string;
  nombre: string;
}

interface VirtualizedInmersionsTableProps {
  inmersiones: Inmersion[];
  getOperacionData: (operacionId: string) => OperacionInfo | undefined;
  getEstadoBadgeColor: (estado: string) => string;
  onViewInmersion: (inmersion: Inmersion) => void;
  containerHeight?: number;
}

export const VirtualizedInmersionsTable: React.FC<VirtualizedInmersionsTableProps> = ({
  inmersiones,
  getOperacionData,
  getEstadoBadgeColor,
  onViewInmersion,
  containerHeight = 600,
}) => {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: inmersiones.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // Altura estimada de cada fila
    overscan: 10,
  });

  return (
    <Card className="w-full">
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Operación</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Buzo Principal</TableHead>
              <TableHead>Supervisor</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Profundidad</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
        
        <div
          ref={parentRef}
          style={{ height: `${containerHeight}px`, overflow: 'auto' }}
          className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        >
          <Table>
            <TableBody
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                const inmersion = inmersiones[virtualItem.index];
                const operacion = getOperacionData(inmersion.operacion_id);

                return (
                  <TableRow
                    key={inmersion.inmersion_id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                  >
                    <TableCell className="font-medium">{inmersion.codigo}</TableCell>
                    <TableCell>{operacion?.nombre || 'Sin operación'}</TableCell>
                    <TableCell>{new Date(inmersion.fecha_inmersion).toLocaleDateString()}</TableCell>
                    <TableCell>{inmersion.buzo_principal}</TableCell>
                    <TableCell>{inmersion.supervisor}</TableCell>
                    <TableCell>
                      <Badge className={getEstadoBadgeColor(inmersion.estado)}>
                        {inmersion.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>{inmersion.profundidad_max}m</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onViewInmersion(inmersion)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};
