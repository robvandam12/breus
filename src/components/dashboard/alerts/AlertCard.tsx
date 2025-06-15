
import React from 'react';
import type { SecurityAlert } from "@/types/security";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertTriangle, BellRing, ShieldCheck, ChevronsUp } from "lucide-react";

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
    if (key === 'inmersion_code') return null;
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

interface AlertCardProps {
    alert: SecurityAlert;
    onAcknowledge: (alertId: string) => void;
    isAcknowledging: boolean;
}

export const AlertCard = ({ alert, onAcknowledge, isAcknowledging }: AlertCardProps) => {
    const { icon: Icon, color, bgColor } = getPriorityProps(alert.priority);
    const inmersionCode = alert.details?.inmersion_code || alert.inmersion?.codigo || 'N/A';

    return (
        <div className={`p-4 rounded-xl border ${alert.acknowledged ? 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700' : 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10'}`}>
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
                            onClick={() => onAcknowledge(alert.id)}
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
};
