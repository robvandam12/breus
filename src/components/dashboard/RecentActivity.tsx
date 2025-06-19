
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Users, Waves } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useInmersiones } from "@/hooks/useInmersiones";

export const RecentActivity = () => {
  const { operaciones, isLoading: operacionesLoading } = useOperaciones();
  const { inmersiones, isLoading: inmersionesLoading } = useInmersiones();

  // Asegurar que los datos sean arrays antes de usar slice
  const recentOperaciones = Array.isArray(operaciones) ? operaciones.slice(0, 3) : [];
  const recentInmersiones = Array.isArray(inmersiones) ? inmersiones.slice(0, 2) : [];

  if (operacionesLoading || inmersionesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Actividad Reciente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Operaciones Recientes */}
        {recentOperaciones.map((operacion) => (
          <div key={operacion.id} className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {operacion.nombre}
              </p>
              <p className="text-sm text-gray-500">
                Operación creada - {operacion.codigo}
              </p>
            </div>
            <Badge variant={operacion.estado === 'activa' ? 'default' : 'secondary'}>
              {operacion.estado}
            </Badge>
          </div>
        ))}

        {/* Inmersiones Recientes */}
        {recentInmersiones.map((inmersion) => (
          <div key={inmersion.inmersion_id} className="flex items-center space-x-4 p-3 bg-teal-50 rounded-lg">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
              <Waves className="w-5 h-5 text-teal-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {inmersion.objetivo}
              </p>
              <p className="text-sm text-gray-500">
                Inmersión - {inmersion.codigo}
              </p>
            </div>
            <Badge variant={inmersion.estado === 'completada' ? 'default' : 'secondary'}>
              {inmersion.estado}
            </Badge>
          </div>
        ))}

        {/* Mensaje cuando no hay actividad */}
        {recentOperaciones.length === 0 && recentInmersiones.length === 0 && (
          <div className="text-center py-6">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              No hay actividad reciente
            </h3>
            <p className="text-sm text-gray-500">
              La actividad aparecerá aquí cuando se creen operaciones o inmersiones
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
