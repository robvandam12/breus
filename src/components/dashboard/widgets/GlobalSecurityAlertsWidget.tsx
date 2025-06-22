
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface SecurityAlert {
  id: string;
  type: string;
  priority: string;
  created_at: string;
  acknowledged: boolean;
  inmersion_id: string;
  details: any;
}

const GlobalSecurityAlertsWidget = () => {
  const { data: alerts, isLoading, refetch } = useQuery({
    queryKey: ['global-security-alerts'],
    queryFn: async (): Promise<SecurityAlert[]> => {
      const { data, error } = await supabase
        .from('security_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000,
  });

  const handleAcknowledge = async (alertId: string) => {
    await supabase
      .from('security_alerts')
      .update({ 
        acknowledged: true, 
        acknowledged_at: new Date().toISOString() 
      })
      .eq('id', alertId);
    
    refetch();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'warning': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return AlertTriangle;
      case 'high': return AlertTriangle;
      case 'warning': return Shield;
      default: return Shield;
    }
  };

  if (isLoading || !alerts) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Cargando alertas...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeAlerts = alerts.filter(alert => !alert.acknowledged);
  const acknowledgedAlerts = alerts.filter(alert => alert.acknowledged);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        <CardTitle className="text-sm font-medium">
          Alertas de Seguridad ({activeAlerts.length} activas)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <Shield className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-sm">No hay alertas de seguridad</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {alerts.map((alert) => {
              const Icon = getPriorityIcon(alert.priority);
              return (
                <div
                  key={alert.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    alert.acknowledged ? 'bg-gray-50 opacity-60' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Icon className={`w-4 h-4 ${alert.acknowledged ? 'text-gray-400' : 'text-red-500'}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{alert.type}</span>
                        <Badge variant={getPriorityColor(alert.priority)} className="text-xs">
                          {alert.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {format(new Date(alert.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                      </div>
                    </div>
                  </div>
                  {!alert.acknowledged ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAcknowledge(alert.id)}
                      className="text-xs"
                    >
                      Reconocer
                    </Button>
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GlobalSecurityAlertsWidget;
