
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout, Layouts } from 'react-grid-layout';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { widgetRegistry, WidgetType, Role } from '@/components/dashboard/widgetRegistry';
import { toast } from '@/hooks/use-toast';
import { getLayoutForRole } from '@/components/dashboard/layouts';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { useDashboardTemplates } from './useDashboardTemplates';
import { useWidgetManager } from './useWidgetManager';
import { useDashboardModes } from './useDashboardModes';

interface DashboardState {
    layouts: Layouts;
    widgets: any;
}

const defaultWidgets = {};

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
    
    const isLoading = isLoadingLayout || isLoadingTemplates;
    
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

    const getInitialDashboardState = useCallback(() => {
        const roleFilter = (item: Layout) => {
            const widgetConfig = widgetRegistry[item.i as WidgetType];
            if (!widgetConfig) return false;
            if (widgetConfig.roles && !widgetConfig.roles.includes(currentRole as Role)) {
                return false;
            }
            return true;
        };
        
        let initialLayouts: Layouts = { lg: [] };
        
        if (savedLayout) {
             if (Array.isArray(savedLayout)) {
                const filteredLayout = savedLayout.filter(roleFilter);
                initialLayouts = { lg: filteredLayout };
            } else if (typeof savedLayout === 'object' && !Array.isArray(savedLayout)) {
                const filteredLayouts = Object.entries(savedLayout).reduce((acc, [key, value]) => {
                    if(Array.isArray(value)) {
                        acc[key as keyof Layouts] = value.filter(roleFilter);
                    }
                    return acc;
                }, {} as Layouts);
                if (Object.keys(filteredLayouts).length > 0) {
                    initialLayouts = filteredLayouts;
                }
            }
        }
        
        if (!initialLayouts.lg) {
            initialLayouts.lg = [];
        }

        return {
            layouts: initialLayouts,
            widgets: savedWidgets,
        };
    }, [currentRole, savedLayout, savedWidgets]);

    useEffect(() => {
        if (!isLoading) {
             resetDashboardState(getInitialDashboardState());
        }
    }, [isLoading, getInitialDashboardState, resetDashboardState]);

    const handleSaveLayout = () => {
        saveLayout({ layout: currentLayouts, widgets: currentWidgets }, {
            onSuccess: () => {
                toast({ title: "Diseño guardado", description: "Tu dashboard ha sido actualizado." });
                modes.setIsEditMode(false);
                modes.setIsPreviewMode(false);
                modes.setPreviewSnapshot(null);
            },
            onError: () => {
                toast({ title: "Error", description: "No se pudo guardar el diseño.", variant: "destructive" });
            }
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
            onError: () => {
                toast({ title: "Error", description: "No se pudo restaurar el diseño.", variant: "destructive" });
            }
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

    const handleApplyTemplate = (layout: Layouts, widgets: any) => {
        setDashboardState({ layouts: layout, widgets: widgets || defaultWidgets });
    };

    const undo = () => {
        if (canUndo) {
            undoAction();
            toast({ description: "Acción deshecha." });
        }
    };

    const redo = () => {
        if (canRedo) {
            redoAction();
            toast({ description: "Acción rehecha." });
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
        isLoading,
        isEditMode: modes.isEditMode,
        isPreviewMode: modes.isPreviewMode,
        isSaving,
        isResetting,
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
