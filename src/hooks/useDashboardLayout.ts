
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Layout } from 'react-grid-layout';

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

const saveDashboardLayout = async ({ userId, layout, widgets }: { userId: string, layout: Layout[], widgets: any }) => {
    const { data, error } = await supabase
        .from('dashboard_layouts')
        .upsert({
            user_id: userId,
            layout_config: layout as any, // FIX: Cast layout to 'any' to satisfy Supabase's Json type
            widget_configs: widgets,
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
        .select()
        .single();
    if (error) throw error;
    return data;
}

export const useDashboardLayout = (defaultLayout: Layout[], defaultWidgets: any) => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboardLayout', profile?.id], // FIX: Use profile.id instead of profile.usuario_id
    queryFn: () => fetchDashboardLayout(profile!.id), // FIX: Use profile.id
    enabled: !!profile?.id, // FIX: Use profile.id
  });

  const mutation = useMutation({
    mutationFn: (newLayout: { layout: Layout[], widgets: any }) => saveDashboardLayout({ userId: profile!.id, ...newLayout }), // FIX: Use profile.id
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['dashboardLayout', profile?.id] }); // FIX: Use profile.id
    },
  });
  
  const layout = data?.layout_config as unknown as Layout[] | undefined; // FIX: Cast through unknown to avoid type error
  const widgets = data?.widget_configs;

  return {
    layout: layout && layout.length > 0 ? layout : defaultLayout,
    widgets: widgets || defaultWidgets,
    isLoading,
    isError,
    saveLayout: mutation.mutate,
    isSaving: mutation.isPending
  };
};
