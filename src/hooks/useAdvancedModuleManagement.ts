
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface ModuleConfiguration {
  id: string;
  module_name: string;
  company_id: string;
  company_type: 'salmonera' | 'contratista';
  config_data: Record<string, any>;
  usage_limits: Record<string, any>;
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
  performance_metrics: Record<string, any>;
}

interface ModuleActivationLog {
  id: string;
  module_name: string;
  company_id: string;
  company_type: 'salmonera' | 'contratista';
  action: 'activated' | 'deactivated' | 'configured';
  previous_state: Record<string, any>;
  new_state: Record<string, any>;
  reason?: string;
  performed_by?: string;
  created_at: string;
}

export const useAdvancedModuleManagement = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // Verificar si el usuario puede gestionar módulos
  const canManageModules = profile?.role === 'superuser' || 
                          profile?.role === 'admin_salmonera' || 
                          profile?.role === 'admin_servicio';

  // Obtener configuraciones de módulos
  const { data: moduleConfigurations = [], isLoading: isLoadingConfigs } = useQuery({
    queryKey: ['module-configurations', profile?.salmonera_id || profile?.servicio_id],
    queryFn: async () => {
      if (!canManageModules) return [];
      
      const { data, error } = await supabase
        .from('module_configurations')
        .select('*')
        .order('module_name');

      if (error) throw error;
      return data as ModuleConfiguration[];
    },
    enabled: canManageModules,
  });

  // Obtener estadísticas de uso
  const { data: usageStats = [], isLoading: isLoadingStats } = useQuery({
    queryKey: ['module-usage-stats', profile?.salmonera_id || profile?.servicio_id],
    queryFn: async () => {
      if (!canManageModules) return [];
      
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
    queryKey: ['module-activation-logs', profile?.salmonera_id || profile?.servicio_id],
    queryFn: async () => {
      if (!canManageModules) return [];
      
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

  // Configurar módulo
  const configureModule = useMutation({
    mutationFn: async ({
      moduleName,
      companyId,
      companyType,
      configData,
      usageLimits,
      enabled
    }: {
      moduleName: string;
      companyId: string;
      companyType: 'salmonera' | 'contratista';
      configData: Record<string, any>;
      usageLimits?: Record<string, any>;
      enabled: boolean;
    }) => {
      const { data, error } = await supabase
        .from('module_configurations')
        .upsert({
          module_name: moduleName,
          company_id: companyId,
          company_type: companyType,
          config_data: configData,
          usage_limits: usageLimits || {},
          enabled,
          updated_at: new Date().toISOString(),
          created_by: profile?.id
        }, {
          onConflict: 'module_name,company_id,company_type'
        })
        .select()
        .single();

      if (error) throw error;

      // Registrar en logs
      await supabase
        .from('module_activation_logs')
        .insert({
          module_name: moduleName,
          company_id: companyId,
          company_type: companyType,
          action: 'configured',
          new_state: { enabled, config_data: configData },
          performed_by: profile?.id
        });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-configurations'] });
      queryClient.invalidateQueries({ queryKey: ['module-activation-logs'] });
      queryClient.invalidateQueries({ queryKey: ['module-access'] });
      toast({
        title: "Configuración actualizada",
        description: "La configuración del módulo se ha actualizado correctamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la configuración del módulo",
        variant: "destructive",
      });
    },
  });

  // Activar/desactivar módulo
  const toggleModule = useMutation({
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
      // Primero actualizar module_access (tabla existente)
      const { error: accessError } = await supabase
        .from('module_access')
        .upsert({
          empresa_id: companyId,
          modulo_nombre: moduleName,
          activo: enabled,
          configuracion: {}
        }, {
          onConflict: 'empresa_id,modulo_nombre'
        });

      if (accessError) throw accessError;

      // Luego actualizar configuración avanzada
      const { data, error } = await supabase
        .from('module_configurations')
        .upsert({
          module_name: moduleName,
          company_id: companyId,
          company_type: companyType,
          config_data: {},
          enabled,
          updated_at: new Date().toISOString(),
          created_by: profile?.id
        }, {
          onConflict: 'module_name,company_id,company_type'
        })
        .select()
        .single();

      if (error) throw error;

      // Registrar en logs
      await supabase
        .from('module_activation_logs')
        .insert({
          module_name: moduleName,
          company_id: companyId,
          company_type: companyType,
          action: enabled ? 'activated' : 'deactivated',
          new_state: { enabled },
          reason,
          performed_by: profile?.id
        });

      return data;
    },
    onSuccess: (_, { enabled }) => {
      queryClient.invalidateQueries({ queryKey: ['module-configurations'] });
      queryClient.invalidateQueries({ queryKey: ['module-activation-logs'] });
      queryClient.invalidateQueries({ queryKey: ['module-access'] });
      toast({
        title: enabled ? "Módulo activado" : "Módulo desactivado",
        description: `El módulo se ha ${enabled ? 'activado' : 'desactivado'} correctamente`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado del módulo",
        variant: "destructive",
      });
    },
  });

  // Obtener estadísticas avanzadas
  const { data: advancedStats } = useQuery({
    queryKey: ['advanced-module-stats', profile?.salmonera_id || profile?.servicio_id],
    queryFn: async () => {
      if (!canManageModules) return null;
      
      const empresaId = profile?.salmonera_id || profile?.servicio_id;
      const companyType = profile?.salmonera_id ? 'salmonera' : 'contratista';
      
      if (!empresaId) return null;

      const { data, error } = await supabase.rpc('get_module_stats', {
        p_company_id: empresaId,
        p_company_type: companyType
      });

      if (error) throw error;
      return data;
    },
    enabled: canManageModules,
  });

  return {
    moduleConfigurations,
    usageStats,
    activationLogs,
    advancedStats,
    isLoading: isLoadingConfigs || isLoadingStats || isLoadingLogs,
    canManageModules,
    configureModule: configureModule.mutateAsync,
    toggleModule: toggleModule.mutateAsync,
    isConfiguring: configureModule.isPending,
    isToggling: toggleModule.isPending,
  };
};
