
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
    const { layouts: currentLayouts, widgets: currentWidgets } = dashboardState;

    const [configuringWidgetId, setConfiguringWidgetId] = useState<WidgetType | null>(null);
    const [widgetToRemove, setWidgetToRemove] = useState<string | null>(null);

    const handleAddWidget = useCallback((widgetType: WidgetType) => {
        const widgetConfig = widgetRegistry[widgetType];
        if (!widgetConfig) return;

        const newLayouts = JSON.parse(JSON.stringify(currentLayouts));
        
        if (Object.keys(newLayouts).length === 0) {
            Object.keys(cols).forEach(bp => {
                newLayouts[bp] = [];
            });
        }
        
        Object.keys(newLayouts).forEach(bp => {
            const newWidgetItem: Layout = {
                i: widgetType,
                x: (newLayouts[bp as keyof typeof cols].length * widgetConfig.defaultLayout.w) % (cols[bp as keyof typeof cols] || 12),
                y: Infinity,
                w: widgetConfig.defaultLayout.w,
                h: widgetConfig.defaultLayout.h,
            };
            newLayouts[bp as keyof typeof cols] = [...(newLayouts[bp as keyof typeof cols] || []), newWidgetItem];
        });

        setDashboardState({ ...dashboardState, layouts: newLayouts });
    }, [currentLayouts, dashboardState, setDashboardState]);

    const handleRemoveWidget = useCallback((widgetId: string) => {
        setWidgetToRemove(widgetId);
    }, []);

    const confirmRemoveWidget = useCallback(() => {
        if (!widgetToRemove) return;
        const newLayouts = { ...currentLayouts };
        Object.keys(newLayouts).forEach(bp => {
            newLayouts[bp as keyof typeof newLayouts] = newLayouts[bp as keyof typeof newLayouts].filter(item => item.i !== widgetToRemove);
        });
        const newWidgets = { ...currentWidgets };
        delete newWidgets[widgetToRemove];
        
        setDashboardState({ layouts: newLayouts, widgets: newWidgets });
        setWidgetToRemove(null);
        toast({ title: "Widget eliminado", description: "El widget ha sido eliminado. Guarda el diseño para aplicar los cambios." });
    }, [widgetToRemove, currentLayouts, currentWidgets, setDashboardState]);

    const handleConfigureWidget = useCallback((widgetId: WidgetType) => {
        setConfiguringWidgetId(widgetId);
    }, []);

    const handleWidgetConfigSave = useCallback((widgetId: WidgetType, config: any) => {
        const newWidgets = {
            ...currentWidgets,
            [widgetId]: config,
        };
        setDashboardState({ ...dashboardState, widgets: newWidgets });
        setConfiguringWidgetId(null);
        toast({ title: "Configuración actualizada", description: "Los cambios se aplicarán al guardar el diseño del dashboard." });
    }, [currentWidgets, dashboardState, setDashboardState]);

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
