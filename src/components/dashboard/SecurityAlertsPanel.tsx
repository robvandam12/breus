
import React, { useState, useMemo } from "react";
import { useSecurityAlerts } from "@/hooks/useSecurityAlerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, ShieldCheck, ShieldX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertsFilters } from "./alerts/AlertsFilters";
import { AlertCard } from "./alerts/AlertCard";

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
        <AlertsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          showAcknowledged={showAcknowledged}
          setShowAcknowledged={setShowAcknowledged}
        />
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
            {filteredAlerts.map((alert) => (
                <AlertCard
                    key={alert.id}
                    alert={alert}
                    onAcknowledge={acknowledgeAlert}
                    isAcknowledging={isAcknowledging}
                />
            ))}
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
