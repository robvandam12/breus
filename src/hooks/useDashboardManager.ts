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
import { useTemplateManager } from './useTemplateManager';
import { useDashboardKeyboardShortcuts } from './useDashboardKeyboardShortcuts';
import { filterLayoutsByRole } from '@/utils/dashboardUtils';

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

    const templateManager = useTemplateManager({
        setDashboardState,
        currentRole: currentRole as Role,
        defaultWidgets
    });

    const onLayoutChange = (newLayout: Layout[], newLayouts: Layouts) => {
        if (modes.isEditMode || modes.isPreviewMode) {
            setDashboardState({
                ...dashboardState,
                layouts: newLayouts,
            });
        }
    };

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
    
    useDashboardKeyboardShortcuts({
        isEditMode: modes.isEditMode,
        isPreviewMode: modes.isPreviewMode,
        undo,
        redo,
        handleEnterPreview: modes.handleEnterPreview,
    });
    
    return {
        isLoading: !isInitialized,
        isEditMode: modes.isEditMode,
        isPreviewMode: modes.isPreviewMode,
        isSaving,
        isResetting,
        isApplyingTemplate: templateManager.isApplyingTemplate,
        currentLayouts,
        currentWidgets,
        configuringWidgetId: widgetManager.configuringWidgetId,
        widgetToRemove: widgetManager.widgetToRemove,
        isResetConfirmOpen,
        isTemplateSheetOpen: templateManager.isTemplateSheetOpen,
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
        handleApplyTemplate: templateManager.handleApplyTemplate,
        
        setIsEditMode: modes.setIsEditMode,
        setConfiguringWidgetId: widgetManager.setConfiguringWidgetId,
        setWidgetToRemove: widgetManager.setWidgetToRemove,
        setIsResetConfirmOpen,
        setIsTemplateSheetOpen: templateManager.setIsTemplateSheetOpen,
        undo,
        redo,
    };
};
