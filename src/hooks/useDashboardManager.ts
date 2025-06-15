
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout, Layouts } from 'react-grid-layout';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { widgetRegistry, WidgetType, Role } from '@/components/dashboard/widgetRegistry';
import { toast } from '@/hooks/use-toast';
import { getLayoutForRole, cols } from '@/components/dashboard/layouts';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { useDashboardTemplates } from './useDashboardTemplates';

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
    
    const [isEditMode, setIsEditMode] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [previewSnapshot, setPreviewSnapshot] = useState<DashboardState | null>(null);

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
    
    const [configuringWidgetId, setConfiguringWidgetId] = useState<WidgetType | null>(null);
    const [widgetToRemove, setWidgetToRemove] = useState<string | null>(null);
    const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
    const [isTemplateSheetOpen, setIsTemplateSheetOpen] = useState(false);

    const getInitialDashboardState = useCallback(() => {
        const roleFilter = (item: Layout) => {
            const widgetConfig = widgetRegistry[item.i as WidgetType];
            if (!widgetConfig) return false;
            // If roles are defined, check if currentRole is included. If not defined, it's for all roles.
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

    const onLayoutChange = (newLayout: Layout[], newLayouts: Layouts) => {
        if (isEditMode || isPreviewMode) {
            setDashboardState({
                ...dashboardState,
                layouts: newLayouts,
            });
        }
    };

    const handleToggleEdit = () => {
        if (isPreviewMode) {
            handleExitPreview();
        }
        setIsEditMode(true);
        toast({ description: "Modo edición activado. Ahora puedes mover y redimensionar widgets." });
    };

    const handleEnterPreview = () => {
        if (isEditMode) {
            // Save current state as preview snapshot
            setPreviewSnapshot({ ...dashboardState });
            setIsEditMode(false);
            setIsPreviewMode(true);
            toast({ description: "Entrando a vista previa." });
        }
    };

    const handleExitPreview = () => {
        if (isPreviewMode && previewSnapshot) {
            // Restore to the snapshot state
            setDashboardState(previewSnapshot);
            setIsPreviewMode(false);
            setPreviewSnapshot(null);
            setIsEditMode(true);
            toast({ description: "Saliendo de vista previa." });
        }
    };

    const handleApplyPreviewChanges = () => {
        if (isPreviewMode) {
            setIsPreviewMode(false);
            setPreviewSnapshot(null);
            // Apply the current changes by saving
            handleSaveLayout();
        }
    };

    const handleDiscardPreviewChanges = () => {
        if (isPreviewMode) {
            resetDashboardState(getInitialDashboardState());
            setIsPreviewMode(false);
            setPreviewSnapshot(null);
            toast({ description: "Cambios de la vista previa descartados." });
        }
    };

    const handleSaveLayout = () => {
        saveLayout({ layout: currentLayouts, widgets: currentWidgets }, {
            onSuccess: () => {
                toast({ title: "Diseño guardado", description: "Tu dashboard ha sido actualizado." });
                setIsEditMode(false);
                setIsPreviewMode(false);
                setPreviewSnapshot(null);
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
                setIsPreviewMode(false);
                setPreviewSnapshot(null);
            },
            onError: () => {
                toast({ title: "Error", description: "No se pudo restaurar el diseño.", variant: "destructive" });
            }
        });
    };

    const handleCancelEdit = () => {
        resetDashboardState(getInitialDashboardState());
        setIsEditMode(false);
        setIsPreviewMode(false);
        setPreviewSnapshot(null);
        toast({ description: "Edición cancelada. Se ha restaurado el último diseño guardado." });
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
                y: Infinity,
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
            if (!isEditMode && !isPreviewMode) return;
            if (event.ctrlKey || event.metaKey) {
                if (event.key === 'z') {
                    event.preventDefault();
                    undo();
                } else if (event.key === 'y') {
                    event.preventDefault();
                    redo();
                } else if (event.key === 'p' && isEditMode) {
                    event.preventDefault();
                    handleEnterPreview();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isEditMode, isPreviewMode, canUndo, canRedo, undoAction, redoAction, handleEnterPreview]);
    
    return {
        isLoading,
        isEditMode,
        isPreviewMode,
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
    };
};
