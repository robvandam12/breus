
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, MapPin, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useOperaciones } from '@/hooks/useOperaciones';
import { useInmersiones } from '@/hooks/useInmersiones';
import { useSitios } from '@/hooks/useSitios';
import { MainLayout } from '@/components/layout/MainLayout';

export default function BuzoOperaciones() {
  const { profile } = useAuth();
  const { operaciones } = useOperaciones();
  const { inmersiones } = useInmersiones();
  const { sitios } = useSitios();

  const nombreBuzo = `${profile?.nombre} ${profile?.apellido}`;

  // Filtrar operaciones donde el buzo participó
  const buzoInmersiones = inmersiones.filter(i => 
    i.buzo_principal === nombreBuzo || 
    i.buzo_asistente === nombreBuzo
  );

  const buzoOperaciones = operaciones.filter(op => 
    buzoInmersiones.some(inm => inm.operacion_id === op.id)
  );

  const getSitioData = (sitioId: string) => {
    return sitios.find(s => s.id === sitioId);
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'activa':
        return 'bg-green-100 text-green-800';
      case 'completada':
        return 'bg-blue-100 text-blue-800';
      case 'pausada':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInmersionesCount = (operacionId: string) => {
    return buzoInmersiones.filter(i => i.operacion_id === operacionId).length;
  };

  return (
    <MainLayout 
      title="Mis Operaciones" 
      subtitle="Operaciones donde has participado como buzo"
      icon={Calendar}
    >
      {buzoOperaciones.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay operaciones</h3>
            <p className="text-gray-600">
              Aún no has participado en operaciones de buceo.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buzoOperaciones.map((operacion) => {
            const sitio = getSitioData(operacion.sitio_id || '');
            const inmersionesCount = getInmersionesCount(operacion.id);
            
            return (
              <Card key={operacion.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{operacion.codigo}</CardTitle>
                    <Badge className={getEstadoBadgeColor(operacion.estado)}>
                      {operacion.estado}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900">{operacion.nombre}</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sitio && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{sitio.nombre}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(operacion.fecha_inicio).toLocaleDateString()}
                      {operacion.fecha_fin && ` - ${new Date(operacion.fecha_fin).toLocaleDateString()}`}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{inmersionesCount} inmersión{inmersionesCount !== 1 ? 'es' : ''}</span>
                  </div>

                  {operacion.tareas && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {operacion.tareas}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
}
