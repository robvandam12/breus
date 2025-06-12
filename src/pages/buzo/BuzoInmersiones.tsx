
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Anchor, Calendar, User, Thermometer, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useInmersiones } from '@/hooks/useInmersiones';
import { useOperaciones } from '@/hooks/useOperaciones';
import { MainLayout } from '@/components/layout/MainLayout';

export default function BuzoInmersiones() {
  const { profile } = useAuth();
  const { inmersiones } = useInmersiones();
  const { operaciones } = useOperaciones();

  const nombreBuzo = `${profile?.nombre} ${profile?.apellido}`;

  // Filtrar inmersiones donde el buzo participó
  const buzoInmersiones = inmersiones.filter(i => 
    i.buzo_principal === nombreBuzo || 
    i.buzo_asistente === nombreBuzo
  );

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

  const getRolBuzo = (inmersion: any) => {
    if (inmersion.buzo_principal === nombreBuzo) return 'Principal';
    if (inmersion.buzo_asistente === nombreBuzo) return 'Asistente';
    return '';
  };

  return (
    <MainLayout 
      title="Mis Inmersiones" 
      subtitle="Registro de inmersiones donde has participado"
      icon={Anchor}
    >
      {buzoInmersiones.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Anchor className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay inmersiones</h3>
            <p className="text-gray-600">
              Aún no has participado en inmersiones de buceo.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buzoInmersiones.map((inmersion) => {
            const operacion = getOperacionData(inmersion.operacion_id);
            const rolBuzo = getRolBuzo(inmersion);
            
            return (
              <Card key={inmersion.inmersion_id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{inmersion.codigo}</CardTitle>
                    <Badge className={getEstadoBadgeColor(inmersion.estado)}>
                      {inmersion.estado}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{rolBuzo}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {operacion && (
                    <div className="text-sm">
                      <span className="font-medium">Operación:</span> {operacion.codigo}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(inmersion.fecha_inmersion).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>Supervisor: {inmersion.supervisor}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Anchor className="w-3 h-3" />
                      <span>{inmersion.profundidad_max}m</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Thermometer className="w-3 h-3" />
                      <span>{inmersion.temperatura_agua}°C</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{inmersion.visibilidad}m</span>
                    </div>
                  </div>

                  <div className="text-sm">
                    <span className="font-medium">Objetivo:</span>
                    <p className="text-gray-700 mt-1 line-clamp-2">{inmersion.objetivo}</p>
                  </div>

                  {inmersion.observaciones && (
                    <div className="text-sm">
                      <span className="font-medium">Observaciones:</span>
                      <p className="text-gray-700 mt-1 line-clamp-1">{inmersion.observaciones}</p>
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
