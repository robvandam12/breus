import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Skeleton } from '../ui/skeleton';
import { useAuthRoles } from '@/hooks/useAuthRoles';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { DashboardHeader } from './DashboardHeader';
import { DashboardGrid } from './DashboardGrid';
import { DashboardTemplateSheet } from './DashboardTemplateSheet';
import { WidgetConfigSheet } from './WidgetConfigSheet';
import { useDashboardManager } from '@/hooks/useDashboardManager';
import { WidgetType } from './widgetRegistry';

export const CustomizableDashboard = () => {
    const { currentRole } = useAuthRoles();
    const {
        isLoading,
        isEditMode,
        isSaving,
        isResetting,
        currentLayouts,
        currentWidgets,
        defaultLayoutForRole,
        configuringWidgetId,
        widgetToRemove,
        isResetConfirmOpen,
        isTemplateSheetOpen,
        canUndo,
        canRedo,
        
        onLayoutChange,
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
    
    if (isLoading) {
        return (
          <div className="space-y-4">
              <div className="flex justify-end"><Skeleton className="h-10 w-36" /></div>
              <div className="grid grid-cols-12 gap-4">
                  <Skeleton className="h-24 col-span-12" />
                  <Skeleton className="h-64 col-span-12" />
                  <Skeleton className="h-80 col-span-5" />
                  <Skeleton className="h-80 col-span-3" />
                  <Skeleton className="h-80 col-span-4" />
              </div>
          </div>
        );
    }

    const currentWidgetIds = (currentLayouts?.lg || defaultLayoutForRole || []).map(item => item.i);

    return (
        <div className="space-y-4">
             <DashboardHeader
                isEditMode={isEditMode}
                isSaving={isSaving}
                isResetting={isResetting}
                currentWidgetIds={currentWidgetIds}
                onToggleEdit={() => setIsEditMode(true)}
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

            <DashboardGrid
                layouts={currentLayouts}
                onLayoutChange={onLayoutChange}
                isEditMode={isEditMode}
                widgets={currentWidgets}
                defaultLayout={defaultLayoutForRole}
                onRemoveWidget={handleRemoveWidget}
                onConfigureWidget={handleConfigureWidget}
            />
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
    );
}
