
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { type Role } from '@/components/dashboard/widgetRegistry';
import { getLayoutsForRole } from '@/components/dashboard/layouts';
import { toast } from '@/hooks/use-toast';

export interface DashboardTemplate {
  id: string;
  name: string;
  description?: string;
  type: 'system' | 'user';
  role_target?: Role;
  layout_config: any;
  widget_configs: any;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// Templates del sistema por defecto
const systemTemplates: DashboardTemplate[] = [
  {
    id: 'superuser-default',
    name: 'Panel Administrativo Completo',
    description: 'Dashboard optimizado para superusuarios con control total del sistema',
    type: 'system',
    role_target: 'superuser',
    layout_config: getLayoutsForRole('superuser'),
    widget_configs: {
      'system-control-panel': { refreshInterval: 30000 },
      'module-status': { showInactiveModules: true },
      'global-security-alerts': { maxAlerts: 10, autoRefresh: true },
      'usage-stats': { period: '7days', showTrends: true },
      'invitation-management': { showExpired: false, maxInvitations: 10 }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'admin-salmonera-default',
    name: 'Panel de Administración Salmonera',
    description: 'Dashboard para administradores de salmoneras',
    type: 'system',
    role_target: 'admin_salmonera',
    layout_config: getLayoutsForRole('admin_salmonera'),
    widget_configs: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'admin-servicio-default',
    name: 'Panel de Administración de Servicios',
    description: 'Dashboard para administradores de servicios',
    type: 'system',
    role_target: 'admin_servicio',
    layout_config: getLayoutsForRole('admin_servicio'),
    widget_configs: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'supervisor-default',
    name: 'Panel de Supervisión',
    description: 'Dashboard para supervisores de operaciones',
    type: 'system',
    role_target: 'supervisor',
    layout_config: getLayoutsForRole('supervisor'),
    widget_configs: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'buzo-default',
    name: 'Panel del Buzo',
    description: 'Dashboard personalizado para buzos',
    type: 'system',
    role_target: 'buzo',
    layout_config: getLayoutsForRole('buzo'),
    widget_configs: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useDashboardTemplates = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: userTemplates = [], isLoading: isLoadingUserTemplates } = useQuery({
    queryKey: ['dashboard-templates', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data, error } = await supabase
        .from('dashboard_templates')
        .select('*')
        .eq('created_by', profile.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as DashboardTemplate[];
    },
    enabled: !!profile?.id,
  });

  const saveAsTemplateMutation = useMutation({
    mutationFn: async (template: Omit<DashboardTemplate, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
      if (!profile?.id) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('dashboard_templates')
        .insert({
          ...template,
          created_by: profile.id,
          type: 'user'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-templates', profile?.id] });
      toast({
        title: 'Plantilla guardada',
        description: 'Tu plantilla ha sido guardada exitosamente.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error al guardar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Combinar templates del sistema con templates de usuario
  const allTemplates = [
    ...systemTemplates,
    ...userTemplates
  ];

  return {
    templates: allTemplates,
    systemTemplates,
    userTemplates,
    isLoading: isLoadingUserTemplates,
    saveAsTemplate: saveAsTemplateMutation.mutate,
    isSavingTemplate: saveAsTemplateMutation.isPending,
  };
};
