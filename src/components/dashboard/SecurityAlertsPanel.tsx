
import { useSecurityAlerts } from "@/hooks/useSecurityAlerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, BellRing, CheckCircle, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const SecurityAlertsPanel = () => {
  const { alerts, isLoading, acknowledgeAlert, isAcknowledging } = useSecurityAlerts();

  const getPriorityProps = (priority: string) => {
    switch (priority) {
      case 'critical':
      case 'emergency':
        return { icon: AlertTriangle, color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900/20' };
      case 'warning':
        return { icon: BellRing, color: 'text-amber-500', bgColor: 'bg-amber-100 dark:bg-amber-900/20' };
      default:
        return { icon: AlertTriangle, color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' };
    }
  };

  const formatDetail = (key: string, value: any) => {
    if (key === 'inmersion_code') return null; // Already displayed in title
    const keyMap: { [key: string]: string } = {
        current_depth: "Prof. Actual",
        max_depth: "Prof. Máx. Planif.",
        ascent_rate: "Vel. Ascenso",
        max_ascent_rate: "Vel. Máx. Ascenso",
        current_bottom_time: "T. Fondo Actual",
        planned_bottom_time: "T. Fondo Planif.",
    };
    return `${keyMap[key] || key}: ${value}`;
  }

  if (isLoading) {
    return (
        <Card className="ios-card">
            <CardHeader><CardTitle>Cargando Alertas...</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </CardContent>
        </Card>
    )
  }

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  if (unacknowledgedAlerts.length === 0) {
    return (
      <Card className="ios-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <ShieldCheck className="w-6 h-6 text-green-600" />
            Alertas de Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
            <p className="font-medium">Todo en Orden</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              No hay alertas de seguridad activas en este momento.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="ios-card">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
                Alertas de Seguridad Activas
            </CardTitle>
            <Badge variant="destructive">{unacknowledgedAlerts.length} sin reconocer</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {unacknowledgedAlerts.map((alert) => {
              const { icon: Icon, color, bgColor } = getPriorityProps(alert.priority);
              const inmersionCode = alert.details?.inmersion_code || alert.inmersion?.codigo || 'N/A';
              return (
                <div key={alert.id} className="p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10">
                   <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${bgColor}`}>
                            <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <div className="flex-1 space-y-2">
                             <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                                        {alert.type.replace(/_/g, ' ')}
                                    </h4>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                        Inmersión: <span className="font-semibold">{inmersionCode}</span>
                                    </p>
                                </div>
                                <Badge variant="destructive" className="capitalize">{alert.priority}</Badge>
                            </div>

                            <div className="text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
                                {Object.entries(alert.details).map(([key, value]) => {
                                    const formatted = formatDetail(key, value);
                                    return formatted ? <p key={key}>{formatted}</p> : null;
                                })}
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <span className="text-xs text-zinc-500">
                                    {new Date(alert.created_at).toLocaleString('es-CL')}
                                </span>
                                <TooltipProvider>
                                <Tooltip>
                                <TooltipTrigger asChild>
                                <Button 
                                    size="sm"
                                    onClick={() => acknowledgeAlert(alert.id)}
                                    disabled={isAcknowledging}
                                    variant="destructive"
                                >
                                    <ShieldCheck className="w-4 h-4 mr-2" />
                                    Reconocer Alerta
                                </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Marcar esta alerta como vista y gestionada.</p>
                                </TooltipContent>
                                </Tooltip>
                                </TooltipProvider>
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
