
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Filter, Calendar, Zap, Anchor } from "lucide-react";
import { useInmersionesTable } from '@/hooks/useInmersionesTable';
import { IndependentImmersionForm } from './IndependentImmersionForm';
import { InmersionContextualForm } from './InmersionContextualForm';
import { InmersionActions } from '../inmersion/InmersionActions';

export const InmersionesDataTable = () => {
  console.log('InmersionesDataTable rendering');

  // Usar un estado simple para verificar si el problema está en los hooks
  const [showNewInmersionDialog, setShowNewInmersionDialog] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  // Hardcodear algunos datos iniciales para test
  const testData = [
    {
      inmersion_id: '1',
      codigo: 'TEST-001',
      fecha_inmersion: '2024-01-15',
      estado: 'completada',
      buzo_principal: 'Juan Pérez',
      supervisor: 'Carlos Silva',
      profundidad_max: 25,
      operacion_id: null,
      is_independent: true
    }
  ];

  const getEstadoBadgeColor = (estado: string) => {
    const colors: Record<string, string> = {
      planificada: 'bg-blue-100 text-blue-700',
      en_proceso: 'bg-yellow-100 text-yellow-700',
      completada: 'bg-green-100 text-green-700',
      cancelada: 'bg-red-100 text-red-700',
    };
    return colors[estado] || 'bg-gray-100 text-gray-700';
  };

  const getTipoBadgeColor = (isIndependent: boolean, operacionId: string | null) => {
    if (isIndependent || !operacionId) {
      return 'bg-purple-100 text-purple-700';
    }
    return 'bg-blue-100 text-blue-700';
  };

  const getTipoLabel = (isIndependent: boolean, operacionId: string | null) => {
    if (isIndependent || !operacionId) {
      return 'Independiente';
    }
    return 'Planificada';
  };

  console.log('About to render component JSX');

  return (
    <div className="space-y-6">
      {/* Header con botones de acción */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button onClick={() => setShowNewInmersionDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Inmersión
          </Button>
        </div>

        <div className="flex gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Anchor className="w-4 h-4" />
            Total: {testData.length}
          </span>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por código, objetivo o observaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de inmersiones */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Buzo Principal</TableHead>
                <TableHead>Supervisor</TableHead>
                <TableHead>Profundidad</TableHead>
                <TableHead>Operación</TableHead>
                <TableHead className="w-[50px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testData.map((inmersion) => (
                <TableRow key={inmersion.inmersion_id}>
                  <TableCell className="font-medium">
                    {inmersion.codigo}
                  </TableCell>
                  <TableCell>
                    <Badge className={getTipoBadgeColor(inmersion.is_independent, inmersion.operacion_id)}>
                      {getTipoLabel(inmersion.is_independent, inmersion.operacion_id)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(inmersion.fecha_inmersion).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getEstadoBadgeColor(inmersion.estado)}>
                      {inmersion.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>{inmersion.buzo_principal}</TableCell>
                  <TableCell>{inmersion.supervisor}</TableCell>
                  <TableCell>{inmersion.profundidad_max}m</TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">-</span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Ver</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Diálogo para nueva inmersión */}
      <Dialog open={showNewInmersionDialog} onOpenChange={setShowNewInmersionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva Inmersión</DialogTitle>
            <DialogDescription>
              Funcionalidad en desarrollo
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            <p>El formulario de inmersión se mostrará aquí.</p>
            <Button 
              className="mt-4" 
              onClick={() => setShowNewInmersionDialog(false)}
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
