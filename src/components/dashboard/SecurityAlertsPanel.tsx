import React, { useState, useMemo } from "react";
import { useSecurityAlerts } from "@/hooks/useSecurityAlerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, BellRing, CheckCircle, ShieldCheck, Search, ShieldX, ChevronsUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const SecurityAlertsPanel = () => {
  const { alerts, isLoading, acknowledgeAlert, isAcknowledging } = useSecurityAlerts();
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAcknowledged, setShowAcknowledged] = useState('unacknowledged');

  const filteredAlerts = useMemo(() => {
    return alerts
      .filter(a => showAcknowledged === 'all' ? true : !a.acknowledged)
      .filter(a => filterPriority === 'all' || a.priority === filterPriority)
      .filter(a => {
        const code = a.details?.inmersion_code || a.inmersion?.codigo || '';
        const type = a.type.toLowerCase();
        const term = searchTerm.toLowerCase();
        return code.toLowerCase().includes(term) || type.includes(term);
      });
  }, [alerts, showAcknowledged, filterPriority, searchTerm]);

  const handleAcknowledgeAll = () => {
    filteredAlerts.forEach(alert => {
      if (!alert.acknowledged) {
        acknowledgeAlert(alert.id);
      }
    });
  };

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

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <Card className="ios-card">
      <CardHeader>
        <div className="flex justify-between items-start flex-wrap gap-2">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                {unacknowledgedCount > 0 ? 
                    <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" /> : 
                    <ShieldCheck className="w-6 h-6 text-green-600" />
                }
                Alertas de Seguridad
            </CardTitle>
            {unacknowledgedCount > 0 && <Badge variant="destructive">{unacknowledgedCount} sin reconocer</Badge>}
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por código o tipo..." className="pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Toda Prioridad</SelectItem>
                    <SelectItem value="critical">Crítica</SelectItem>
                    <SelectItem value="emergency">Emergencia</SelectItem>
                    <SelectItem value="warning">Advertencia</SelectItem>
                </SelectContent>
            </Select>
            <ToggleGroup type="single" value={showAcknowledged} onValueChange={val => val && setShowAcknowledged(val)} className="w-full sm:w-auto">
                <ToggleGroupItem value="unacknowledged">Activas</ToggleGroupItem>
                <ToggleGroupItem value="all">Todas</ToggleGroupItem>
            </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        {filteredAlerts.length === 0 ? (
           <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">
             <ShieldX className="w-12 h-12 mx-auto text-zinc-400 mb-4" />
             <p className="font-medium">No se encontraron alertas</p>
             <p className="text-sm">{alerts.length > 0 ? 'Prueba a cambiar los filtros.' : 'El sistema no ha detectado alertas.'}</p>
           </div>
        ) : (
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {filteredAlerts.map((alert) => {
              const { icon: Icon, color, bgColor } = getPriorityProps(alert.priority);
              const inmersionCode = alert.details?.inmersion_code || alert.inmersion?.codigo || 'N/A';
              return (
                <div key={alert.id} className={`p-4 rounded-xl border ${alert.acknowledged ? 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700' : 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10'}`}>
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
                                <div className="flex items-center gap-2">
                                  {alert.escalation_level > 0 && !alert.acknowledged && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700">
                                            <ChevronsUp className="w-3.5 h-3.5 mr-1" />
                                            Nivel {alert.escalation_level}
                                          </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Alerta escalada {alert.escalation_level} {alert.escalation_level > 1 ? 'veces' : 'vez'}.</p>
                                          {alert.last_escalated_at && <p className="text-xs text-muted-foreground">Última vez: {new Date(alert.last_escalated_at).toLocaleString('es-CL')}</p>}
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                  <Badge variant={alert.acknowledged ? 'secondary' : 'destructive'} className="capitalize">{alert.priority}</Badge>
                                </div>
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
                                {!alert.acknowledged && (
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
                                    Reconocer
                                </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Marcar esta alerta como vista y gestionada.</p>
                                </TooltipContent>
                                </Tooltip>
                                </TooltipProvider>
                                )}
                            </div>
                        </div>
                   </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        )}
         {filteredAlerts.filter(a => !a.acknowledged).length > 1 && (
            <div className="mt-4 flex justify-end">
                <Button onClick={handleAcknowledgeAll} disabled={isAcknowledging} variant="outline">
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Reconocer {filteredAlerts.filter(a => !a.acknowledged).length} Alertas Visibles
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
};
