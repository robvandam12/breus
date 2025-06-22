
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SystemMetrics {
  totalCompanies: number;
  totalUsers: number;
  totalOperations: number;
  activeAlerts: number;
  moduleUsage: Record<string, number>;
  recentActivity: {
    date: string;
    operations: number;
    users: number;
    immersions: number;
  }[];
}

export const useSystemMetrics = () => {
  return useQuery({
    queryKey: ['system-metrics-detailed'],
    queryFn: async (): Promise<SystemMetrics> => {
      // Obtener métricas básicas del sistema
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

      // Obtener actividad reciente (últimos 7 días)
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const recentActivity = await Promise.all(
        dates.map(async (date) => {
          const [operationsResult, usersResult, immersionsResult] = await Promise.all([
            supabase
              .from('operacion')
              .select('id', { count: 'exact' })
              .gte('created_at', `${date}T00:00:00`)
              .lt('created_at', `${date}T23:59:59`),
            supabase
              .from('usuario_actividad')
              .select('usuario_id', { count: 'exact' })
              .gte('created_at', `${date}T00:00:00`)
              .lt('created_at', `${date}T23:59:59`),
            supabase
              .from('inmersion')
              .select('inmersion_id', { count: 'exact' })
              .gte('created_at', `${date}T00:00:00`)
              .lt('created_at', `${date}T23:59:59`)
          ]);

          return {
            date: new Date(date).toLocaleDateString('es-ES', { 
              month: 'short', 
              day: 'numeric' 
            }),
            operations: operationsResult.count || 0,
            users: usersResult.count || 0,
            immersions: immersionsResult.count || 0
          };
        })
      );

      return {
        totalCompanies: companiesResult.count || 0,
        totalUsers: usersResult.count || 0,
        totalOperations: operationsResult.count || 0,
        activeAlerts: alertsResult.count || 0,
        moduleUsage: modulesUsage,
        recentActivity
      };
    },
    refetchInterval: 60000, // Actualizar cada minuto
    staleTime: 30000, // Considerar datos frescos por 30 segundos
  });
};
