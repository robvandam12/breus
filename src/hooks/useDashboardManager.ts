
import { useCallback, useMemo } from 'react';
import { Layout, Layouts } from 'react-grid-layout';
import { Role } from '@/components/dashboard/widgetRegistry';
import { useDashboardInitialization } from './useDashboardInitialization';
import { useDashboardUndoRedo } from './useDashboardUndoRedo';
import { useDashboardLayoutActions } from './useDashboardLayoutActions';
import { useWidgetManager } from './useWidgetManager';
import { useDashboardModes } from './useDashboardModes';
import { useTemplateManager } from './useTemplateManager';
import { useDashboardKeyboardShortcuts } from './useDashboardKeyboardShortcuts';

const defaultWidgets = {};

export const useDashboardManager = (currentRole: string) => {
    const {
        dashboardState,
        setDashboardState,
        resetDashboardState,
        undo,
        redo,
        canUndo,
        canRedo,
    } = useDashboardUndoRedo();
    
    // Memoizar el estado actual para evitar re-renders innecesarios
    const memoizedDashboardState = useMemo(() => dashboardState, [dashboardState]);
    const { layouts: currentLayouts, widgets: currentWidgets } = memoizedDashboardState;

    const {
        isLoading,
        getInitialDashboardState,
        defaultLayoutForRole,
        saveLayout,
        isSaving,
        resetLayout,
        isResetting,
        hasError,
    } = useDashboardInitialization(currentRole as Role, resetDashboardState);
    
    const modes = useDashboardModes({
        dashboardState: memoizedDashboardState,
        setDashboardState,
        resetDashboardState,
        getInitialDashboardState,
    });
    
    const layoutActions = useDashboardLayoutActions({
        currentLayouts,
        currentWidgets,
        saveLayout,
        resetLayout,
        onSaveSuccess: useCallback(() => {
            modes.setIsEditMode(false);
            modes.setIsPreviewMode(false);
            modes.setPreviewSnapshot(null);
        }, [modes]),
        onResetSuccess: useCallback(() => {
            resetDashboardState(getInitialDashboardState()); 
            modes.setIsEditMode(false);
            modes.setIsPreviewMode(false);
            modes.setPreviewSnapshot(null);
        }, [resetDashboardState, getInitialDashboardState, modes])
    });

    const widgetManager = useWidgetManager({ 
        dashboardState: memoizedDashboardState, 
        setDashboardState 
    });

    const templateManager = useTemplateManager({
        setDashboardState,
        currentRole: currentRole as Role,
        defaultWidgets
    });

    // Optimizar el callback de cambio de layout
    const onLayoutChange = useCallback((newLayout: Layout[], newLayouts: Layouts) => {
        if (modes.isEditMode || modes.isPreviewMode) {
            setDashboardState(prevState => ({
                ...prevState,
                layouts: newLayouts,
            }));
        }
    }, [modes.isEditMode, modes.isPreviewMode, setDashboardState]);

    const handleApplyPreviewChanges = useCallback(() => {
        if (modes.isPreviewMode) {
            modes.handleApplyPreviewChanges();
            layoutActions.handleSaveLayout();
        }
    }, [modes, layoutActions]);
    
    useDashboardKeyboardShortcuts({
        isEditMode: modes.isEditMode,
        isPreviewMode: modes.isPreviewMode,
        undo,
        redo,
        handleEnterPreview: modes.handleEnterPreview,
    });

    // Memoizar el retorno para evitar re-renders de componentes consumidores
    return useMemo(() => ({
        isLoading,
        isEditMode: modes.isEditMode,
        isPreviewMode: modes.isPreviewMode,
        isSaving,
        isResetting,
        isApplyingTemplate: templateManager.isApplyingTemplate,
        currentLayouts,
        currentWidgets,
        configuringWidgetId: widgetManager.configuringWidgetId,
        widgetToRemove: widgetManager.widgetToRemove,
        isResetConfirmOpen: layoutActions.isResetConfirmOpen,
        isTemplateSheetOpen: templateManager.isTemplateSheetOpen,
        canUndo,
        canRedo,
        defaultLayoutForRole,
        hasError,
        
        onLayoutChange,
        handleToggleEdit: modes.handleToggleEdit,
        handleEnterPreview: modes.handleEnterPreview,
        handleExitPreview: modes.handleExitPreview,
        handleApplyPreviewChanges,
        handleDiscardPreviewChanges: modes.handleDiscardPreviewChanges,
        handleSaveLayout: layoutActions.handleSaveLayout,
        handleResetLayout: layoutActions.handleResetLayout,
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
        setIsResetConfirmOpen: layoutActions.setIsResetConfirmOpen,
        setIsTemplateSheetOpen: templateManager.setIsTemplateSheetOpen,
        undo,
        redo,
    }), [
        isLoading, modes, isSaving, isResetting, templateManager.isApplyingTemplate,
        currentLayouts, currentWidgets, widgetManager, layoutActions,
        canUndo, canRedo, defaultLayoutForRole, hasError,
        onLayoutChange, handleApplyPreviewChanges, undo, redo
    ]);
};
