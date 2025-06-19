
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Calendar, Clock, Waves, Eye, Edit } from "lucide-react";
import { useInmersiones } from "@/hooks/useInmersiones";
import { InmersionBitacorasStatus } from "./InmersionBitacorasStatus";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface OperacionInmersionesProps {
  operacionId: string;
  canCreateInmersiones?: boolean;
  onNewInmersion?: () => void;
}

export const OperacionInmersiones = ({ 
  operacionId, 
  canCreateInmersiones = false,
  onNewInmersion 
}: OperacionInmersionesProps) => {
  const { inmersiones, isLoading } = useInmersiones(operacionId);
  const [selectedInmersion, setSelectedInmersion] = useState<any>(null);
  const [showInmersionDetail, setShowInmersionDetail] = useState(false);

  const operacionInmersiones = inmersiones.filter(i => i.operacion_id === operacionId);

  const getEstadoBadge = (estado: string) => {
    const colors = {
      'planificada': 'bg-blue-100 text-blue-700',
      'en_progreso': 'bg-yellow-100 text-yellow-700',
      'completada': 'bg-green-100 text-green-700',
      'cancelada': 'bg-red-100 text-red-700'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const handleViewDetail = (inmersion: any) => {
    setSelectedInmersion(inmersion);
    setShowInmersionDetail(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Cargando inmersiones...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Waves className="w-5 h-5 text-blue-600" />
              Inmersiones ({operacionInmersiones.length})
            </CardTitle>
            {canCreateInmersiones && (
              <Button onClick={onNewInmersion}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Inmersión
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {operacionInmersiones.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Waves className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No hay inmersiones</h3>
              <p className="text-sm text-gray-500 mb-4">
                {canCreateInmersiones 
                  ? "Cree la primera inmersión para esta operación"
                  : "Complete los documentos requeridos para poder crear inmersiones"
                }
              </p>
              {canCreateInmersiones && (
                <Button onClick={onNewInmersion} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primera Inmersión
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Buzo Principal</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Profundidad Máx.</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operacionInmersiones.map((inmersion) => (
                    <TableRow key={inmersion.inmersion_id}>
                      <TableCell className="font-medium">
                        {inmersion.codigo}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-sm">
                            {format(new Date(inmersion.fecha_inmersion), 'dd/MM/yyyy', { locale: es })}
                          </span>
                        </div>
                        {inmersion.hora_inicio && (
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {inmersion.hora_inicio}
                              {inmersion.hora_fin && ` - ${inmersion.hora_fin}`}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {inmersion.buzo_principal || 'Sin asignar'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getEstadoBadge(inmersion.estado)}>
                          {inmersion.estado.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {inmersion.profundidad_max}m
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(inmersion)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Ver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(inmersion)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estado de Bitácoras por Inmersión */}
      {operacionInmersiones.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Estado de Bitácoras por Inmersión</h3>
          {operacionInmersiones.map((inmersion) => (
            <InmersionBitacorasStatus
              key={inmersion.inmersion_id}
              inmersionId={inmersion.inmersion_id}
              inmersionCodigo={inmersion.codigo}
            />
          ))}
        </div>
      )}

      {/* Modal de Detalle de Inmersión */}
      <Dialog open={showInmersionDetail} onOpenChange={setShowInmersionDetail}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Detalle de Inmersión - {selectedInmersion?.codigo}
            </DialogTitle>
          </DialogHeader>
          {selectedInmersion && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Información General</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Código</label>
                      <p className="text-sm">{selectedInmersion.codigo}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Fecha</label>
                      <p className="text-sm">
                        {format(new Date(selectedInmersion.fecha_inmersion), 'dd/MM/yyyy', { locale: es })}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Estado</label>
                      <Badge className={getEstadoBadge(selectedInmersion.estado)}>
                        {selectedInmersion.estado.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Objetivo</label>
                      <p className="text-sm">{selectedInmersion.objetivo}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Personal</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Supervisor</label>
                      <p className="text-sm">{selectedInmersion.supervisor || 'Sin asignar'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Buzo Principal</label>
                      <p className="text-sm">{selectedInmersion.buzo_principal || 'Sin asignar'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Buzo Asistente</label>
                      <p className="text-sm">{selectedInmersion.buzo_asistente || 'Sin asignar'}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Condiciones</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Profundidad Máxima</label>
                      <p className="text-sm">{selectedInmersion.profundidad_max}m</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Temperatura del Agua</label>
                      <p className="text-sm">{selectedInmersion.temperatura_agua}°C</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Visibilidad</label>
                      <p className="text-sm">{selectedInmersion.visibilidad}m</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Corriente</label>
                      <p className="text-sm">{selectedInmersion.corriente}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Horarios</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Hora de Inicio</label>
                      <p className="text-sm">{selectedInmersion.hora_inicio || 'Sin definir'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Hora de Fin</label>
                      <p className="text-sm">{selectedInmersion.hora_fin || 'Sin definir'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Tiempo Planeado en Fondo</label>
                      <p className="text-sm">{selectedInmersion.planned_bottom_time || 'No definido'} min</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selectedInmersion.observaciones && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Observaciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedInmersion.observaciones}</p>
                  </CardContent>
                </Card>
              )}

              {/* Estado de Bitácoras en el Detalle */}
              <InmersionBitacorasStatus
                inmersionId={selectedInmersion.inmersion_id}
                inmersionCodigo={selectedInmersion.codigo}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
