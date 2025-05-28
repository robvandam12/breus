
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MapPin, Building, Calendar, FileText, Clock, Plus, Users, Anchor } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Operacion } from '@/types';
import { useSitios } from '@/hooks/useSitios';
import { useAuth } from '@/hooks/useAuth';
import { useAnexoBravo } from '@/hooks/useAnexoBravo';
import { useHPT } from '@/hooks/useHPT';
import { FullAnexoBravoForm } from '@/components/anexo-bravo/FullAnexoBravoForm';
import { HPTForm } from '@/components/formularios/HPTForm';
import { useEquiposBuceoEnhanced } from '@/hooks/useEquiposBuceoEnhanced';

interface OperacionDetailsProps {
  operacion: Operacion;
  onClose: () => void;
}

export const OperacionDetails = ({ operacion, onClose }: OperacionDetailsProps) => {
  const [activeTab, setActiveTab] = useState('detalles');
  const [showAnexoBravo, setShowAnexoBravo] = useState(false);
  const [showHPT, setShowHPT] = useState(false);

  const { sitios } = useSitios();
  const { profile } = useAuth();
  const { anexosBravo, createAnexoBravo } = useAnexoBravo();
  const { hpts, createHPT } = useHPT();
  const { getEquipoById } = useEquiposBuceoEnhanced();

  const sitio = sitios.find(s => s.id === operacion.sitio_id);
  const anexoBravoOperacion = anexosBravo.filter(a => a.operacion_id === operacion.id);
  const hptOperacion = hpts.filter(h => h.operacion_id === operacion.id);
  
  // Obtén el equipo asignado a esta operación
  const equipoAsignado = operacion.equipo_buceo_id 
    ? getEquipoById(operacion.equipo_buceo_id) 
    : null;

  const handleAnexoBravoComplete = async (data: any) => {
    try {
      await createAnexoBravo({
        ...data,
        operacion_id: operacion.id
      });
      setShowAnexoBravo(false);
    } catch (error) {
      console.error('Error al crear anexo bravo:', error);
    }
  };

  const handleHPTComplete = async (data: any) => {
    try {
      await createHPT({
        ...data,
        operacion_id: operacion.id
      });
      setShowHPT(false);
    } catch (error) {
      console.error('Error al crear HPT:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-CL');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">{operacion.nombre}</h2>
          <div className="flex items-center text-sm text-zinc-500">
            <Badge variant="secondary" className="mr-2">
              {operacion.codigo}
            </Badge>
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(operacion.fecha_inicio)} 
            {operacion.fecha_fin && ` - ${formatDate(operacion.fecha_fin)}`}
          </div>
        </div>
        <Button variant="outline" onClick={onClose}>
          Cerrar
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="detalles">Detalles</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="equipo">Equipo de Buceo</TabsTrigger>
          <TabsTrigger value="inmersiones">Inmersiones</TabsTrigger>
        </TabsList>
        
        <TabsContent value="detalles" className="flex-1 mt-4">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-zinc-900">Información de la Operación</h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Calendar className="w-4 h-4 mt-1 mr-2 text-zinc-500" />
                      <div>
                        <p className="text-sm text-zinc-500">Fecha</p>
                        <p className="font-medium">
                          {formatDate(operacion.fecha_inicio)}
                          {operacion.fecha_fin ? ` al ${formatDate(operacion.fecha_fin)}` : ''}
                        </p>
                      </div>
                    </div>
                    
                    {sitio && (
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 mt-1 mr-2 text-zinc-500" />
                        <div>
                          <p className="text-sm text-zinc-500">Sitio</p>
                          <p className="font-medium">{sitio.nombre}</p>
                          <p className="text-sm text-zinc-500">{sitio.ubicacion}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start">
                      <Building className="w-4 h-4 mt-1 mr-2 text-zinc-500" />
                      <div>
                        <p className="text-sm text-zinc-500">Servicio</p>
                        <p className="font-medium">
                          {operacion.contratista_id ? 'Contratista asignado' : 'Servicio interno'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-zinc-900">Detalles del Trabajo</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-zinc-500">Descripción</p>
                      <p className="font-medium">{operacion.tareas || 'No especificada'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-zinc-500">Estado</p>
                      <Badge 
                        variant={operacion.estado === 'activa' ? 'default' : 'secondary'}
                        className={operacion.estado === 'completada' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {operacion.estado.charAt(0).toUpperCase() + operacion.estado.slice(1)}
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="text-sm text-zinc-500">Aprobación</p>
                      <Badge 
                        variant={operacion.estado_aprobacion === 'aprobado' ? 'default' : 'secondary'}
                        className={
                          operacion.estado_aprobacion === 'aprobado' 
                            ? 'bg-green-100 text-green-800' 
                            : operacion.estado_aprobacion === 'rechazado'
                              ? 'bg-red-100 text-red-800'
                              : ''
                        }
                      >
                        {operacion.estado_aprobacion.charAt(0).toUpperCase() + operacion.estado_aprobacion.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documentos" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-zinc-900">Documentos de la Operación</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowHPT(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo HPT
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowAnexoBravo(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Anexo
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-zinc-700 mb-3">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-1 text-blue-600" />
                      HPT
                    </div>
                  </h4>
                  {hptOperacion.length === 0 ? (
                    <div className="text-center py-8 border border-dashed rounded-lg">
                      <FileText className="w-8 h-8 mx-auto text-zinc-300 mb-2" />
                      <p className="text-zinc-500">No hay documentos HPT para esta operación</p>
                      <Button 
                        variant="link" 
                        className="mt-2"
                        onClick={() => setShowHPT(true)}
                      >
                        Crear HPT
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Código</TableHead>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Supervisor</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {hptOperacion.map(hpt => (
                          <TableRow key={hpt.id}>
                            <TableCell>{hpt.codigo}</TableCell>
                            <TableCell>{hpt.fecha ? formatDate(hpt.fecha) : 'Sin fecha'}</TableCell>
                            <TableCell>{hpt.supervisor}</TableCell>
                            <TableCell>
                              <Badge variant={hpt.firmado ? 'default' : 'secondary'}>
                                {hpt.firmado ? 'Firmado' : hpt.estado || 'Borrador'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="link" size="sm">Ver</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-zinc-700 mb-3">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-1 text-green-600" />
                      Anexo Bravo
                    </div>
                  </h4>
                  {anexoBravoOperacion.length === 0 ? (
                    <div className="text-center py-8 border border-dashed rounded-lg">
                      <FileText className="w-8 h-8 mx-auto text-zinc-300 mb-2" />
                      <p className="text-zinc-500">No hay documentos Anexo Bravo para esta operación</p>
                      <Button 
                        variant="link" 
                        className="mt-2"
                        onClick={() => setShowAnexoBravo(true)}
                      >
                        Crear Anexo Bravo
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Código</TableHead>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Supervisor</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {anexoBravoOperacion.map(anexo => (
                          <TableRow key={anexo.id}>
                            <TableCell>{anexo.codigo}</TableCell>
                            <TableCell>{anexo.fecha ? formatDate(anexo.fecha) : 'Sin fecha'}</TableCell>
                            <TableCell>{anexo.supervisor}</TableCell>
                            <TableCell>
                              <Badge variant={anexo.firmado ? 'default' : 'secondary'}>
                                {anexo.firmado ? 'Firmado' : anexo.estado || 'Borrador'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="link" size="sm">Ver</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modal para crear Anexo Bravo */}
          <Dialog open={showAnexoBravo} onOpenChange={setShowAnexoBravo}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <FullAnexoBravoForm 
                onSubmit={handleAnexoBravoComplete}
                onCancel={() => setShowAnexoBravo(false)}
                operacionId={operacion.id}
              />
            </DialogContent>
          </Dialog>

          {/* Modal para crear HPT */}
          <Dialog open={showHPT} onOpenChange={setShowHPT}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <HPTForm 
                onSubmit={handleHPTComplete}
                onCancel={() => setShowHPT(false)}
                operacionId={operacion.id}
              />
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="equipo" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-zinc-900">Equipo de Buceo Asignado</h3>
              </div>

              {!equipoAsignado ? (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <Users className="w-8 h-8 mx-auto text-zinc-300 mb-2" />
                  <p className="text-zinc-500">No hay equipo de buceo asignado a esta operación</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-lg">{equipoAsignado.nombre}</h3>
                        <p className="text-zinc-500">{equipoAsignado.descripcion}</p>
                      </div>
                      <Badge>{equipoAsignado.miembros?.length || 0} miembros</Badge>
                    </div>
                  </div>

                  {equipoAsignado.miembros && equipoAsignado.miembros.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Rol</TableHead>
                          <TableHead>Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {equipoAsignado.miembros.map(miembro => (
                          <TableRow key={miembro.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-blue-700 font-medium">
                                    {miembro.nombre_completo?.charAt(0).toUpperCase() || 'U'}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium">{miembro.nombre_completo}</div>
                                  {miembro.email && (
                                    <div className="text-xs text-zinc-500">{miembro.email}</div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                miembro.rol === 'supervisor' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }>
                                {miembro.rol === 'supervisor' ? 'Supervisor' : 'Buzo'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={miembro.disponible ? "default" : "secondary"}>
                                {miembro.disponible ? 'Disponible' : 'No disponible'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-zinc-500">Este equipo no tiene miembros asignados</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inmersiones" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-zinc-900">Inmersiones programadas</h3>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva inmersión
                </Button>
              </div>

              <div className="text-center py-8 border border-dashed rounded-lg">
                <Anchor className="w-8 h-8 mx-auto text-zinc-300 mb-2" />
                <p className="text-zinc-500">No hay inmersiones programadas para esta operación</p>
                <p className="text-xs text-zinc-400 mt-1">
                  Para crear una inmersión, debe haber documentos HPT y Anexo Bravo aprobados
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
