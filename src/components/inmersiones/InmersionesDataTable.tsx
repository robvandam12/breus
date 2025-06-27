
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Filter, Anchor } from "lucide-react";
import { useInmersionesTable } from '@/hooks/useInmersionesTable';
import { UnifiedInmersionForm } from '@/components/inmersion/UnifiedInmersionForm';
import { InmersionActions } from '../inmersion/InmersionActions';

export const InmersionesDataTable = () => {
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    showNewInmersionDialog,
    setShowNewInmersionDialog,
    filteredInmersiones,
    isLoading,
    estadisticas,
    handleCreateDirectInmersion,
  } = useInmersionesTable();

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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botón de acción unificado */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button onClick={() => setShowNewInmersionDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Inmersión
          </Button>
        </div>

        {/* Estadísticas rápidas */}
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Anchor className="w-4 h-4" />
            Total: {estadisticas.total}
          </span>
          <span>Completadas: {estadisticas.completadas}</span>
          <span>En Proceso: {estadisticas.enProceso}</span>
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
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="planificada">Planificada</SelectItem>
                <SelectItem value="en_proceso">En Proceso</SelectItem>
                <SelectItem value="completada">Completada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="independent">Independientes</SelectItem>
                <SelectItem value="planned">Planificadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de inmersiones */}
      <Card>
        <CardContent className="p-0">
          {filteredInmersiones.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 text-gray-400">
                  <Anchor className="w-full h-full" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  No hay inmersiones
                </h3>
                <p className="text-muted-foreground mb-4">
                  No se encontraron inmersiones con los filtros aplicados.
                </p>
                <Button onClick={() => setShowNewInmersionDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Nueva Inmersión
                </Button>
              </div>
            </div>
          ) : (
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
                {filteredInmersiones.map((inmersion) => (
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
                      {inmersion.operacion_id ? (
                        <span className="text-sm text-blue-600">
                          {(inmersion as any).operacion?.codigo || inmersion.operacion_id}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">
                          {inmersion.external_operation_code || '-'}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <InmersionActions 
                        inmersionId={inmersion.inmersion_id}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Diálogo para nueva inmersión unificada */}
      <Dialog open={showNewInmersionDialog} onOpenChange={setShowNewInmersionDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Anchor className="w-5 h-5" />
              Nueva Inmersión
            </DialogTitle>
            <DialogDescription>
              Crear una nueva inmersión. Puede ser planificada (asociada a una operación) o independiente (con código externo).
            </DialogDescription>
          </DialogHeader>
          <UnifiedInmersionForm 
            onSubmit={handleCreateDirectInmersion}
            onCancel={() => setShowNewInmersionDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
