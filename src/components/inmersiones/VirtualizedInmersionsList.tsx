import React, { useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Anchor, Plus } from "lucide-react";
import InmersionCard from './InmersionCard';
import type { Inmersion } from "@/types/inmersion";

interface OperacionInfo {
  id: string;
  nombre: string;
}

interface VirtualizedInmersionsListProps {
  inmersiones: Inmersion[];
  getOperacionData: (operacionId: string) => OperacionInfo | undefined;
  getEstadoBadgeColor: (estado: string) => string;
  onViewInmersion: (inmersion: Inmersion) => void;
  onNewInmersion: () => void;
  containerHeight?: number;
}

export const VirtualizedInmersionsList: React.FC<VirtualizedInmersionsListProps> = ({
  inmersiones,
  getOperacionData,
  getEstadoBadgeColor,
  onViewInmersion,
  onNewInmersion,
  containerHeight = 600,
}) => {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: inmersiones.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 280, // Altura estimada de cada card
    overscan: 5,
    getItemKey: (index) => inmersiones[index]?.inmersion_id || index,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  if (inmersiones.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Anchor className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No hay inmersiones</h3>
          <p className="text-gray-600 mb-6">
            Comience creando su primera inmersión de buceo.
          </p>
          <Button onClick={onNewInmersion}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Inmersión
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      ref={parentRef}
      style={{ height: `${containerHeight}px`, overflow: 'auto' }}
      className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem) => {
          const inmersion = inmersiones[virtualItem.index];
          const operacion = getOperacionData(inmersion.operacion_id);

          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <div className="h-full p-2">
                <InmersionCard
                  inmersion={inmersion}
                  operacion={operacion}
                  getEstadoBadgeColor={getEstadoBadgeColor}
                  onView={onViewInmersion}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
