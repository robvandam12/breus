import { useState, useCallback } from 'react';
import { Layout, Layouts } from 'react-grid-layout';
import { DashboardTemplate } from './useDashboardTemplates';
import { widgetRegistry, WidgetType, Role } from '@/components/dashboard/widgetRegistry';
import { toast } from '@/hooks/use-toast';
import { filterLayoutsByRole } from '@/utils/dashboardUtils';

interface DashboardState {
    layouts: Layouts;
    widgets: any;
}

interface UseTemplateManagerProps {
    setDashboardState: (state: DashboardState) => void;
    currentRole: Role;
    defaultWidgets: any;
}

export const useTemplateManager = ({ setDashboardState, currentRole, defaultWidgets }: UseTemplateManagerProps) => {
    const [isTemplateSheetOpen, setIsTemplateSheetOpen] = useState(false);
    const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);

    const handleApplyTemplate = useCallback((template: DashboardTemplate) => {
        setIsApplyingTemplate(true);
        // Usar un timeout para asegurar que la UI se actualice y muestre el estado de carga
        setTimeout(() => {
            try {
                const { layout_config, widget_configs, name: templateName } = template;

                const allLayoutItems = Object.values(layout_config).flat();
                const invalidWidgetIds = allLayoutItems
                    .map(item => item.i as WidgetType)
                    .filter(widgetId => !widgetRegistry[widgetId]);

                if (invalidWidgetIds.length > 0) {
                    throw new Error(`La plantilla contiene widgets que ya no existen: ${invalidWidgetIds.join(', ')}.`);
                }

                const filteredLayouts = filterLayoutsByRole(layout_config, currentRole);
                const filteredItems = Object.values(filteredLayouts).flat();

                if (allLayoutItems.length > 0 && filteredItems.length === 0) {
                    throw new Error(`Ningún widget en esta plantilla está disponible para tu rol actual.`);
                }

                setDashboardState({ layouts: filteredLayouts, widgets: widget_configs || defaultWidgets });
                toast({
                    title: "Plantilla Aplicada",
                    description: `Se aplicó '${templateName}'. Guarda el diseño para confirmar los cambios.`
                });
            } catch (error) {
                const message = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
                toast({
                    title: "No se pudo aplicar la plantilla",
                    description: message,
                    variant: "destructive"
                });
            } finally {
                setIsApplyingTemplate(false);
                setIsTemplateSheetOpen(false);
            }
        }, 100);
    }, [setDashboardState, currentRole, defaultWidgets]);

    return {
        isTemplateSheetOpen,
        setIsTemplateSheetOpen,
        isApplyingTemplate,
        handleApplyTemplate,
    };
};
