
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useAuthRoles } from './useAuthRoles';
import { Layouts } from 'react-grid-layout';
import { toast } from '@/hooks/use-toast';

export interface DashboardTemplate {
  id: string;
  name: string;
  description?: string;
  layout_config: Layouts;
  widget_configs: any;
  type: 'system' | 'user';
  role_target?: string;
  created_by?: string;
  created_at: string;
}

const fetchDashboardTemplates = async (userId: string, role: string) => {
  const { data, error } = await supabase
    .from('dashboard_templates')
    .select('*')
    .or(`and(type.eq.system,role_target.eq.${role}),and(type.eq.user,created_by.eq.${userId})`);

  if (error) {
    console.error('Error fetching dashboard templates:', error);
    throw new Error(error.message);
  }
  return data as DashboardTemplate[];
};

const createDashboardTemplate = async (templateData: Omit<DashboardTemplate, 'id' | 'created_at'>) => {
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
    queryFn: () => fetchDashboardTemplates(profile!.id, currentRole),
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
