
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Users, Activity, AlertTriangle } from 'lucide-react';

interface SystemMetrics {
  total_companies: number;
  active_users: number;
  total_operations: number;
  active_alerts: number;
  modules_usage: Record<string, number>;
}

const SystemControlPanelWidget = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['system-metrics'],
    queryFn: async (): Promise<SystemMetrics> => {
      // Obtener métricas del sistema
      const [companiesResult, usersResult, operationsResult, alertsResult] = await Promise.all([
        supabase.from('salmoneras').select('id', { count: 'exact' }),
        supabase.from('usuario').select('id', { count: 'exact' }),
        supabase.from('operacion').select('id', { count: 'exact' }),
        supabase.from('security_alerts').select('id', { count: 'exact' }).eq('acknowledged', false)
      ]);

      // Obtener uso de módulos
      const { data: moduleUsage } = await supabase
        .from('company_modules')
        .select('module_name')
        .eq('is_active', true);

      const modulesUsage = moduleUsage?.reduce((acc, curr) => {
        acc[curr.module_name] = (acc[curr.module_name] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      return {
        total_companies: companiesResult.count || 0,
        active_users: usersResult.count || 0,
        total_operations: operationsResult.count || 0,
        active_alerts: alertsResult.count || 0,
        modules_usage: modulesUsage
      };
    },
    refetchInterval: 30000, // Actualizar cada 30 segundos
  });

  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Empresas Totales',
      value: metrics.total_companies,
      icon: Building,
      color: 'text-blue-600'
    },
    {
      title: 'Usuarios Activos',
      value: metrics.active_users,
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Operaciones',
      value: metrics.total_operations,
      icon: Activity,
      color: 'text-purple-600'
    },
    {
      title: 'Alertas Activas',
      value: metrics.active_alerts,
      icon: AlertTriangle,
      color: 'text-red-600'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${card.color}`} />
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Uso de Módulos por Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(metrics.modules_usage).map(([module, count]) => (
              <Badge key={module} variant="outline" className="text-xs">
                {module}: {count}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemControlPanelWidget;
