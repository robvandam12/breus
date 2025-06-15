
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Anchor, Eye } from "lucide-react";
import InmersionCard from './InmersionCard';
import type { Inmersion } from "@/types/inmersion";

interface OperacionInfo {
  id: string;
  nombre: string;
}

interface InmersionesListProps {
  viewMode: 'cards' | 'table';
  inmersiones: Inmersion[];
  operaciones: OperacionInfo[];
  getOperacionData: (operacionId: string) => OperacionInfo | undefined;
  getEstadoBadgeColor: (estado: string) => string;
  onViewInmersion: (inmersion: Inmersion) => void;
  onNewInmersion: () => void;
}

const InmersionesList: React.FC<InmersionesListProps> = ({
  viewMode,
  inmersiones,
  operaciones,
  getOperacionData,
  getEstadoBadgeColor,
  onViewInmersion,
  onNewInmersion,
}) => {
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

  if (viewMode === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inmersiones.map((inmersion) => {
          const operacion = getOperacionData(inmersion.operacion_id);
          return (
            <InmersionCard
              key={inmersion.inmersion_id}
              inmersion={inmersion}
              operacion={operacion}
              getEstadoBadgeColor={getEstadoBadgeColor}
              onView={onViewInmersion}
            />
          );
        })}
      </div>
    );
  }

  return (
    <Card>
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
        <TableBody>
          {inmersiones.map((inmersion) => {
            const operacion = getOperacionData(inmersion.operacion_id);
            return (
              <TableRow key={inmersion.inmersion_id}>
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
    </Card>
  );
};

export default InmersionesList;
