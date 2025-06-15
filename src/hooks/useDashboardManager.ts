import { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout, Layouts } from 'react-grid-layout';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { widgetRegistry, WidgetType, Role } from '@/components/dashboard/widgetRegistry';
import { toast } from '@/hooks/use-toast';
import { getLayoutForRole } from '@/components/dashboard/layouts';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { useDashboardTemplates, DashboardTemplate } from './useDashboardTemplates';
import { useWidgetManager } from './useWidgetManager';
import { useDashboardModes } from './useDashboardModes';

interface DashboardState {
    layouts: Layouts;
    widgets: any;
}

const defaultWidgets = {};

const filterLayoutsByRole = (layouts: Layouts | Layout[] | null | undefined, role: Role): Layouts => {
    const roleFilter = (item: Layout) => {
        const widgetConfig = widgetRegistry[item.i as WidgetType];
        if (!widgetConfig) return false;
        // If roles are defined, the current role must be included. If not defined, widget is available for all roles.
        return !widgetConfig.roles || widgetConfig.roles.includes(role);
    };

    if (!layouts) return { lg: [] };

    const layoutsObj: Layouts = Array.isArray(layouts) ? { lg: layouts } : layouts;
    const filteredLayouts: Layouts = {};

    Object.keys(layoutsObj).forEach(breakpoint => {
        const key = breakpoint as keyof Layouts;
        const layoutForBreakpoint = layoutsObj[key];
        if (Array.isArray(layoutForBreakpoint)) {
            filteredLayouts[key] = layoutForBreakpoint.filter(roleFilter);
        }
    });

    if (!filteredLayouts.lg) {
        filteredLayouts.lg = [];
    }
    
    return filteredLayouts;
};

