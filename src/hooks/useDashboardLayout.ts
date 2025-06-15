
import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Layout, Layouts } from 'react-grid-layout';
import { toast } from '@/hooks/use-toast';
import { sanitizeLayouts, isValidLayouts } from '@/utils/dashboardUtils';

const validateLayoutStructure = (layout: unknown): layout is Layouts => {
    if (!layout || typeof layout !== 'object') return false;
    
    // Verificar que sea un objeto con propiedades de breakpoint válidas
    const validBreakpoints = ['lg', 'md', 'sm', 'xs', 'xxs'];
    const keys = Object.keys(layout);
    
    return keys.length > 0 && keys.every(key => 
        validBreakpoints.includes(key) && 
        Array.isArray((layout as any)[key])
    );
};

const validateWidgetConfigs = (widgets: unknown): widgets is Record<string, any> => {
    return typeof widgets === 'object' && widgets !== null;
};

const fetchDashboardLayout = async (userId: string) => {
    if (!userId) {
        throw new Error('ID de usuario requerido');
    }

    try {
        const { data, error } = await supabase
            .from('dashboard_layouts')
            .select('layout_config, widget_configs')
            .eq('user_id', userId)
            .single();
            
        if (error && error.code !== 'PGRST116') {
            throw new Error(`Error de base de datos: ${error.message}`);
        }
        
        if (data) {
            // Validación estricta de datos recibidos
            if (data.layout_config && !validateLayoutStructure(data.layout_config)) {
                throw new Error('Configuración de layout inválida');
            }
            
            if (data.widget_configs && !validateWidgetConfigs(data.widget_configs)) {
                throw new Error('Configuración de widgets inválida');
            }
        }
        
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Error inesperado al cargar configuración');
    }
};

const saveDashboardLayout = async ({ userId, layout, widgets }: { userId: string, layout: Layout[] | Layouts, widgets: any }) => {
    if (!userId) {
        throw new Error('ID de usuario requerido');
    }

    try {
        const layoutsToSave = Array.isArray(layout) ? { lg: layout } : layout;
        
        if (!isValidLayouts(layoutsToSave)) {
            throw new Error('Layout inválido: estructura no válida');
        }

        if (!validateWidgetConfigs(widgets)) {
            throw new Error('Configuración de widgets inválida');
        }
        
        const { data, error } = await supabase
            .from('dashboard_layouts')
            .upsert({
                user_id: userId,
                layout_config: layoutsToSave as unknown as any,
                widget_configs: widgets || {},
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' })
            .select()
            .single();
            
        if (error) {
            throw new Error(`Error al guardar: ${error.message}`);
        }
        
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Error inesperado al guardar configuración');
    }
};

const deleteDashboardLayout = async ({ userId }: { userId: string }) => {
    if (!userId) {
        throw new Error('ID de usuario requerido');
    }

    try {
        const { error } = await supabase
            .from('dashboard_layouts')
            .delete()
            .eq('user_id', userId);
        
        if (error && error.code !== 'PGRST116') {
            throw new Error(`Error al eliminar: ${error.message}`);
        }
        
        return true;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Error inesperado al eliminar configuración');
    }
};

export const useDashboardLayout = (defaultLayouts: Layouts, defaultWidgets: any) => {
    const { profile } = useAuth();
    const queryClient = useQueryClient();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['dashboardLayout', profile?.id],
        queryFn: () => fetchDashboardLayout(profile!.id),
        enabled: !!profile?.id,
        retry: (failureCount, error) => {
            // Estrategia de reintentos más inteligente
            if (failureCount < 2) {
                const err = error as Error;
                // Solo reintentar para errores de red, no para errores de validación
                return err.message.includes('fetch') || err.message.includes('network');
            }
            return false;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const saveMutation = useMutation({
        mutationFn: (newConfig: { layout: Layout[] | Layouts, widgets: any }) => 
            saveDashboardLayout({ userId: profile!.id, ...newConfig }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dashboardLayout', profile?.id] });
            toast({
                title: 'Guardado exitoso',
                description: 'Tu configuración del dashboard se ha guardado correctamente.',
                variant: 'default',
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

    const deleteMutation = useMutation({
        mutationFn: () => deleteDashboardLayout({ userId: profile!.id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dashboardLayout', profile?.id] });
            toast({
                title: 'Configuración restablecida',
                description: 'Se ha restablecido la configuración por defecto del dashboard.',
                variant: 'default',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error al restablecer',
                description: error.message,
                variant: 'destructive',
            });
        },
    });
    
    const processedData = useMemo(() => {
        if (!data) return { layout: null, widgets: null };
        
        try {
            let layout = data.layout_config as unknown as Layouts;
            let widgets = data.widget_configs;
            
            if (layout && validateLayoutStructure(layout)) {
                layout = sanitizeLayouts(layout, defaultLayouts);
            } else {
                layout = null;
            }
            
            if (!validateWidgetConfigs(widgets)) {
                widgets = null;
            }
            
            return { layout, widgets };
        } catch (error) {
            return { layout: null, widgets: null };
        }
    }, [data, defaultLayouts]);

    const hasLayout = processedData.layout && isValidLayouts(processedData.layout);

    return {
        layout: hasLayout ? processedData.layout : defaultLayouts,
        widgets: processedData.widgets || defaultWidgets,
        isLoading,
        isError,
        error: error as Error | null,
        saveLayout: saveMutation.mutate,
        isSaving: saveMutation.isPending,
        resetLayout: deleteMutation.mutate,
        isResetting: deleteMutation.isPending,
        hasError: isError,
    };
};
