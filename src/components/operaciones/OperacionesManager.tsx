
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, MapPin, Calendar, Users, Settings, FileText, Activity } from "lucide-react";
import { CreateOperacionForm } from './CreateOperacionForm';
import { OperacionDetails } from './OperacionDetails';
import { useOperaciones } from '@/hooks/useOperaciones';

export const OperacionesManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedOperacion, setSelectedOperacion] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('lista');

  const { operaciones, isLoading, createOperacion, updateOperacion, deleteOperacion } = useOperaciones();

  const filteredOperaciones = operaciones.filter(op => {
    const matchesSearch = op.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || op.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (estado: string) => {
    const colors = {
      'activa': 'bg-green-100 text-green-700',
      'pausada': 'bg-yellow-100 text-yellow-700',
      'completada': 'bg-blue-100 text-blue-700',
      'cancelada': 'bg-red-100 text-red-700'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getOperacionStats = () => {
    const stats = {
      total: operaciones.length,
      activas: operaciones.filter(op => op.estado === 'activa').length,
      pausadas: operaciones.filter(op => op.estado === 'pausada').length,
      completadas: operaciones.filter(op => op.estado === 'completada').length
    };
    return stats;
  };

  const stats = getOperacionStats();

  return (
    <div className="space-y-6">
      {/* Header y Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Operaciones</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Activas</p>
                <p className="text-2xl font-bold text-green-600">{stats.activas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Pausadas</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pausadas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Completadas</p>
                <p className="text-2xl font-bold text-blue-600">{stats.completadas}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles principales */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gestión de Operaciones</CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Nueva Operación
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Operación</DialogTitle>
                </DialogHeader>
                <CreateOperacionForm
                  onSubmit={async (data) => {
                    await createOperacion(data);
                    setIsCreateDialogOpen(false);
                  }}
                  onCancel={() => setIsCreateDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="lista">Lista</TabsTrigger>
              <TabsTrigger value="mapa">Mapa</TabsTrigger>
              <TabsTrigger value="calendario">Calendario</TabsTrigger>
            </TabsList>

            {/* Filtros */}
            <div className="flex flex-wrap gap-4 items-center mt-4 mb-6">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar operaciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="activa">Activas</SelectItem>
                  <SelectItem value="pausada">Pausadas</SelectItem>
                  <SelectItem value="completada">Completadas</SelectItem>
                  <SelectItem value="cancelada">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="lista">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-4">Cargando operaciones...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Operación</TableHead>
                      <TableHead>Sitio</TableHead>
                      <TableHead>Contratista</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOperaciones.map((operacion) => (
                      <TableRow key={operacion.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{operacion.nombre}</div>
                            <div className="text-sm text-gray-500">Código: {operacion.codigo}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{operacion.sitios?.nombre || 'Sin asignar'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>{operacion.contratistas?.nombre || 'Sin asignar'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}</div>
                            {operacion.fecha_fin && (
                              <div className="text-gray-500">
                                a {new Date(operacion.fecha_fin).toLocaleDateString('es-CL')}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(operacion.estado)}>
                            {operacion.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedOperacion(operacion)}
                          >
                            Ver Detalles
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="mapa">
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Vista de mapa en desarrollo</p>
                  <p className="text-sm text-gray-500">Mostrará operaciones por ubicación geográfica</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="calendario">
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Vista de calendario en desarrollo</p>
                  <p className="text-sm text-gray-500">Mostrará operaciones por fechas programadas</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog de detalles */}
      <Dialog open={!!selectedOperacion} onOpenChange={() => setSelectedOperacion(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalles de Operación</DialogTitle>
          </DialogHeader>
          {selectedOperacion && (
            <OperacionDetails 
              operacion={selectedOperacion}
              onBack={() => setSelectedOperacion(null)}
              onUpdate={async (operacionId: string, data: any) => {
                await updateOperacion({ id: operacionId, data });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
