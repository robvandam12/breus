
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useAuthRoles } from './useAuthRoles';
import { Layouts } from 'react-grid-layout';
import { toast } from '@/hooks/use-toast';
import { systemTemplates as hardcodedSystemTemplates } from '@/components/dashboard/system-templates';
import { Role } from '@/components/dashboard/widgetRegistry';
import { Tables } from '@/integrations/supabase/types';

export interface DashboardTemplate {
  id: string;
  name: string;
  description?: string;
  layout_config: Layouts;
  widget_configs: any;
  type: 'system' | 'user';
  role_target?: Role;
  created_by?: string;
  created_at: string;
  updated_at?: string;
}

const fetchDashboardTemplates = async (userId: string, role: Role) => {
  const { data: userTemplatesData, error } = await supabase
    .from('dashboard_templates')
    .select('*')
    .eq('type', 'user')
    .eq('created_by', userId);

  if (error) {
    console.error('Error fetching user dashboard templates:', error);
    throw new Error(error.message);
  }

  const userTemplates: DashboardTemplate[] = (userTemplatesData || []).map(t => ({
      ...t,
      layout_config: t.layout_config as Layouts,
      widget_configs: t.widget_configs,
      type: 'user',
  }));

  const relevantSystemTemplates: DashboardTemplate[] = hardcodedSystemTemplates
    .filter(t => t.role_target === role)
    .map((t, index) => ({
      ...t,
      id: `system-${t.name.replace(/\s+/g, '-').toLowerCase()}-${index}`,
      created_by: 'system',
      created_at: new Date().toISOString(),
    }));

  return [...userTemplates, ...relevantSystemTemplates];
};

const createDashboardTemplate = async (templateData: Tables<'dashboard_templates'>['Insert']) => {
    const { data, error } = await supabase
        .from('dashboard_templates')
        .insert([templateData])
        .select()
        .single();
    if (error) throw error;
    return data;
}

export const useDashboardTemplates = () => {
  const { profile } = useAuth();
  const { currentRole } = useAuthRoles();
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading, isError } = useQuery({
    queryKey: ['dashboardTemplates', profile?.id, currentRole],
    queryFn: () => fetchDashboardTemplates(profile!.id, currentRole as Role),
    enabled: !!profile?.id && !!currentRole,
  });

  const createTemplateMutation = useMutation({
    mutationFn: (newTemplate: {name: string, description?: string, layout_config: Layouts, widget_configs: any}) => 
        createDashboardTemplate({ ...newTemplate, created_by: profile!.id, type: 'user' }),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['dashboardTemplates', profile?.id, currentRole] });
        toast({
            title: 'Plantilla guardada',
            description: 'Tu diseño se ha guardado como una nueva plantilla.',
        });
    },
    onError: (error: Error) => {
        toast({
            title: 'Error al guardar plantilla',
            description: `No se pudo guardar la plantilla. ${error.message}`,
            variant: 'destructive',
        });
    },
  });

  return {
    templates,
    isLoading,
    isError,
    saveAsTemplate: createTemplateMutation.mutateAsync,
    isSavingTemplate: createTemplateMutation.isPending,
  };
};
