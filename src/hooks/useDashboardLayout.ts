import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Layout, Layouts } from 'react-grid-layout';
import { toast } from '@/hooks/use-toast';

const fetchDashboardLayout = async (userId: string) => {
  const { data, error } = await supabase
    .from('dashboard_layouts')
    .select('layout_config, widget_configs')
    .eq('user_id', userId)
    .single();
    
  if (error && error.code !== 'PGRST116') { // PGRST116: no rows returned
    throw new Error(error.message);
  }
  return data;
};

const saveDashboardLayout = async ({ userId, layout, widgets }: { userId: string, layout: Layout[] | Layouts, widgets: any }) => {
    const { data, error } = await supabase
        .from('dashboard_layouts')
        .upsert({
            user_id: userId,
            layout_config: layout as any,
            widget_configs: widgets,
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
        .select()
        .single();
    if (error) throw error;
    return data;
}

const deleteDashboardLayout = async ({ userId }: { userId: string }) => {
    const { error } = await supabase
        .from('dashboard_layouts')
        .delete()
        .eq('user_id', userId);
    
    if (error && error.code !== 'PGRST116') { // Don't throw if row doesn't exist
        throw error;
    }
    return true;
};

export const useDashboardLayout = (defaultLayout: Layout[], defaultWidgets: any) => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboardLayout', profile?.id],
    queryFn: () => fetchDashboardLayout(profile!.id),
    enabled: !!profile?.id,
  });

  const saveMutation = useMutation({
    mutationFn: (newConfig: { layout: Layout[] | Layouts, widgets: any }) => saveDashboardLayout({ userId: profile!.id, ...newConfig }),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['dashboardLayout', profile?.id] });
    },
    onError: (error: Error) => {
        toast({
            title: 'Error al guardar',
            description: `No se pudo guardar tu configuración. ${error.message}`,
            variant: 'destructive',
        });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteDashboardLayout({ userId: profile!.id }),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['dashboardLayout', profile?.id] });
    },
    onError: (error: Error) => {
        toast({
            title: 'Error al restablecer',
            description: `No se pudo restablecer la configuración. ${error.message}`,
            variant: 'destructive',
        });
    },
  });
  
  const layout = data?.layout_config as any;
  const widgets = data?.widget_configs;

  const hasLayout = layout && ( (Array.isArray(layout) && layout.length > 0) || (typeof layout === 'object' && !Array.isArray(layout) && Object.keys(layout).length > 0) );

  return {
    layout: hasLayout ? layout : defaultLayout,
    widgets: widgets || defaultWidgets,
    isLoading,
    isError,
    saveLayout: saveMutation.mutate,
    isSaving: saveMutation.isPending,
    resetLayout: deleteMutation.mutate,
    isResetting: deleteMutation.isPending,
  };
};
