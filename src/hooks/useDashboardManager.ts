
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
    
    const { layouts: currentLayouts, widgets: currentWidgets } = dashboardState;

    const {
        isLoading,
        getInitialDashboardState,
        defaultLayoutForRole,
        saveLayout,
        isSaving,
        resetLayout,
        isResetting,
    } = useDashboardInitialization(currentRole as Role, resetDashboardState);
    
    const modes = useDashboardModes({
        dashboardState,
        setDashboardState,
        resetDashboardState,
        getInitialDashboardState,
    });
    
    const layoutActions = useDashboardLayoutActions({
        currentLayouts,
        currentWidgets,
        saveLayout,
        resetLayout,
        onSaveSuccess: () => {
            modes.setIsEditMode(false);
            modes.setIsPreviewMode(false);
            modes.setPreviewSnapshot(null);
        },
        onResetSuccess: () => {
            resetDashboardState(getInitialDashboardState()); 
            modes.setIsEditMode(false);
            modes.setIsPreviewMode(false);
            modes.setPreviewSnapshot(null);
        }
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

    const handleApplyPreviewChanges = () => {
        if (modes.isPreviewMode) {
            modes.handleApplyPreviewChanges();
            layoutActions.handleSaveLayout();
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
    };
};
