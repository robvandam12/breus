
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
import { Calendar, Eye, MapPin, CalendarDays, Edit, Trash2, Table as TableIcon, Grid } from "lucide-react";

export const OperacionesManager = () => {
  const { operaciones, isLoading } = useOperaciones();
  const [selectedOperacion, setSelectedOperacion] = useState<string | null>(null);
  const [activeView, setActiveView] = useState('lista');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOperaciones = operaciones.filter(operacion =>
    operacion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operacion.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEstadoBadge = (estado: string) => {
    const colors = {
      'activa': 'bg-green-100 text-green-700',
      'completada': 'bg-blue-100 text-blue-700',
      'pausada': 'bg-yellow-100 text-yellow-700',
      'cancelada': 'bg-red-100 text-red-700'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-700';
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Gestión de Operaciones
              <Badge variant="outline">{filteredOperaciones.length} operaciones</Badge>
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white rounded-lg border">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="rounded-r-none"
                >
                  <TableIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className="rounded-l-none"
                >
                  <Grid className="w-4 h-4" />
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
              <TabsTrigger value="lista">Lista</TabsTrigger>
              <TabsTrigger value="mapa">Mapa</TabsTrigger>
              <TabsTrigger value="calendario">Calendario</TabsTrigger>
            </TabsList>

            <TabsContent value="lista" className="mt-6">
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'table' | 'cards')}>
                <TabsContent value="table">
                  {filteredOperaciones.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No hay operaciones disponibles</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Operación</TableHead>
                          <TableHead>Código</TableHead>
                          <TableHead>Fecha Inicio</TableHead>
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
                                {operacion.tareas && (
                                  <div className="text-sm text-gray-500">{operacion.tareas}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{operacion.codigo}</TableCell>
                            <TableCell>
                              {new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}
                            </TableCell>
                            <TableCell>
                              <Badge className={getEstadoBadge(operacion.estado)}>
                                {operacion.estado}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedOperacion(operacion.id)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Ver
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {}}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>

                <TabsContent value="cards">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredOperaciones.map((operacion) => (
                      <div key={operacion.id} className="relative">
                        <OperacionCard 
                          operacion={operacion}
                          onEdit={() => {}}
                          onDelete={() => {}}
                        />
                        <div className="absolute top-2 right-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedOperacion(operacion.id)}
                            className="bg-white/90 backdrop-blur-sm"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ver
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredOperaciones.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No hay operaciones disponibles</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
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
