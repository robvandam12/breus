
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, FileText, Anchor, Users, AlertTriangle } from "lucide-react";
import { useBitacoras } from "@/hooks/useBitacoras";
import { useInmersiones } from "@/hooks/useInmersiones";
import { useOperaciones } from "@/hooks/useOperaciones";

export const RecentActivity = () => {
  const { bitacorasSupervisor, bitacorasBuzo } = useBitacoras();
  const { inmersiones } = useInmersiones();
  const { operaciones } = useOperaciones();

  // Combinar todas las actividades recientes
  const recentActivities = [
    ...bitacorasSupervisor.slice(0, 3).map(b => ({
      id: b.id,
      tipo: 'bitacora_supervisor' as const,
      titulo: `Bitácora Supervisor ${b.codigo}`,
      descripcion: `Supervisor: ${b.supervisor}`,
      fecha: b.created_at,
      estado: b.firmado ? 'completado' : 'pendiente',
      icon: FileText
    })),
    ...bitacorasBuzo.slice(0, 3).map(b => ({
      id: b.id,
      tipo: 'bitacora_buzo' as const,
      titulo: `Bitácora Buzo ${b.codigo}`,
      descripcion: `Buzo: ${b.buzo}`,
      fecha: b.created_at,
      estado: b.firmado ? 'completado' : 'pendiente',
      icon: FileText
    })),
    ...inmersiones.slice(0, 3).map(i => ({
      id: i.id,
      tipo: 'inmersion' as const,
      titulo: `Inmersión ${i.codigo}`,
      descripcion: `Buzo: ${i.buzo_principal}`,
      fecha: i.created_at,
      estado: i.estado,
      icon: Anchor
    })),
    ...operaciones.slice(0, 2).map(o => ({
      id: o.id,
      tipo: 'operacion' as const,
      titulo: `Operación ${o.codigo}`,
      descripcion: o.nombre,
      fecha: o.created_at,
      estado: o.estado,
      icon: Users
    }))
  ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
   .slice(0, 8);

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'completado':
      case 'completada':
      case 'firmado':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pendiente':
      case 'planificada':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
      case 'en_ejecucion':
      case 'activa':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="ios-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-zinc-600" />
          Actividad Reciente
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentActivities.length > 0 ? (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={`${activity.tipo}-${activity.id}`}
                    className="flex items-start gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                            {activity.titulo}
                          </h4>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                            {activity.descripcion}
                          </p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getStatusColor(activity.estado)} flex-shrink-0`}
                        >
                          {activity.estado === 'completado' || activity.estado === 'completada' ? 'Completado' :
                           activity.estado === 'pendiente' ? 'Pendiente' :
                           activity.estado === 'planificada' ? 'Planificada' :
                           activity.estado === 'en_ejecucion' ? 'En Ejecución' :
                           activity.estado === 'activa' ? 'Activa' : activity.estado}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-zinc-500">
                          {formatearFecha(activity.fecha)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 mx-auto text-zinc-400 mb-4" />
              <p className="text-zinc-600 dark:text-zinc-400">
                No hay actividad reciente
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
