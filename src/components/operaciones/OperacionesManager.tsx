
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { OperacionCard } from "./OperacionCard";
import { OperacionDetails } from "./OperacionDetails";
import { OperacionesMapView } from "./OperacionesMapView";
import { OperacionesCalendarView } from "./OperacionesCalendarView";
import { useOperaciones } from "@/hooks/useOperaciones";
import { Calendar, Eye, MapPin, CalendarDays, Edit, Trash2, Table as TableIcon, Grid, Building, Users, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const OperacionesManager = () => {
  const { operaciones, isLoading } = useOperaciones();
  const [selectedOperacion, setSelectedOperacion] = useState<string | null>(null);
  const [activeView, setActiveView] = useState('lista');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOperaciones = operaciones.filter(operacion =>
    operacion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operacion.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEstadoBadge = (estado: string) => {
    const colors = {
      'activa': 'bg-green-100 text-green-700 border-green-300',
      'completada': 'bg-blue-100 text-blue-700 border-blue-300',
      'pausada': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'cancelada': 'bg-red-100 text-red-700 border-red-300'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'activa':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case 'pausada':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      case 'completada':
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
      case 'cancelada':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Operaciones</p>
                <p className="text-2xl font-bold text-blue-900">{filteredOperaciones.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Activas</p>
                <p className="text-2xl font-bold text-green-900">
                  {filteredOperaciones.filter(op => op.estado === 'activa').length}
                </p>
              </div>
              <Building className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">En Pausa</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {filteredOperaciones.filter(op => op.estado === 'pausada').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Completadas</p>
                <p className="text-2xl font-bold text-purple-900">
                  {filteredOperaciones.filter(op => op.estado === 'completada').length}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Gestión de Operaciones
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white rounded-lg border shadow-sm">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className="rounded-r-none border-r"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="rounded-l-none"
                >
                  <TableIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <Input
              placeholder="Buscar operaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeView} onValueChange={setActiveView}>
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="lista" className="flex items-center gap-2">
                <TableIcon className="w-4 h-4" />
                Lista
              </TabsTrigger>
              <TabsTrigger value="mapa" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Mapa
              </TabsTrigger>
              <TabsTrigger value="calendario" className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                Calendario
              </TabsTrigger>
            </TabsList>

            <TabsContent value="lista" className="mt-6">
              {viewMode === 'cards' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOperaciones.map((operacion) => (
                    <div key={operacion.id} className="relative group">
                      <OperacionCard 
                        operacion={operacion}
                        onEdit={() => {}}
                        onDelete={() => {}}
                      />
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setSelectedOperacion(operacion.id)}
                          className="bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/50">
                        <TableHead>Operación</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Sitio</TableHead>
                        <TableHead>Fecha Inicio</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Equipo</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOperaciones.map((operacion) => (
                        <TableRow key={operacion.id} className="hover:bg-gray-50/50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Building className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{operacion.nombre}</div>
                                {operacion.tareas && (
                                  <div className="text-sm text-gray-500 truncate max-w-xs">{operacion.tareas}</div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              {operacion.codigo}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{operacion.sitios?.nombre || 'Sin sitio'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{formatDate(operacion.fecha_inicio)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(operacion.estado)}
                              <Badge variant="outline" className={getEstadoBadge(operacion.estado)}>
                                {operacion.estado}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            {operacion.equipo_buceo_id ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                                <Users className="w-3 h-3 mr-1" />
                                Asignado
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                                Sin equipo
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedOperacion(operacion.id)}
                                className="hover:bg-blue-50"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {}}
                                className="hover:bg-gray-50"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {filteredOperaciones.length === 0 && (
                <div className="text-center py-12">
                  <Building className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay operaciones disponibles</h3>
                  <p className="text-gray-500">Comience creando una nueva operación de buceo</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="mapa" className="mt-6">
              <OperacionesMapView />
            </TabsContent>

            <TabsContent value="calendario" className="mt-6">
              <OperacionesCalendarView />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog para detalles de operación */}
      <Dialog open={!!selectedOperacion} onOpenChange={() => setSelectedOperacion(null)}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          {selectedOperacion && (
            <OperacionDetails
              operacionId={selectedOperacion}
              onClose={() => setSelectedOperacion(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
