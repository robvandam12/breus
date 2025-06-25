
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useOperacionesQuery } from '@/hooks/useOperacionesQuery';
import { useInmersiones } from '@/hooks/useInmersiones';
import { useSalmoneras } from '@/hooks/useSalmoneras';
import { useSitios } from '@/hooks/useSitios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function BuzoOperaciones() {
  const { profile } = useAuth();
  const { data: operaciones = [] } = useOperacionesQuery();
  const { inmersiones } = useInmersiones();
  const { salmoneras } = useSalmoneras();
  const { sitios } = useSitios();
  const [buzoOperaciones, setBuzoOperaciones] = useState<any[]>([]);

  useEffect(() => {
    if (!profile) return;

    // Filtrar operaciones donde el buzo participó
    const buzoName = `${profile.nombre} ${profile.apellido}`;
    const buzoInmersiones = inmersiones.filter(i => 
      i.buzo_principal === buzoName || i.buzo_asistente === buzoName
    );

    const operacionesConParticipacion = operaciones
      .filter(op => buzoInmersiones.some(inm => inm.operacion_id === op.id))
      .map(op => {
        const inmersionesOperacion = buzoInmersiones.filter(inm => inm.operacion_id === op.id);
        const salmonera = salmoneras.find(s => s.id === op.salmonera_id);
        const sitio = sitios.find(s => s.id === op.sitio_id);
        
        return {
          ...op,
          inmersiones: inmersionesOperacion,
          salmonera: salmonera?.nombre || 'N/A',
          sitio: sitio?.nombre || 'N/A'
        };
      })
      .sort((a, b) => new Date(b.fecha_inicio).getTime() - new Date(a.fecha_inicio).getTime());

    setBuzoOperaciones(operacionesConParticipacion);
  }, [profile, operaciones, inmersiones, salmoneras, sitios]);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activa': return 'bg-green-100 text-green-800';
      case 'completada': return 'bg-blue-100 text-blue-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout
      title="Mis Operaciones"
      subtitle="Historial de operaciones donde has participado"
      icon={Calendar}
    >
      <div className="space-y-6">
        {buzoOperaciones.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sin operaciones registradas
              </h3>
              <p className="text-gray-500">
                Cuando participes en operaciones, aparecerán aquí.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {buzoOperaciones.map((operacion) => (
              <Card key={operacion.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{operacion.nombre}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {operacion.salmonera} - {operacion.sitio}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}
                        </span>
                      </div>
                    </div>
                    <Badge className={getEstadoColor(operacion.estado)}>
                      {operacion.estado}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Mis Inmersiones en esta Operación</h4>
                      <div className="grid gap-2">
                        {operacion.inmersiones.map((inmersion: any) => (
                          <div key={inmersion.inmersion_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{inmersion.codigo}</span>
                                <Badge variant="outline" className="text-xs">
                                  {inmersion.buzo_principal === `${profile?.nombre} ${profile?.apellido}` ? 'Principal' : 'Asistente'}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600">{inmersion.objetivo}</p>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>{new Date(inmersion.fecha_inmersion).toLocaleDateString('es-CL')}</span>
                                <span>{inmersion.hora_inicio} - {inmersion.hora_fin || 'En curso'}</span>
                                <span>Profundidad: {inmersion.profundidad_max}m</span>
                              </div>
                            </div>
                            <Badge variant={inmersion.estado === 'completada' ? 'default' : 'secondary'}>
                              {inmersion.estado}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalles
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{operacion.nombre}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Código</label>
                              <p className="text-sm text-gray-600">{operacion.codigo}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Estado</label>
                              <Badge className={getEstadoColor(operacion.estado)}>
                                {operacion.estado}
                              </Badge>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Fecha Inicio</label>
                              <p className="text-sm text-gray-600">
                                {new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Fecha Fin</label>
                              <p className="text-sm text-gray-600">
                                {operacion.fecha_fin ? new Date(operacion.fecha_fin).toLocaleDateString('es-CL') : 'No definida'}
                              </p>
                            </div>
                          </div>
                          
                          {operacion.tareas && (
                            <div>
                              <label className="text-sm font-medium">Tareas</label>
                              <p className="text-sm text-gray-600 mt-1">{operacion.tareas}</p>
                            </div>
                          )}

                          <div>
                            <label className="text-sm font-medium">Mis Inmersiones ({operacion.inmersiones.length})</label>
                            <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                              {operacion.inmersiones.map((inmersion: any) => (
                                <div key={inmersion.inmersion_id} className="p-3 border rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">{inmersion.codigo}</span>
                                    <Badge variant="outline">
                                      {inmersion.buzo_principal === `${profile?.nombre} ${profile?.apellido}` ? 'Principal' : 'Asistente'}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{inmersion.objetivo}</p>
                                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                                    <span>Fecha: {new Date(inmersion.fecha_inmersion).toLocaleDateString('es-CL')}</span>
                                    <span>Hora: {inmersion.hora_inicio} - {inmersion.hora_fin || 'En curso'}</span>
                                    <span>Profundidad: {inmersion.profundidad_max}m</span>
                                    <span>Temperatura: {inmersion.temperatura_agua}°C</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
