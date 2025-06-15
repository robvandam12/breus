
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Layouts } from 'react-grid-layout';
import { useDashboardTemplates } from './useDashboardTemplates';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { Role } from '@/components/dashboard/widgetRegistry';
import { getLayoutsForRole } from '@/components/dashboard/layouts';
import { filterLayoutsByRole, sanitizeLayouts, isValidLayouts, cleanupInvalidWidgets } from '@/utils/dashboardUtils';
import { toast } from '@/hooks/use-toast';

interface DashboardState {
    layouts: Layouts;
    widgets: any;
}

const defaultWidgets = {};

export const useDashboardInitialization = (currentRole: Role, resetDashboardState: (state: DashboardState) => void) => {
    const { templates, isLoading: isLoadingTemplates } = useDashboardTemplates();
    const [initializationError, setInitializationError] = useState<string | null>(null);

    const defaultLayoutsAndWidgets = useMemo(() => {
        try {
            const template = templates.find(t => t.type === 'system' && t.role_target === currentRole);
            if (template && template.layout_config) {
                // Validar y sanitizar el layout del template
                const sanitizedLayouts = sanitizeLayouts(template.layout_config, getLayoutsForRole(currentRole));
                const cleanedLayouts = cleanupInvalidWidgets(sanitizedLayouts);
                
                if (isValidLayouts(cleanedLayouts)) {
                    return {
                        layouts: cleanedLayouts,
                        widgets: template.widget_configs || defaultWidgets
                    };
                }
            }
            
            const roleLayouts = getLayoutsForRole(currentRole);
            return {
                layouts: roleLayouts,
                widgets: defaultWidgets
            };
        } catch (error) {
            setInitializationError('Error al cargar configuración por defecto');
            return {
                layouts: { lg: [] },
                widgets: defaultWidgets
            };
        }
    }, [templates, currentRole]);

    const { 
        layout: savedLayout, 
        widgets: savedWidgets, 
        isLoading: isLoadingLayout, 
        isError: hasLayoutError,
        saveLayout, 
        isSaving, 
        resetLayout, 
        isResetting 
    } = useDashboardLayout(defaultLayoutsAndWidgets.layouts, defaultLayoutsAndWidgets.widgets);

    const [isInitialized, setIsInitialized] = useState(false);

    const filteredLayout = useMemo(() => {
        try {
            const filtered = filterLayoutsByRole(savedLayout, currentRole);
            
            // Validación adicional del resultado
            if (!isValidLayouts(filtered)) {
                return getLayoutsForRole(currentRole);
            }
            
            return filtered;
        } catch (error) {
            setInitializationError('Error al procesar configuración del dashboard');
            return getLayoutsForRole(currentRole);
        }
    }, [savedLayout, currentRole]);

    const getInitialDashboardState = useCallback((): DashboardState => {
        try {
            return {
                layouts: filteredLayout,
                widgets: savedWidgets || defaultWidgets,
            };
        } catch (error) {
            return {
                layouts: getLayoutsForRole(currentRole),
                widgets: defaultWidgets,
            };
        }
    }, [filteredLayout, savedWidgets, currentRole]);

    useEffect(() => {
        const initialDataLoading = isLoadingLayout || isLoadingTemplates;
        
        if (!initialDataLoading && !isInitialized) {
            try {
                const initialState = getInitialDashboardState();
                
                // Verificar si hay errores en la carga de datos
                if (hasLayoutError) {
                    toast({
                        title: 'Advertencia',
                        description: 'Se restauró la configuración por defecto del dashboard debido a un error.',
                        variant: 'default',
                    });
                }
                
                if (initializationError) {
                    toast({
                        title: 'Error de Inicialización',
                        description: initializationError,
                        variant: 'destructive',
                    });
                }
                
                resetDashboardState(initialState);
                setIsInitialized(true);
            } catch (error) {
                toast({
                    title: 'Error Crítico',
                    description: 'Error al inicializar el dashboard. Se usará configuración mínima.',
                    variant: 'destructive',
                });
                
                // Estado de emergencia
                resetDashboardState({
                    layouts: { lg: [] },
                    widgets: defaultWidgets
                });
                setIsInitialized(true);
            }
        }
    }, [
        isLoadingLayout, 
        isLoadingTemplates, 
        isInitialized, 
        getInitialDashboardState, 
        resetDashboardState, 
        hasLayoutError,
        initializationError
    ]);

    return {
        isLoading: !isInitialized,
        getInitialDashboardState,
        defaultLayoutForRole: defaultLayoutsAndWidgets.layouts.lg || [],
        saveLayout,
        isSaving,
        resetLayout,
        isResetting,
        hasError: !!initializationError || hasLayoutError,
    };
};
