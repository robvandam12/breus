
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Layout, Layouts } from 'react-grid-layout';
import { toast } from '@/hooks/use-toast';
import { sanitizeLayouts, isValidLayouts } from '@/utils/dashboardUtils';

const fetchDashboardLayout = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('dashboard_layouts')
            .select('layout_config, widget_configs')
            .eq('user_id', userId)
            .single();
            
        if (error && error.code !== 'PGRST116') { // PGRST116: no rows returned
            throw new Error(error.message);
        }
        
        // Validar datos recibidos
        if (data && data.layout_config) {
            // Verificar que el layout sea válido antes de devolverlo
            if (typeof data.layout_config === 'object') {
                return data;
            } else {
                console.warn('Layout_config inválido en base de datos, se ignorará');
                return null;
            }
        }
        
        return data;
    } catch (error) {
        console.error('Error al obtener layout del dashboard:', error);
        throw error;
    }
};

const saveDashboardLayout = async ({ userId, layout, widgets }: { userId: string, layout: Layout[] | Layouts, widgets: any }) => {
    try {
        // Validar layout antes de guardar
        const layoutsToSave = Array.isArray(layout) ? { lg: layout } : layout;
        
        if (!isValidLayouts(layoutsToSave)) {
            throw new Error('Layout inválido: no se puede guardar');
        }
        
        const { data, error } = await supabase
            .from('dashboard_layouts')
            .upsert({
                user_id: userId,
                layout_config: layoutsToSave as any,
                widget_configs: widgets || {},
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' })
            .select()
            .single();
            
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error al guardar layout del dashboard:', error);
        throw error;
    }
};

const deleteDashboardLayout = async ({ userId }: { userId: string }) => {
    try {
        const { error } = await supabase
            .from('dashboard_layouts')
            .delete()
            .eq('user_id', userId);
        
        if (error && error.code !== 'PGRST116') { // Don't throw if row doesn't exist
            throw error;
        }
        return true;
    } catch (error) {
        console.error('Error al eliminar layout del dashboard:', error);
        throw error;
    }
};

export const useDashboardLayout = (defaultLayouts: Layouts, defaultWidgets: any) => {
    const { profile } = useAuth();
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['dashboardLayout', profile?.id],
        queryFn: () => fetchDashboardLayout(profile!.id),
        enabled: !!profile?.id,
        retry: (failureCount, error) => {
            // Solo reintentar 2 veces para errores de red
            if (failureCount < 2 && error.message.includes('fetch')) {
                return true;
            }
            return false;
        },
        staleTime: 5 * 60 * 1000, // 5 minutos
    });

    const saveMutation = useMutation({
        mutationFn: (newConfig: { layout: Layout[] | Layouts, widgets: any }) => 
            saveDashboardLayout({ userId: profile!.id, ...newConfig }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dashboardLayout', profile?.id] });
        },
        onError: (error: Error) => {
            console.error('Error en mutación de guardado:', error);
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
            console.error('Error en mutación de eliminación:', error);
            toast({
                title: 'Error al restablecer',
                description: `No se pudo restablecer la configuración. ${error.message}`,
                variant: 'destructive',
            });
        },
    });
    
    // Procesar y validar datos recibidos
    const processedData = useMemo(() => {
        if (!data) return { layout: null, widgets: null };
        
        try {
            let layout = data.layout_config;
            let widgets = data.widget_configs;
            
            // Sanitizar layout si existe
            if (layout) {
                layout = sanitizeLayouts(layout, defaultLayouts);
            }
            
            // Validar widgets
            if (widgets && typeof widgets !== 'object') {
                widgets = null;
            }
            
            return { layout, widgets };
        } catch (error) {
            console.error('Error al procesar datos del layout:', error);
            return { layout: null, widgets: null };
        }
    }, [data, defaultLayouts]);

    const hasLayout = processedData.layout && isValidLayouts(processedData.layout);

    return {
        layout: hasLayout ? processedData.layout : defaultLayouts,
        widgets: processedData.widgets || defaultWidgets,
        isLoading,
        isError,
        saveLayout: saveMutation.mutate,
        isSaving: saveMutation.isPending,
        resetLayout: deleteMutation.mutate,
        isResetting: deleteMutation.isPending,
    };
};
