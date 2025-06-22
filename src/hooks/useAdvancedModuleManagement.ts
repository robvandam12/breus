
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

interface ModuleConfiguration {
  id: string;
  module_name: string;
  company_id: string;
  company_type: 'salmonera' | 'contratista';
  config_data: any;
  usage_limits: any;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

interface ModuleUsageStats {
  id: string;
  module_name: string;
  company_id: string;
  company_type: 'salmonera' | 'contratista';
  date_recorded: string;
  usage_count: number;
  active_users: number;
  operations_count: number;
  performance_metrics: any;
}

interface ModuleActivationLog {
  id: string;
  module_name: string;
  company_id: string;
  company_type: 'salmonera' | 'contratista';
  action: 'activated' | 'deactivated' | 'configured';
  previous_state: any;
  new_state: any;
  reason?: string;
  performed_by?: string;
  created_at: string;
}

interface AdvancedModuleStats {
  total_usage: number;
  avg_daily_usage: number;
  usage_by_module: Record<string, number>;
  active_companies: number;
  module_adoption_rate: number;
}

export const useAdvancedModuleManagement = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // Verificar si el usuario puede gestionar módulos (solo superuser)
  const canManageModules = profile?.role === 'superuser';

  // Obtener configuraciones de módulos
  const { data: moduleConfigurations = [], isLoading: isLoadingConfigs } = useQuery({
    queryKey: ['module-configurations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('module_configurations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as ModuleConfiguration[];
    },
    enabled: canManageModules,
  });

  // Obtener estadísticas de uso
  const { data: usageStats = [], isLoading: isLoadingStats } = useQuery({
    queryKey: ['module-usage-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('module_usage_stats')
        .select('*')
        .gte('date_recorded', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date_recorded', { ascending: false });

      if (error) throw error;
      return data as ModuleUsageStats[];
    },
    enabled: canManageModules,
  });

  // Obtener logs de activación
  const { data: activationLogs = [], isLoading: isLoadingLogs } = useQuery({
    queryKey: ['module-activation-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('module_activation_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as ModuleActivationLog[];
    },
    enabled: canManageModules,
  });

  // Obtener estadísticas avanzadas
  const { data: advancedStats } = useQuery({
    queryKey: ['advanced-module-stats'],
    queryFn: async () => {
      // Calcular estadísticas agregadas
      const totalUsage = usageStats.reduce((acc, stat) => acc + stat.usage_count, 0);
      const avgDailyUsage = usageStats.length > 0 ? totalUsage / usageStats.length : 0;
      
      const usageByModule = usageStats.reduce((acc, stat) => {
        acc[stat.module_name] = (acc[stat.module_name] || 0) + stat.usage_count;
        return acc;
      }, {} as Record<string, number>);

      const activeCompanies = new Set(moduleConfigurations.filter(c => c.enabled).map(c => c.company_id)).size;
      const totalCompanies = new Set(moduleConfigurations.map(c => c.company_id)).size;
      const moduleAdoptionRate = totalCompanies > 0 ? (activeCompanies / totalCompanies) * 100 : 0;

      return {
        total_usage: totalUsage,
        avg_daily_usage: Math.round(avgDailyUsage),
        usage_by_module: usageByModule,
        active_companies: activeCompanies,
        module_adoption_rate: Math.round(moduleAdoptionRate),
      } as AdvancedModuleStats;
    },
    enabled: canManageModules && usageStats.length > 0 && moduleConfigurations.length > 0,
  });

  // Configurar módulo
  const configureModuleMutation = useMutation({
    mutationFn: async ({ 
      moduleName, 
      companyId, 
      companyType, 
      configData, 
      usageLimits 
    }: { 
      moduleName: string; 
      companyId: string; 
      companyType: 'salmonera' | 'contratista'; 
      configData: any; 
      usageLimits?: any; 
    }) => {
      const { data, error } = await supabase
        .from('module_configurations')
        .upsert({
          module_name: moduleName,
          company_id: companyId,
          company_type: companyType,
          config_data: configData,
          usage_limits: usageLimits || {},
          created_by: profile?.id,
        }, {
          onConflict: 'module_name,company_id,company_type'
        })
        .select()
        .single();

      if (error) throw error;

      // Registrar log de configuración
      await supabase
        .from('module_activation_logs')
        .insert({
          module_name: moduleName,
          company_id: companyId,
          company_type: companyType,
          action: 'configured',
          new_state: { config_data: configData, usage_limits: usageLimits },
          performed_by: profile?.id,
        });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-configurations'] });
      queryClient.invalidateQueries({ queryKey: ['module-activation-logs'] });
      toast({
        title: 'Módulo Configurado',
        description: 'La configuración del módulo se ha actualizado exitosamente.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error de Configuración',
        description: 'No se pudo configurar el módulo.',
        variant: 'destructive',
      });
    },
  });

  // Activar/Desactivar módulo
  const toggleModuleMutation = useMutation({
    mutationFn: async ({ 
      moduleName, 
      companyId, 
      companyType, 
      enabled, 
      reason 
    }: { 
      moduleName: string; 
      companyId: string; 
      companyType: 'salmonera' | 'contratista'; 
      enabled: boolean; 
      reason?: string; 
    }) => {
      // Obtener estado anterior
      const { data: currentConfig } = await supabase
        .from('module_configurations')
        .select('*')
        .eq('module_name', moduleName)
        .eq('company_id', companyId)
        .eq('company_type', companyType)
        .single();

      const { data, error } = await supabase
        .from('module_configurations')
        .upsert({
          module_name: moduleName,
          company_id: companyId,
          company_type: companyType,
          enabled,
          config_data: currentConfig?.config_data || {},
          created_by: profile?.id,
        }, {
          onConflict: 'module_name,company_id,company_type'
        })
        .select()
        .single();

      if (error) throw error;

      // Registrar log de activación/desactivación
      await supabase
        .from('module_activation_logs')
        .insert({
          module_name: moduleName,
          company_id: companyId,
          company_type: companyType,
          action: enabled ? 'activated' : 'deactivated',
          previous_state: currentConfig ? { enabled: currentConfig.enabled } : {},
          new_state: { enabled },
          reason,
          performed_by: profile?.id,
        });

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['module-configurations'] });
      queryClient.invalidateQueries({ queryKey: ['module-activation-logs'] });
      toast({
        title: variables.enabled ? 'Módulo Activado' : 'Módulo Desactivado',
        description: `El módulo ha sido ${variables.enabled ? 'activado' : 'desactivado'} exitosamente.`,
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'No se pudo cambiar el estado del módulo.',
        variant: 'destructive',
      });
    },
  });

  const isLoading = isLoadingConfigs || isLoadingStats || isLoadingLogs;

  return {
    // Data
    moduleConfigurations,
    usageStats,
    activationLogs,
    advancedStats,
    isLoading,
    
    // Permissions
    canManageModules,
    
    // Actions
    configureModule: configureModuleMutation.mutate,
    toggleModule: toggleModuleMutation.mutate,
    isConfiguring: configureModuleMutation.isPending,
    isToggling: toggleModuleMutation.isPending,
  };
};
