import React, { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Anchor, Calendar, User, Clock, LayoutGrid, LayoutList, Eye, AlertTriangle } from "lucide-react";
import { InmersionWizard } from "@/components/inmersion/InmersionWizard";
import { useInmersiones } from "@/hooks/useInmersiones";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useRouter } from "@/hooks/useRouter";
import { useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Inmersiones() {
  const [showWizard, setShowWizard] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedInmersion, setSelectedInmersion] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [newDepth, setNewDepth] = useState<string>('');
  const [searchParams] = useSearchParams();
  const { navigateTo } = useRouter();
  const { inmersiones, isLoading, createInmersion, refreshInmersiones, updateInmersion } = useInmersiones();
  const { operaciones } = useOperaciones();
  
  const operacionId = searchParams.get('operacion');

  useEffect(() => {
    if (operacionId) {
      setShowWizard(true);
    }
  }, [operacionId]);

  // Sync selectedInmersion with real-time updates
  useEffect(() => {
    if (showDetailModal && selectedInmersion?.inmersion_id) {
      const updatedInmersion = inmersiones.find(
        (i) => i.inmersion_id === selectedInmersion.inmersion_id
      );

      if (updatedInmersion && JSON.stringify(updatedInmersion) !== JSON.stringify(selectedInmersion)) {
        setSelectedInmersion(updatedInmersion);
      }
    }
  }, [inmersiones, selectedInmersion, showDetailModal]);

  const handleCreateInmersion = async (data: any) => {
    try {
      await createInmersion(data);
      toast({
        title: "Inmersión creada",
        description: "La inmersión ha sido creada exitosamente.",
      });
      setShowWizard(false);
      
      if (operacionId) {
        navigateTo('/operaciones');
      }
    } catch (error) {
      console.error('Error creating inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la inmersión.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setShowWizard(false);
    if (operacionId) {
      navigateTo('/operaciones');
    }
  };

  const getOperacionData = (operacionId: string) => {
    return operaciones.find(op => op.id === operacionId);
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'planificada':
        return 'bg-blue-100 text-blue-800';
      case 'en_progreso':
        return 'bg-yellow-100 text-yellow-800';
      case 'completada':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRefresh = () => {
    refreshInmersiones();
  };

  const handleViewInmersion = (inmersion: any) => {
    setSelectedInmersion(inmersion);
    setNewDepth(inmersion.current_depth?.toString() || '');
    setShowDetailModal(true);
  };
  
  const handleUpdateDepth = async () => {
    if (!selectedInmersion || newDepth === '') return;
    try {
      const updatedInmersion = await updateInmersion({
        id: selectedInmersion.inmersion_id,
        data: { current_depth: parseFloat(newDepth) },
      });
      setSelectedInmersion(updatedInmersion);
      toast({
        title: "Profundidad actualizada",
        description: "La profundidad de la inmersión se ha actualizado.",
      });
    } catch (error) {
      console.error('Error updating depth:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la profundidad.",
        variant: "destructive",
      });
    }
  };

  if (showWizard) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-white">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col bg-white">
            <Header 
              title="Nueva Inmersión" 
              subtitle="Crear inmersión de buceo" 
              icon={Anchor} 
            />
            
            <div className="flex-1 overflow-auto bg-white">
              <div className="p-6">
                <InmersionWizard
                  operationId={operacionId || undefined}
                  onComplete={handleCreateInmersion}
                  onCancel={handleCancel}
                />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col bg-white">
          <Header 
            title="Inmersiones" 
            subtitle="Gestión de inmersiones de buceo" 
            icon={Anchor} 
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-zinc-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className="h-8 px-3"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="h-8 px-3"
                >
                  <LayoutList className="w-4 h-4" />
                </Button>
              </div>
              
              <Button onClick={() => setShowWizard(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Inmersión
              </Button>
            </div>
          </Header>
          
          <div className="flex-1 overflow-auto bg-white">
            <div className="p-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Cargando inmersiones...</p>
                </div>
              ) : inmersiones.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Anchor className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No hay inmersiones</h3>
                    <p className="text-gray-600 mb-6">
                      Comience creando su primera inmersión de buceo.
                    </p>
                    <Button onClick={() => setShowWizard(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Inmersión
                    </Button>
                  </CardContent>
                </Card>
              ) : viewMode === 'cards' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inmersiones.map((inmersion) => {
                    const operacion = getOperacionData(inmersion.operacion_id);
                    return (
                      <Card key={inmersion.inmersion_id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{inmersion.codigo}</CardTitle>
                            <Badge className={getEstadoBadgeColor(inmersion.estado)}>
                              {inmersion.estado}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {operacion && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{operacion.nombre}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(inmersion.fecha_inmersion).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>{inmersion.buzo_principal}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{inmersion.hora_inicio} - {inmersion.hora_fin || 'En curso'}</span>
                          </div>
                          
                          <div className="text-sm text-gray-600">
                            <p><strong>Supervisor:</strong> {inmersion.supervisor}</p>
                            <p><strong>Profundidad:</strong> {inmersion.profundidad_max}m</p>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleViewInmersion(inmersion)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalles
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
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
                                onClick={() => handleViewInmersion(inmersion)}
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
              )}
            </div>
          </div>

          {/* Detail Modal */}
          <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" style={{ zIndex: 9999 }}>
              {selectedInmersion && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Anchor className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-zinc-900">{selectedInmersion.codigo}</h2>
                      <p className="text-zinc-500">
                        {getOperacionData(selectedInmersion.operacion_id)?.nombre || 'Sin operación'}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Información General</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-3">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Fecha de Inmersión</label>
                            <p className="text-lg">{new Date(selectedInmersion.fecha_inmersion).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Horario</label>
                            <p className="text-lg">{selectedInmersion.hora_inicio} - {selectedInmersion.hora_fin || 'En curso'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Buzo Principal</label>
                            <p className="text-lg">{selectedInmersion.buzo_principal}</p>
                          </div>
                          {selectedInmersion.buzo_asistente && (
                            <div>
                              <label className="text-sm font-medium text-gray-500">Buzo Asistente</label>
                              <p className="text-lg">{selectedInmersion.buzo_asistente}</p>
                            </div>
                          )}
                          <div>
                            <label className="text-sm font-medium text-gray-500">Supervisor</label>
                            <p className="text-lg">{selectedInmersion.supervisor}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Estado</label>
                            <Badge className={getEstadoBadgeColor(selectedInmersion.estado)}>
                              {selectedInmersion.estado}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Condiciones de Inmersión</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-3">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Profundidad Máxima</label>
                            <p className="text-lg">{selectedInmersion.profundidad_max} m</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Temperatura del Agua</label>
                            <p className="text-lg">{selectedInmersion.temperatura_agua}°C</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Visibilidad</label>
                            <p className="text-lg">{selectedInmersion.visibilidad} m</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Corriente</label>
                            <p className="text-lg">{selectedInmersion.corriente}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {selectedInmersion.estado === 'en_progreso' && (
                    <Card>
                      <CardHeader>
                          <CardTitle>Monitoreo en Tiempo Real</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          {selectedInmersion.current_depth > selectedInmersion.profundidad_max && (
                              <Alert variant="destructive">
                                  <AlertTriangle className="h-4 w-4" />
                                  <AlertTitle>¡Advertencia!</AlertTitle>
                                  <AlertDescription>
                                      Profundidad actual ({selectedInmersion.current_depth}m) excede la profundidad máxima planificada ({selectedInmersion.profundidad_max}m).
                                  </AlertDescription>
                              </Alert>
                          )}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Profundidad Actual</label>
                                <p className="text-3xl font-bold text-blue-600">{selectedInmersion.current_depth || '0'} m</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Prof. Máxima Planificada</label>
                                <p className="text-2xl font-semibold">{selectedInmersion.profundidad_max} m</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Tiempo de Fondo Plan.</label>
                                <p className="text-2xl font-semibold">{selectedInmersion.planned_bottom_time ? `${selectedInmersion.planned_bottom_time} min` : 'N/A'}</p>
                            </div>
                          </div>
                          <div>
                              <label htmlFor="update-depth-input" className="text-sm font-medium text-gray-500">Forzar Actualización de Profundidad</label>
                              <div className="flex items-center gap-2 mt-1">
                                  <Input
                                      id="update-depth-input"
                                      type="number"
                                      value={newDepth}
                                      onChange={(e) => setNewDepth(e.target.value)}
                                      placeholder="Profundidad en metros"
                                      className="max-w-xs"
                                  />
                                  <Button onClick={handleUpdateDepth}>Actualizar</Button>
                              </div>
                          </div>
                          {/* Depth History Section */}
                          {selectedInmersion.depth_history && selectedInmersion.depth_history.length > 0 && (
                            <div className="pt-4">
                              <h4 className="text-md font-medium text-gray-800 mb-2">Historial de Profundidad</h4>
                              <div className="h-52 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart 
                                    data={selectedInmersion.depth_history.map(h => ({ ...h, time: new Date(h.timestamp).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) }))}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                  >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" />
                                    <YAxis allowDecimals={false} label={{ value: 'Profundidad (m)', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="depth" name="Profundidad" stroke="#3b82f6" activeDot={{ r: 8 }} />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                              <div className="mt-4 max-h-40 overflow-y-auto pr-2">
                                <ul className="space-y-1">
                                  {selectedInmersion.depth_history.slice().reverse().map((entry, index) => (
                                    <li key={index} className="text-xs text-gray-600 flex justify-between p-1 rounded hover:bg-gray-50">
                                      <span>{new Date(entry.timestamp).toLocaleString('es-CL')}</span>
                                      <span className="font-semibold">{entry.depth} m</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                      </CardContent>
                    </Card>
                  )}

                  {selectedInmersion.objetivo && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Objetivo</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{selectedInmersion.objetivo}</p>
                      </CardContent>
                    </Card>
                  )}

                  {selectedInmersion.observaciones && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Observaciones</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{selectedInmersion.observaciones}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
}
