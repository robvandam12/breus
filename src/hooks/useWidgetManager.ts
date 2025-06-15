
import { useState, useCallback } from 'react';
import { Layout, Layouts } from 'react-grid-layout';
import { widgetRegistry, WidgetType } from '@/components/dashboard/widgetRegistry';
import { cols } from '@/components/dashboard/layouts';
import { toast } from '@/hooks/use-toast';

interface DashboardState {
    layouts: Layouts;
    widgets: any;
}

interface UseWidgetManagerProps {
    dashboardState: DashboardState;
    setDashboardState: (newState: DashboardState) => void;
}

export const useWidgetManager = ({ dashboardState, setDashboardState }: UseWidgetManagerProps) => {
    // Safely access layouts and widgets with fallbacks
    const currentLayouts = dashboardState?.layouts || {};
    const currentWidgets = dashboardState?.widgets || {};

    const [configuringWidgetId, setConfiguringWidgetId] = useState<WidgetType | null>(null);
    const [widgetToRemove, setWidgetToRemove] = useState<string | null>(null);

    const handleAddWidget = useCallback((widgetType: WidgetType) => {
        const widgetConfig = widgetRegistry[widgetType];
        if (!widgetConfig) return;

        // Safely clone layouts
        let newLayouts: Layouts;
        try {
            newLayouts = currentLayouts && typeof currentLayouts === 'object' 
                ? JSON.parse(JSON.stringify(currentLayouts))
                : {};
        } catch (error) {
            console.error('Error cloning layouts:', error);
            newLayouts = {};
        }
        
        if (Object.keys(newLayouts).length === 0) {
            Object.keys(cols).forEach(bp => {
                newLayouts[bp] = [];
            });
        }
        
        Object.keys(newLayouts).forEach(bp => {
            const breakpointLayouts = newLayouts[bp as keyof typeof cols] || [];
            const newWidgetItem: Layout = {
                i: widgetType,
                x: (breakpointLayouts.length * widgetConfig.defaultLayout.w) % (cols[bp as keyof typeof cols] || 12),
                y: Infinity,
                w: widgetConfig.defaultLayout.w,
                h: widgetConfig.defaultLayout.h,
            };
            newLayouts[bp as keyof typeof cols] = [...breakpointLayouts, newWidgetItem];
        });

        setDashboardState({ 
            layouts: newLayouts, 
            widgets: currentWidgets 
        });
    }, [currentLayouts, currentWidgets, setDashboardState]);

    const handleRemoveWidget = useCallback((widgetId: string) => {
        setWidgetToRemove(widgetId);
    }, []);

    const confirmRemoveWidget = useCallback(() => {
        if (!widgetToRemove) return;
        
        // Safely clone layouts
        let newLayouts: Layouts;
        try {
            newLayouts = currentLayouts && typeof currentLayouts === 'object'
                ? JSON.parse(JSON.stringify(currentLayouts))
                : {};
        } catch (error) {
            console.error('Error cloning layouts for removal:', error);
            newLayouts = {};
        }

        Object.keys(newLayouts).forEach(bp => {
            if (Array.isArray(newLayouts[bp as keyof typeof newLayouts])) {
                newLayouts[bp as keyof typeof newLayouts] = newLayouts[bp as keyof typeof newLayouts].filter(item => item.i !== widgetToRemove);
            }
        });

        // Safely clone widgets
        let newWidgets: any;
        try {
            newWidgets = currentWidgets && typeof currentWidgets === 'object'
                ? JSON.parse(JSON.stringify(currentWidgets))
                : {};
            delete newWidgets[widgetToRemove];
        } catch (error) {
            console.error('Error cloning widgets for removal:', error);
            newWidgets = {};
        }
        
        setDashboardState({ layouts: newLayouts, widgets: newWidgets });
        setWidgetToRemove(null);
        toast({ title: "Widget eliminado", description: "El widget ha sido eliminado. Guarda el diseño para aplicar los cambios." });
    }, [widgetToRemove, currentLayouts, currentWidgets, setDashboardState]);

    const handleConfigureWidget = useCallback((widgetId: WidgetType) => {
        setConfiguringWidgetId(widgetId);
    }, []);

    const handleWidgetConfigSave = useCallback((widgetId: WidgetType, config: any) => {
        // Safely update widget config
        let newWidgets: any;
        try {
            newWidgets = currentWidgets && typeof currentWidgets === 'object'
                ? JSON.parse(JSON.stringify(currentWidgets))
                : {};
            newWidgets[widgetId] = config;
        } catch (error) {
            console.error('Error updating widget config:', error);
            newWidgets = { [widgetId]: config };
        }

        setDashboardState({ 
            layouts: currentLayouts, 
            widgets: newWidgets 
        });
        setConfiguringWidgetId(null);
        toast({ title: "Configuración actualizada", description: "Los cambios se aplicarán al guardar el diseño del dashboard." });
    }, [currentWidgets, currentLayouts, setDashboardState]);

    return {
        configuringWidgetId,
        setConfiguringWidgetId,
        widgetToRemove,
        setWidgetToRemove,
        handleAddWidget,
        handleRemoveWidget,
        confirmRemoveWidget,
        handleConfigureWidget,
        handleWidgetConfigSave,
    };
};
