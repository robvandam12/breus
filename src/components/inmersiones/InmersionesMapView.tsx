
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Settings, Trash2 } from "lucide-react";
import type { Inmersion } from '@/hooks/useInmersiones';

interface InmersionesMapViewProps {
  inmersiones: Inmersion[];
  onSelect: (inmersion: Inmersion) => void;
  onViewDetail: (inmersion: Inmersion) => void;
  onEdit: (inmersion: Inmersion) => void;
  onDelete: (inmersion: Inmersion) => void;
}

export const InmersionesMapView = ({ 
  inmersiones, 
  onSelect, 
  onViewDetail, 
  onEdit, 
  onDelete 
}: InmersionesMapViewProps) => {

  const getStatusBadge = (estado: string) => {
    const colors = {
      'planificada': 'bg-blue-100 text-blue-800 border-blue-200',
      'en_progreso': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'completada': 'bg-green-100 text-green-800 border-green-200',
      'cancelada': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[estado as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Placeholder para el mapa - se implementará cuando tengamos las coordenadas de los centros */}
      <Card className="h-96">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Vista de Mapa</h3>
            <p className="text-muted-foreground">
              El mapa se mostrará aquí con las ubicaciones de los centros donde se realizan las inmersiones
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Lista de inmersiones debajo del mapa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inmersiones.map((inmersion) => (
          <Card key={inmersion.inmersion_id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">{inmersion.codigo}</h4>
                  <p className="text-sm text-muted-foreground">{inmersion.objetivo}</p>
                </div>
                <Badge className={getStatusBadge(inmersion.estado)}>
                  {inmersion.estado.replace('_', ' ')}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(inmersion.fecha_inmersion).toLocaleDateString('es-CL')}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{inmersion.buzo_principal || 'No asignado'}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>Prof: {inmersion.profundidad_max}m</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onViewDetail(inmersion)}
                >
                  Ver Detalles
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(inmersion)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => onDelete(inmersion)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
