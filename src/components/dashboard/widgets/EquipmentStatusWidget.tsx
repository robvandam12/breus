
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { useEquiposBuceoEnhanced } from '@/hooks/useEquiposBuceoEnhanced';

export const EquipmentStatusWidget = () => {
  const { equipos, isLoading } = useEquiposBuceoEnhanced();

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Estado de Cuadrillas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalEquipos = equipos.length;
  const equiposActivos = equipos.filter(e => e.activo).length;
  const disponibilidadPercentage = totalEquipos > 0 ? (equiposActivos / totalEquipos) * 100 : 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Estado de Cuadrillas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Disponibilidad General</span>
          <span className="text-sm text-muted-foreground">
            {equiposActivos}/{totalEquipos}
          </span>
        </div>
        <Progress value={disponibilidadPercentage} className="w-full" />

        <div className="space-y-3">
          {equipos.slice(0, 4).map((equipo) => (
            <div key={equipo.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {equipo.activo ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                  )}
                  <span className="text-sm font-medium">{equipo.nombre}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={equipo.activo ? "default" : "secondary"}>
                  {equipo.miembros?.filter(m => m.disponible).length || 0} disponibles
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {equipos.length > 4 && (
          <div className="text-center pt-2">
            <span className="text-xs text-muted-foreground">
              +{equipos.length - 4} cuadrillas más
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
