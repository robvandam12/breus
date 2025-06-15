import { useState, useEffect } from 'react';
import { Layout, Layouts } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { widgetRegistry, WidgetType } from './widgetRegistry';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { useAuthRoles } from '@/hooks/useAuthRoles';
import { WidgetConfigSheet } from './WidgetConfigSheet';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { getLayoutForRole, cols } from './layouts';
import { DashboardHeader } from './DashboardHeader';
import { DashboardGrid } from './DashboardGrid';
import { DashboardTemplateSheet } from './DashboardTemplateSheet';
import { useUndoRedo } from '@/hooks/useUndoRedo';

interface DashboardState {
    layouts: Layouts;
    widgets: any;
}

const defaultWidgets = {};

export const CustomizableDashboard = () => {
    const { currentRole } = useAuthRoles();
    const defaultLayoutForRole = getLayoutForRole(currentRole);

    const { layout: savedLayout, widgets: savedWidgets, isLoading, saveLayout, isSaving, resetLayout, isResetting } = useDashboardLayout(defaultLayoutForRole, defaultWidgets);
    
    const [isEditMode, setIsEditMode] = useState(false);

    const { 
        state: dashboardState, 
        set: setDashboardState, 
        undo, 
        redo,
        reset: resetDashboardState, 
        canUndo, 
        canRedo 
    } = useUndoRedo<DashboardState>({ layouts: {}, widgets: defaultWidgets });

    const { layouts: currentLayouts, widgets: currentWidgets } = dashboardState;
    
    const [configuringWidgetId, setConfiguringWidgetId] = useState<WidgetType | null>(null);
    const [widgetToRemove, setWidgetToRemove] = useState<string | null>(null);
    const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
    const [isTemplateSheetOpen, setIsTemplateSheetOpen] = useState(false);

    useEffect(() => {
        const roleLayout = getLayoutForRole(currentRole);
        const filteredRoleLayout = roleLayout.filter(item => widgetRegistry[item.i]);
        
        let initialLayouts: Layouts = { lg: filteredRoleLayout };
        
        if (savedLayout) {
             if (Array.isArray(savedLayout) && savedLayout.length > 0) {
                const filteredLayout = savedLayout.filter(item => widgetRegistry[item.i]);
                initialLayouts = { lg: filteredLayout };
            } else if (typeof savedLayout === 'object' && !Array.isArray(savedLayout) && Object.keys(savedLayout).length > 0) {
                const filteredLayouts = Object.entries(savedLayout).reduce((acc, [key, value]) => {
                    if(Array.isArray(value)) {
                        acc[key] = value.filter(item => widgetRegistry[item.i]);
                    }
                    return acc;
                }, {} as Layouts);
                initialLayouts = filteredLayouts;
            } else {
                 initialLayouts = { lg: filteredRoleLayout };
            }
        }

        if (!isLoading) {
             resetDashboardState({
                layouts: initialLayouts,
                widgets: savedWidgets || defaultWidgets,
            });
        }
    }, [savedLayout, savedWidgets, isLoading, currentRole, resetDashboardState]);

    const onLayoutChange = (newLayout: Layout[], newLayouts: Layouts) => {
        if (isEditMode) {
            setDashboardState({
                ...dashboardState,
                layouts: newLayouts,
            });
        }
    };

    const handleSaveLayout = () => {
        saveLayout({ layout: currentLayouts, widgets: currentWidgets }, {
            onSuccess: () => {
                toast({ title: "Diseño guardado", description: "Tu dashboard ha sido actualizado." });
                setIsEditMode(false);
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
                setIsEditMode(false);
            },
            onError: () => {
                toast({ title: "Error", description: "No se pudo restaurar el diseño.", variant: "destructive" });
            }
        });
    };

    const handleAddWidget = (widgetType: WidgetType) => {
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
                y: Infinity, // This will be placed at the bottom
                w: widgetConfig.defaultLayout.w,
                h: widgetConfig.defaultLayout.h,
            };
            newLayouts[bp as keyof typeof cols] = [...(newLayouts[bp as keyof typeof cols] || []), newWidgetItem];
        });

        setDashboardState({ ...dashboardState, layouts: newLayouts });
    };

    const handleRemoveWidget = (widgetId: string) => {
        setWidgetToRemove(widgetId);
    };

    const confirmRemoveWidget = () => {
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
    };

    const handleConfigureWidget = (widgetId: WidgetType) => {
        setConfiguringWidgetId(widgetId);
    };

    const handleWidgetConfigSave = (widgetId: WidgetType, config: any) => {
        const newWidgets = {
            ...currentWidgets,
            [widgetId]: config,
        };
        setDashboardState({ ...dashboardState, widgets: newWidgets });
        setConfiguringWidgetId(null);
        toast({ title: "Configuración actualizada", description: "Los cambios se aplicarán al guardar el diseño del dashboard." });
    };

    const handleApplyTemplate = (layout: Layouts, widgets: any) => {
        setDashboardState({ layouts: layout, widgets: widgets || defaultWidgets });
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isEditMode) return;
            if (event.ctrlKey || event.metaKey) {
                if (event.key === 'z') {
                    event.preventDefault();
                    undo();
                } else if (event.key === 'y') {
                    event.preventDefault();
                    redo();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isEditMode, undo, redo]);
    
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
