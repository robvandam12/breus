
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Activity, Users, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const ModuleStatsPanel = () => {
  // Obtener estadísticas de uso de módulos
  const { data: usageStats } = useQuery({
    queryKey: ['module-usage-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('module_usage_stats')
        .select('*')
        .gte('date_recorded', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date_recorded', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Obtener logs de activación
  const { data: activationLogs } = useQuery({
    queryKey: ['recent-activation-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('module_activation_logs')
        .select(`
          *,
          salmoneras:company_id(nombre),
          contratistas:company_id(nombre)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
  });

  // Procesar estadísticas
  const processedStats = React.useMemo(() => {
    if (!usageStats) return null;

    const totalUsage = usageStats.reduce((acc, stat) => acc + (Number(stat.usage_count) || 0), 0);
    const avgDailyUsage = usageStats.length > 0 ? totalUsage / usageStats.length : 0;
    
    const usageByModule = usageStats.reduce((acc, stat) => {
      const moduleName = stat.module_name || 'unknown';
      const usageCount = Number(stat.usage_count) || 0;
      acc[moduleName] = (acc[moduleName] || 0) + usageCount;
      return acc;
    }, {} as Record<string, number>);

    const activeUsers = usageStats.reduce((acc, stat) => acc + (Number(stat.active_users) || 0), 0);

    return {
      totalUsage,
      avgDailyUsage: Math.round(avgDailyUsage),
      usageByModule,
      activeUsers,
    };
  }, [usageStats]);

  return (
    <div className="space-y-6">
      {/* KPIs de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Uso Total (30 días)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {processedStats?.totalUsage || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Promedio Diario</p>
                <p className="text-2xl font-bold text-gray-900">
                  {processedStats?.avgDailyUsage || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {processedStats?.activeUsers || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cambios Recientes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activationLogs?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Uso por módulo */}
      <Card>
        <CardHeader>
          <CardTitle>Uso por Módulo (Últimos 30 días)</CardTitle>
        </CardHeader>
        <CardContent>
          {processedStats?.usageByModule && Object.keys(processedStats.usageByModule).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(processedStats.usageByModule)
                .sort(([,a], [,b]) => b - a)
                .map(([moduleName, usage]) => (
                  <div key={moduleName} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{String(moduleName)}</h4>
                      <p className="text-sm text-gray-600">Operaciones realizadas</p>
                    </div>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {String(usage)}
                    </Badge>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No hay datos de uso disponibles</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logs de activación recientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Actividades Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activationLogs && activationLogs.length > 0 ? (
            <div className="space-y-3">
              {activationLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={
                        log.action === 'activated' ? 'bg-green-100 text-green-800' :
                        log.action === 'deactivated' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }>
                        {log.action === 'activated' ? 'Activado' :
                         log.action === 'deactivated' ? 'Desactivado' : 'Configurado'}
                      </Badge>
                      <span className="font-medium">{log.module_name || 'Módulo desconocido'}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {log.company_type === 'salmonera' ? 'Salmonera' : 'Contratista'}: 
                      {log.company_id}
                    </p>
                    {log.reason && (
                      <p className="text-xs text-gray-500 mt-1">{log.reason}</p>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(log.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No hay actividades recientes</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
