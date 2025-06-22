
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import { useEffect } from 'react';

interface SystemAlert {
  id: string;
  type: 'performance' | 'security' | 'system' | 'user_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  source: string;
  metadata: any;
  resolved: boolean;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
}

interface SystemMetric {
  id: string;
  metric_name: string;
  value: number;
  unit: string;
  threshold_warning?: number;
  threshold_critical?: number;
  recorded_at: string;
  metadata: any;
}

interface MonitoringStats {
  system_health: 'excellent' | 'good' | 'warning' | 'critical';
  active_alerts: number;
  resolved_alerts_24h: number;
  avg_response_time: number;
  system_uptime: number;
  total_operations_today: number;
  error_rate_24h: number;
  user_activity_score: number;
}

export const useSystemMonitoring = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const canMonitorSystem = profile?.role === 'superuser';

  // Obtener alertas del sistema
  const { data: systemAlerts = [], isLoading: isLoadingAlerts } = useQuery({
    queryKey: ['system-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as SystemAlert[];
    },
    enabled: canMonitorSystem,
    refetchInterval: 30000, // Actualizar cada 30 segundos
  });

  // Obtener métricas del sistema
  const { data: systemMetrics = [], isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['system-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_metrics')
        .select('*')
        .gte('recorded_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: false });

      if (error) throw error;
      return data as SystemMetric[];
    },
    enabled: canMonitorSystem,
    refetchInterval: 60000, // Actualizar cada minuto
  });

  // Obtener estadísticas de monitoreo
  const { data: monitoringStats } = useQuery({
    queryKey: ['monitoring-stats'],
    queryFn: async () => {
      // Simular estadísticas (en un caso real vendrían de la BD o API)
      const activeAlerts = systemAlerts.filter(a => !a.resolved).length;
      const resolvedAlerts24h = systemAlerts.filter(a => 
        a.resolved && new Date(a.resolved_at || '').getTime() > Date.now() - 24 * 60 * 60 * 1000
      ).length;

      // Calcular salud del sistema basado en alertas activas
      let systemHealth: MonitoringStats['system_health'] = 'excellent';
      const criticalAlerts = systemAlerts.filter(a => !a.resolved && a.severity === 'critical').length;
      const highAlerts = systemAlerts.filter(a => !a.resolved && a.severity === 'high').length;

      if (criticalAlerts > 0) systemHealth = 'critical';
      else if (highAlerts > 2) systemHealth = 'warning';
      else if (activeAlerts > 5) systemHealth = 'good';

      return {
        system_health: systemHealth,
        active_alerts: activeAlerts,
        resolved_alerts_24h: resolvedAlerts24h,
        avg_response_time: Math.round(150 + Math.random() * 100), // Simulated
        system_uptime: 99.8,
        total_operations_today: Math.round(45 + Math.random() * 20),
        error_rate_24h: Math.round((Math.random() * 2) * 100) / 100,
        user_activity_score: Math.round(85 + Math.random() * 10),
      } as MonitoringStats;
    },
    enabled: canMonitorSystem && systemAlerts.length > 0,
    refetchInterval: 60000,
  });

  // Resolver alerta
  const resolveAlertMutation = useMutation({
    mutationFn: async ({ alertId, notes }: { alertId: string; notes?: string }) => {
      const { data, error } = await supabase
        .from('system_alerts')
        .update({
          resolved: true,
          resolved_by: profile?.id,
          resolved_at: new Date().toISOString(),
          metadata: { ...{}, resolution_notes: notes }
        })
        .eq('id', alertId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['monitoring-stats'] });
      toast({
        title: 'Alerta Resuelta',
        description: 'La alerta ha sido marcada como resuelta.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'No se pudo resolver la alerta.',
        variant: 'destructive',
      });
    },
  });

  // Crear alerta personalizada
  const createAlertMutation = useMutation({
    mutationFn: async (alert: Omit<SystemAlert, 'id' | 'created_at' | 'resolved'>) => {
      const { data, error } = await supabase
        .from('system_alerts')
        .insert({
          ...alert,
          resolved: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-alerts'] });
      toast({
        title: 'Alerta Creada',
        description: 'Nueva alerta del sistema ha sido registrada.',
      });
    },
  });

  // Real-time subscription para alertas
  useEffect(() => {
    if (!canMonitorSystem) return;

    const channel = supabase
      .channel('system-monitoring-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'system_alerts' },
        (payload) => {
          const newAlert = payload.new as SystemAlert;
          queryClient.invalidateQueries({ queryKey: ['system-alerts'] });
          
          // Mostrar notificación para alertas críticas
          if (newAlert.severity === 'critical' || newAlert.severity === 'high') {
            toast({
              title: `🚨 ${newAlert.title}`,
              description: newAlert.message,
              variant: 'destructive',
            });
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'system_metrics' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['system-metrics'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [canMonitorSystem, queryClient]);

  const isLoading = isLoadingAlerts || isLoadingMetrics;

  return {
    // Data
    systemAlerts,
    systemMetrics,
    monitoringStats,
    isLoading,
    
    // Permissions
    canMonitorSystem,
    
    // Actions
    resolveAlert: resolveAlertMutation.mutate,
    createAlert: createAlertMutation.mutate,
    isResolvingAlert: resolveAlertMutation.isPending,
    isCreatingAlert: createAlertMutation.isPending,
  };
};