export const useDashboardManager = (currentRole: string) => {
    const { templates, isLoading: isLoadingTemplates } = useDashboardTemplates();

    const defaultLayoutAndWidgets = useMemo(() => {
        const template = templates.find(t => t.type === 'system' && t.role_target === currentRole as Role);
        if (template && template.layout_config) {
            return {
                layout: template.layout_config.lg || [],
                widgets: template.widget_configs || defaultWidgets
            };
        }
        return {
            layout: getLayoutForRole(currentRole),
            widgets: defaultWidgets
        };
    }, [templates, currentRole]);

    const { layout: savedLayout, widgets: savedWidgets, isLoading: isLoadingLayout, saveLayout, isSaving, resetLayout, isResetting } = useDashboardLayout(defaultLayoutAndWidgets.layout, defaultLayoutAndWidgets.widgets);
    
    const [isInitialized, setIsInitialized] = useState(false);
    
    const { 
        state: dashboardState, 
        set: setDashboardState, 
        undo: undoAction, 
        redo: redoAction,
        reset: resetDashboardState, 
        canUndo, 
        canRedo 
    } = useUndoRedo<DashboardState>({ layouts: {}, widgets: defaultWidgets });

    const { layouts: currentLayouts, widgets: currentWidgets } = dashboardState;
    
    const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
    const [isTemplateSheetOpen, setIsTemplateSheetOpen] = useState(false);
    const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);

    const filteredLayout = useMemo(() => filterLayoutsByRole(savedLayout, currentRole as Role), [savedLayout, currentRole]);

    const getInitialDashboardState = useCallback(() => {
        return {
            layouts: filteredLayout,
            widgets: savedWidgets,
        };
    }, [filteredLayout, savedWidgets]);

    useEffect(() => {
        const initialDataLoading = isLoadingLayout || isLoadingTemplates;
        if (!initialDataLoading && !isInitialized) {
             resetDashboardState(getInitialDashboardState());
             setIsInitialized(true);
        }
    }, [isLoadingLayout, isLoadingTemplates, isInitialized, getInitialDashboardState, resetDashboardState]);

    const handleSaveLayout = () => {
        saveLayout({ layout: currentLayouts, widgets: currentWidgets }, {
            onSuccess: () => {
                toast({ title: "Diseño guardado", description: "Tu dashboard ha sido actualizado." });
                modes.setIsEditMode(false);
                modes.setIsPreviewMode(false);
                modes.setPreviewSnapshot(null);
            },
            // onError is handled by useDashboardLayout
        });
    }

    const handleResetLayout = () => {
        setIsResetConfirmOpen(false);
        resetLayout(undefined, {
            onSuccess: () => {
                toast({ title: "Diseño restaurado", description: "El dashboard ha vuelto a su estado por defecto." });
                modes.setIsEditMode(false);
                modes.setIsPreviewMode(false);
                modes.setPreviewSnapshot(null);
            },
             // onError is handled by useDashboardLayout
        });
    };

    const modes = useDashboardModes({
        dashboardState,
        setDashboardState,
        resetDashboardState,
        getInitialDashboardState,
        handleSaveLayout,
    });
    
    const widgetManager = useWidgetManager({ dashboardState, setDashboardState });

    const onLayoutChange = (newLayout: Layout[], newLayouts: Layouts) => {
        if (modes.isEditMode || modes.isPreviewMode) {
            setDashboardState({
                ...dashboardState,
                layouts: newLayouts,
            });
        }
    };

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

                const filteredLayouts = filterLayoutsByRole(layout_config, currentRole as Role);
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
    }, [setDashboardState, currentRole]);

    const undo = () => {
        if (canUndo) {
            undoAction();
            toast({ title: "Deshacer", description: "Última acción deshecha." });
        }
    };

    const redo = () => {
        if (canRedo) {
            redoAction();
            toast({ title: "Rehacer", description: "Última acción rehecha." });
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!modes.isEditMode && !modes.isPreviewMode) return;
            if (event.ctrlKey || event.metaKey) {
                if (event.key === 'z') {
                    event.preventDefault();
                    undo();
                } else if (event.key === 'y') {
                    event.preventDefault();
                    redo();
                } else if (event.key === 'p' && modes.isEditMode) {
                    event.preventDefault();
                    modes.handleEnterPreview();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [modes.isEditMode, modes.isPreviewMode, canUndo, canRedo, undoAction, redoAction, modes.handleEnterPreview]);
    
    return {
        isLoading: !isInitialized,
        isEditMode: modes.isEditMode,
        isPreviewMode: modes.isPreviewMode,
        isSaving,
        isResetting,
        isApplyingTemplate,
        currentLayouts,
        currentWidgets,
        configuringWidgetId: widgetManager.configuringWidgetId,
        widgetToRemove: widgetManager.widgetToRemove,
        isResetConfirmOpen,
        isTemplateSheetOpen,
        canUndo,
        canRedo,
        defaultLayoutForRole: defaultLayoutAndWidgets.layout,
        
        onLayoutChange,
        handleToggleEdit: modes.handleToggleEdit,
        handleEnterPreview: modes.handleEnterPreview,
        handleExitPreview: modes.handleExitPreview,
        handleApplyPreviewChanges: modes.handleApplyPreviewChanges,
        handleDiscardPreviewChanges: modes.handleDiscardPreviewChanges,
        handleSaveLayout,
        handleResetLayout,
        handleCancelEdit: modes.handleCancelEdit,
        handleAddWidget: widgetManager.handleAddWidget,
        handleRemoveWidget: widgetManager.handleRemoveWidget,
        confirmRemoveWidget: widgetManager.confirmRemoveWidget,
        handleConfigureWidget: widgetManager.handleConfigureWidget,
        handleWidgetConfigSave: widgetManager.handleWidgetConfigSave,
        handleApplyTemplate,
        
        setIsEditMode: modes.setIsEditMode,
        setConfiguringWidgetId: widgetManager.setConfiguringWidgetId,
        setWidgetToRemove: widgetManager.setWidgetToRemove,
        setIsResetConfirmOpen,
        setIsTemplateSheetOpen,
        undo,
        redo,
    };
};
