
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useAuthRoles } from '@/hooks/useAuthRoles';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { DashboardHeader } from './DashboardHeader';
import { DashboardGrid } from './DashboardGrid';
import { DashboardTemplateSheet } from './DashboardTemplateSheet';
import { WidgetConfigSheet } from './WidgetConfigSheet';
import { PreviewBanner } from './PreviewBanner';
import { DashboardErrorBoundary } from './DashboardErrorBoundary';
import { DashboardSkeleton } from './DashboardSkeleton';
import { useDashboardManager } from '@/hooks/useDashboardManager';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { WidgetType } from './widgetRegistry';

export const CustomizableDashboard = () => {
    const { currentRole } = useAuthRoles();
    const { handleError } = useErrorHandler({
        showToast: true,
        fallbackMessage: 'Error en el dashboard'
    });

    const {
        isLoading,
        isEditMode,
        isPreviewMode,
        isSaving,
        isResetting,
        isApplyingTemplate,
        currentLayouts,
        currentWidgets,
        defaultLayoutForRole,
        configuringWidgetId,
        widgetToRemove,
        isResetConfirmOpen,
        isTemplateSheetOpen,
        canUndo,
        canRedo,
        hasError,
        
        onLayoutChange,
        handleToggleEdit,
        handleEnterPreview,
        handleExitPreview,
        handleApplyPreviewChanges,
        handleDiscardPreviewChanges,
        handleSaveLayout,
        handleResetLayout,
        handleCancelEdit,
        handleAddWidget,
        handleRemoveWidget,
        confirmRemoveWidget,
        handleConfigureWidget,
        handleWidgetConfigSave,
        handleApplyTemplate,
        
        setIsEditMode,
        setConfiguringWidgetId,
        setWidgetToRemove,
        setIsResetConfirmOpen,
        setIsTemplateSheetOpen,
        undo,
        redo,
    } = useDashboardManager(currentRole);

    const currentWidgetIds = (currentLayouts?.lg || defaultLayoutForRole || []).map(item => item.i as WidgetType);

    // Show skeleton while loading
    if (isLoading) {
        return <DashboardSkeleton />;
    }

    // Show error state if there's a critical error
    if (hasError) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error en el Dashboard</h2>
                    <p className="text-gray-600 mb-4">Hubo un problema al cargar el dashboard.</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Recargar Página
                    </button>
                </div>
            </div>
        );
    }

    return (
        <DashboardErrorBoundary>
            <div className="space-y-4 relative">
                {isApplyingTemplate && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50 rounded-lg">
                        <DashboardSkeleton />
                    </div>
                )}
                
                {isPreviewMode && (
                    <PreviewBanner
                        onApplyChanges={handleApplyPreviewChanges}
                        onDiscardChanges={handleDiscardPreviewChanges}
                        onExitPreview={handleExitPreview}
                        isApplying={isSaving}
                        canUndo={canUndo}
                        canRedo={canRedo}
                        onUndo={undo}
                        onRedo={redo}
                    />
                )}

                <DashboardHeader
                    isEditMode={isEditMode}
                    isPreviewMode={isPreviewMode}
                    isSaving={isSaving}
                    isResetting={isResetting}
                    currentWidgetIds={currentWidgetIds}
                    onToggleEdit={handleToggleEdit}
                    onEnterPreview={handleEnterPreview}
                    onSave={handleSaveLayout}
                    onResetConfirm={() => setIsResetConfirmOpen(true)}
                    onCancelEdit={handleCancelEdit}
                    onAddWidget={handleAddWidget}
                    onManageTemplates={() => setIsTemplateSheetOpen(true)}
                    onUndo={undo}
                    onRedo={redo}
                    canUndo={canUndo}
                    canRedo={canRedo}
                />

                <DashboardErrorBoundary>
                    <DashboardGrid
                        layouts={currentLayouts || { lg: [] }}
                        onLayoutChange={onLayoutChange}
                        isEditMode={isEditMode || isPreviewMode}
                        widgets={currentWidgets || {}}
                        onRemoveWidget={handleRemoveWidget}
                        onConfigureWidget={handleConfigureWidget}
                    />
                </DashboardErrorBoundary>

                <DashboardTemplateSheet
                    isOpen={isTemplateSheetOpen}
                    onClose={() => setIsTemplateSheetOpen(false)}
                    onApplyTemplate={handleApplyTemplate}
                    currentLayouts={currentLayouts}
                    currentWidgets={currentWidgets}
                />
                
                <WidgetConfigSheet 
                    isOpen={!!configuringWidgetId}
                    onClose={() => setConfiguringWidgetId(null)}
                    widgetId={configuringWidgetId}
                    currentConfig={currentWidgets?.[configuringWidgetId || '']}
                    onSave={handleWidgetConfigSave}
                />
                
                <ConfirmDialog
                    open={!!widgetToRemove}
                    onOpenChange={(open) => !open && setWidgetToRemove(null)}
                    title="¿Quitar widget?"
                    description="Esta acción quitará el widget de tu dashboard. Los cambios se guardarán cuando presiones 'Guardar Diseño'."
                    onConfirm={confirmRemoveWidget}
                    variant="destructive"
                    confirmText="Sí, quitar"
                />
                
                <ConfirmDialog
                    open={isResetConfirmOpen}
                    onOpenChange={setIsResetConfirmOpen}
                    title="¿Restaurar diseño por defecto?"
                    description="Esta acción restaurará el dashboard a su diseño predeterminado para tu rol actual. Se perderán todos los cambios de diseño que hayas guardado."
                    onConfirm={handleResetLayout}
                    variant="destructive"
                    confirmText="Sí, restaurar"
                />
            </div>
        </DashboardErrorBoundary>
    );
}
