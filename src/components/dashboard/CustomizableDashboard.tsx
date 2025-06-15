
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
import { EnhancedLoading } from '../ui/enhanced-loading';
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

    return (
        <DashboardErrorBoundary>
            <EnhancedLoading
                isLoading={isLoading}
                error={hasError ? new Error('Error crítico en el dashboard') : null}
                onRetry={() => window.location.reload()}
                loadingText="Cargando dashboard..."
                skeletonRows={4}
            >
                <div className="space-y-4 relative">
                    {isApplyingTemplate && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50 rounded-lg">
                            <EnhancedLoading
                                isLoading={true}
                                loadingText="Aplicando plantilla..."
                                skeletonRows={1}
                            >
                                <div />
                            </EnhancedLoading>
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
                            defaultLayout={defaultLayoutForRole || []}
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
            </EnhancedLoading>
        </DashboardErrorBoundary>
    );
}
