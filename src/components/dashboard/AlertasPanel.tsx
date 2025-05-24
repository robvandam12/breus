
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Clock, FileText, CheckCircle2 } from "lucide-react";
import { useAlertas, Alerta } from "@/hooks/useAlertas";

export const AlertasPanel = () => {
  const { alertas, alertasNoLeidas, marcarComoLeida } = useAlertas();

  const getIconForTipo = (tipo: Alerta['tipo']) => {
    switch (tipo) {
      case 'bitacora_pendiente':
        return FileText;
      case 'inmersion_sin_validar':
        return AlertTriangle;
      case 'operacion_vencida':
        return Clock;
      case 'hpt_pendiente':
        return FileText;
      default:
        return AlertTriangle;
    }
  };

  const getColorForPrioridad = (prioridad: Alerta['prioridad']) => {
    switch (prioridad) {
      case 'alta':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'media':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
      case 'baja':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
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

  if (alertas.length === 0) {
    return (
      <Card className="ios-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Sistema Operativo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 mx-auto text-green-600 mb-4" />
            <p className="text-zinc-600 dark:text-zinc-400">
              No hay alertas activas en el sistema
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="ios-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Alertas Activas
          </CardTitle>
          {alertasNoLeidas.length > 0 && (
            <Badge variant="destructive" className="text-xs">
              {alertasNoLeidas.length} nuevas
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {alertas.map((alerta) => {
              const Icon = getIconForTipo(alerta.tipo);
              return (
                <div
                  key={alerta.id}
                  className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                    alerta.leida 
                      ? 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700'
                      : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      alerta.prioridad === 'alta' ? 'bg-red-100 dark:bg-red-900/20' :
                      alerta.prioridad === 'media' ? 'bg-amber-100 dark:bg-amber-900/20' :
                      'bg-green-100 dark:bg-green-900/20'
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        alerta.prioridad === 'alta' ? 'text-red-600 dark:text-red-400' :
                        alerta.prioridad === 'media' ? 'text-amber-600 dark:text-amber-400' :
                        'text-green-600 dark:text-green-400'
                      }`} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className={`font-medium leading-snug ${
                          alerta.leida ? 'text-gray-600 dark:text-gray-400' : 'text-zinc-900 dark:text-zinc-100'
                        }`}>
                          {alerta.titulo}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getColorForPrioridad(alerta.prioridad)}`}
                        >
                          {alerta.prioridad.charAt(0).toUpperCase() + alerta.prioridad.slice(1)}
                        </Badge>
                      </div>
                      <p className={`text-sm ${
                        alerta.leida ? 'text-gray-500 dark:text-gray-500' : 'text-zinc-600 dark:text-zinc-400'
                      }`}>
                        {alerta.descripcion}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-500 dark:text-zinc-500">
                          {formatearFecha(alerta.fecha_creacion)}
                        </span>
                        {!alerta.leida && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => marcarComoLeida(alerta.id)}
                            className="text-xs h-7"
                          >
                            Marcar como leída
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
