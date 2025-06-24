
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Anchor, 
  Eye, 
  Edit, 
  Download,
  Calendar,
  Building,
  Users,
  Clock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useInmersiones } from "@/hooks/useInmersiones";
import { useOperaciones } from "@/hooks/useOperaciones";

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completada':
      return <Badge className="bg-green-100 text-green-800 border-green-200">Completada</Badge>;
    case 'en_progreso':
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">En Progreso</Badge>;
    case 'planificada':
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Planificada</Badge>;
    case 'cancelada':
      return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelada</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const InmersionesDataTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { inmersiones, isLoading } = useInmersiones();
  const { operaciones } = useOperaciones();

  const filteredData = inmersiones.filter(inmersion => {
    const operacion = operaciones.find(op => op.id === inmersion.operacion_id);
    const matchesSearch = inmersion.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inmersion.buzo_principal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inmersion.supervisor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         operacion?.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inmersion.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateInmersion = () => {
    setShowCreateDialog(true);
  };

  const handleCloseDialog = () => {
    setShowCreateDialog(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Inmersiones</p>
                <p className="text-2xl font-bold">{inmersiones.length}</p>
              </div>
              <Anchor className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completadas</p>
                <p className="text-2xl font-bold">
                  {inmersiones.filter(i => i.estado === 'completada').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Progreso</p>
                <p className="text-2xl font-bold">
                  {inmersiones.filter(i => i.estado === 'en_progreso').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Planificadas</p>
                <p className="text-2xl font-bold">
                  {inmersiones.filter(i => i.estado === 'planificada').length}
                </p>
              </div>
              <Edit className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y acciones */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Anchor className="w-5 h-5" />
              Inmersiones
            </CardTitle>
            <Button onClick={handleCreateInmersion} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nueva Inmersión
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por código, buzo, supervisor u operación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="planificada">Planificada</SelectItem>
                <SelectItem value="en_progreso">En Progreso</SelectItem>
                <SelectItem value="completada">Completada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabla usando componente estándar */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Operación</TableHead>
                <TableHead>Buzo Principal</TableHead>
                <TableHead>Supervisor</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Profundidad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((inmersion) => {
                const operacion = operaciones.find(op => op.id === inmersion.operacion_id);
                return (
                  <TableRow key={inmersion.inmersion_id}>
                    <TableCell>
                      <div className="font-medium text-blue-600">{inmersion.codigo}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-48 truncate">
                        {operacion ? `${operacion.codigo} - ${operacion.nombre}` : 
                         inmersion.is_independent ? 'Inmersión Independiente' : 'Operación no encontrada'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        {inmersion.buzo_principal}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        {inmersion.supervisor}
                      </div>
                    </TableCell>
                    <TableCell>
                      {inmersion.fecha_inmersion ? new Date(inmersion.fecha_inmersion).toLocaleDateString('es-CL') : 'Sin fecha'}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {inmersion.profundidad_max || inmersion.current_depth || 0}m
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(inmersion.estado)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Anchor className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron inmersiones que coincidan con los filtros.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para crear inmersión */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva Inmersión</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>Formulario de creación de inmersión aquí...</p>
            <Button onClick={handleCloseDialog} className="mt-4">
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
