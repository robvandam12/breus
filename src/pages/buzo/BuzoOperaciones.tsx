
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Building, Users } from 'lucide-react';
import { useOperaciones } from '@/hooks/useOperaciones';
import { useInmersiones } from '@/hooks/useInmersiones';
import { useAuth } from '@/hooks/useAuth';
import { useSalmoneras } from '@/hooks/useSalmoneras';
import { useContratistas } from '@/hooks/useContratistas';
import { useSitios } from '@/hooks/useSitios';

export default function BuzoOperaciones() {
  const { profile } = useAuth();
  const { operaciones } = useOperaciones();
  const { inmersiones } = useInmersiones();
  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();
  const { sitios } = useSitios();

  // Filtrar operaciones donde el buzo ha participado
  const buzoOperaciones = operaciones.filter(op => {
    return inmersiones.some(inm => 
      inm.operacion_id === op.id && 
      (inm.buzo_principal === `${profile?.nombre} ${profile?.apellido}` ||
       inm.buzo_asistente === `${profile?.nombre} ${profile?.apellido}`)
    );
  });

  const getSalmoneraName = (id: string) => {
    return salmoneras.find(s => s.id === id)?.nombre || 'Desconocida';
  };

  const getContratistaName = (id: string) => {
    return contratistas.find(c => c.id === id)?.nombre || 'Desconocido';
  };

  const getSitioName = (id: string) => {
    return sitios.find(s => s.id === id)?.nombre || 'Desconocido';
  };

  const getOperacionInmersiones = (operacionId: string) => {
    return inmersiones.filter(inm => 
      inm.operacion_id === operacionId && 
      (inm.buzo_principal === `${profile?.nombre} ${profile?.apellido}` ||
       inm.buzo_asistente === `${profile?.nombre} ${profile?.apellido}`)
    );
  };

  return (
    <MainLayout
      title="Mis Operaciones"
      subtitle="Historial de operaciones donde has participado"
      icon={Calendar}
    >
      <div className="space-y-6">
        {/* Resumen */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Resumen de Participación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{buzoOperaciones.length}</div>
                <div className="text-sm text-gray-600">Operaciones Totales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {buzoOperaciones.filter(op => op.estado === 'finalizada').length}
                </div>
                <div className="text-sm text-gray-600">Finalizadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {buzoOperaciones.filter(op => op.estado === 'activa').length}
                </div>
                <div className="text-sm text-gray-600">En Curso</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Operaciones */}
        <div className="grid gap-4">
          {buzoOperaciones.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Sin operaciones registradas
                </h3>
                <p className="text-gray-600">
                  No has participado en ninguna operación aún.
                </p>
              </CardContent>
            </Card>
          ) : (
            buzoOperaciones.map((operacion) => {
              const operacionInmersiones = getOperacionInmersiones(operacion.id);
              
              return (
                <Card key={operacion.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{operacion.nombre}</CardTitle>
                        <p className="text-sm text-gray-600">Código: {operacion.codigo}</p>
                      </div>
                      <Badge variant={operacion.estado === 'activa' ? 'default' : 'secondary'}>
                        {operacion.estado === 'activa' ? 'En Curso' : 'Finalizada'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>
                            {new Date(operacion.fecha_inicio).toLocaleDateString()} - {' '}
                            {operacion.fecha_fin ? new Date(operacion.fecha_fin).toLocaleDateString() : 'En curso'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{getSitioName(operacion.sitio_id)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Building className="w-4 h-4 text-gray-500" />
                          <span>{getSalmoneraName(operacion.salmonera_id)}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Inmersiones realizadas:</span> {operacionInmersiones.length}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Rol principal:</span> {' '}
                          {operacionInmersiones.some(inm => inm.buzo_principal === `${profile?.nombre} ${profile?.apellido}`)
                            ? 'Buzo Principal' : 'Buzo Asistente'}
                        </div>
                        {operacion.tareas && (
                          <div className="text-sm">
                            <span className="font-medium">Tareas:</span>
                            <p className="text-gray-600 mt-1">{operacion.tareas}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </MainLayout>
  );
}
