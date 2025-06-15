import React from 'react';
import { useSecurityAlerts } from '@/hooks/useSecurityAlerts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldAlert, CheckCircle, Calendar, ShieldCheck } from 'lucide-react';
import { SecurityAlertsWidgetSkeleton } from './skeletons/SecurityAlertsWidgetSkeleton';
import { cn } from '@/lib/utils';
import type { SecurityAlert, SecurityAlertPriority } from '@/types/security';

const getPriorityProps = (priority: SecurityAlertPriority) => {
    switch (priority) {
        case 'emergency':
            return {
                icon: <ShieldAlert className="h-5 w-5 text-red-600" />,
                badgeClass: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
                cardClass: 'border-red-500 border-2 animate-pulse',
            };
        case 'critical':
            return {
                icon: <ShieldAlert className="h-5 w-5 text-orange-600" />,
                badgeClass: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
                cardClass: 'border-orange-400 dark:border-orange-600',
            };
        case 'warning':
            return {
                icon: <ShieldAlert className="h-5 w-5 text-yellow-600" />,
                badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',
                cardClass: 'border-yellow-300 dark:border-yellow-600',
            };
        case 'info':
             return {
                icon: <ShieldAlert className="h-5 w-5 text-blue-600" />,
                badgeClass: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
                cardClass: '',
            };
        default:
            return {
                icon: <ShieldAlert className="h-5 w-5 text-gray-500" />,
                badgeClass: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600',
                cardClass: '',
            };
    }
};

const SecurityAlertsWidget = () => {
    const { alerts, isLoading, acknowledgeAlert, isAcknowledging } = useSecurityAlerts();

    if (isLoading) {
        return <SecurityAlertsWidgetSkeleton />;
    }

    const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-600" />
                    Alertas de Seguridad
                    {unacknowledgedAlerts.length > 0 && (
                        <Badge variant="destructive" className="animate-pulse">{unacknowledgedAlerts.length} nuevas</Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
                {alerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                        <h3 className="font-semibold">Todo en orden</h3>
                        <p>No hay alertas de seguridad activas.</p>
                    </div>
                ) : (
                    <ScrollArea className="h-full pr-4">
                        <div className="space-y-4">
                            {alerts.map((alert) => {
                                const { icon, badgeClass, cardClass } = getPriorityProps(alert.priority);
                                const isAcknowledged = alert.acknowledged;

                                return (
                                    <div key={alert.id} className={cn("p-4 rounded-lg border transition-all", cardClass, isAcknowledged ? 'bg-background/50' : 'bg-card')}>
                                        <div className="flex items-start gap-3">
                                            <div className="pt-1">{icon}</div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="font-semibold text-sm capitalize">{alert.type.replace(/_/g, ' ')}</h4>
                                                    <Badge variant="outline" className={cn("text-xs", badgeClass)}>
                                                        {alert.priority}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {alert.details?.message || `Alerta para inmersión ${alert.inmersion?.codigo || 'desconocida'}`}
                                                </p>
                                                <div className="text-xs text-muted-foreground flex items-center gap-1 pt-1">
                                                    <Calendar className="w-3 h-3"/>
                                                    {new Date(alert.created_at).toLocaleString('es-CL')}
                                                </div>
                                            </div>
                                        </div>
                                        {!isAcknowledged && (
                                            <div className="mt-3 flex justify-end">
                                                <Button size="sm" onClick={() => acknowledgeAlert(alert.id)} disabled={isAcknowledging}>
                                                    <ShieldCheck className="w-4 h-4 mr-2"/>
                                                    Reconocer
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
};

export default React.memo(SecurityAlertsWidget);
