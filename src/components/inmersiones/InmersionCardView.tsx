
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Settings, FileText, Activity, Trash2 } from "lucide-react";
import type { Inmersion } from '@/hooks/useInmersiones';

interface InmersionCardViewProps {
  inmersiones: Inmersion[];
  onSelect: (inmersion: Inmersion) => void;
  onEdit: (inmersion: Inmersion) => void;
  onViewDetail: (inmersion: Inmersion) => void;
  onDelete: (inmersion: Inmersion) => void;
}

export const InmersionCardView = ({ 
  inmersiones, 
  onSelect, 
  onEdit, 
  onViewDetail, 
  onDelete 
}: InmersionCardViewProps) => {

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
      {inmersiones.length === 0 ? (
        <div className="text-center py-12">
          <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No hay inmersiones</h3>
          <p className="text-muted-foreground mb-4">
            No se encontraron inmersiones con los filtros aplicados o aún no se han creado inmersiones.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inmersiones.map((inmersion) => (
            <Card key={inmersion.inmersion_id} className="hover:shadow-md transition-shadow border-border">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground">{inmersion.codigo}</CardTitle>
                    <p className="text-sm text-muted-foreground">{inmersion.objetivo}</p>
                  </div>
                  <Badge className={getStatusBadge(inmersion.estado)}>
                    {inmersion.estado.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(inmersion.fecha_inmersion).toLocaleDateString('es-CL')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>Profundidad: {inmersion.profundidad_max}m</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{inmersion.buzo_principal || 'No asignado'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span>{inmersion.operacion?.nombre || inmersion.operacion_nombre || 'Independiente'}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => onViewDetail(inmersion)}
                  >
                    <FileText className="w-4 h-4 mr-1" />
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
      )}
    </div>
  );
};
