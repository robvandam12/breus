import { useState, useEffect } from 'react';
import { Responsive, WidthProvider, Layout, Layouts } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { widgetRegistry, WidgetType } from './widgetRegistry';
import { WidgetCard } from './WidgetCard';
import { Button } from '@/components/ui/button';
import { Edit, Save, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { WidgetCatalog } from './WidgetCatalog';
import { useAuthRoles } from '@/hooks/useAuthRoles';
import { WidgetConfigSheet } from './WidgetConfigSheet';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ConfirmDialog } from '../ui/confirm-dialog';

const ResponsiveGridLayout = WidthProvider(Responsive);

const baseLayout: Layout[] = [
  { i: 'kpi_cards', x: 0, y: 0, w: 12, h: 2, static: true },
  { i: 'stats_chart', x: 0, y: 2, w: 12, h: 5 },
  { i: 'upcoming_operations', x: 0, y: 7, w: 5, h: 6 },
  { i: 'quick_actions', x: 5, y: 7, w: 3, h: 6 },
  { i: 'alerts_panel', x: 8, y: 7, w: 4, h: 6 },
];

const buzoLayout: Layout[] = [
    { i: 'my_immersions', x: 0, y: 0, w: 12, h: 7, isResizable: false },
    { i: 'kpi_cards', x: 0, y: 7, w: 12, h: 2, static: true },
    { i: 'quick_actions', x: 0, y: 9, w: 4, h: 6 },
    { i: 'alerts_panel', x: 4, y: 9, w: 8, h: 6 },
];

const supervisorLayout: Layout[] = [
    { i: 'kpi_cards', x: 0, y: 0, w: 12, h: 2, static: true },
    { i: 'team_status', x: 0, y: 2, w: 6, h: 8 },
    { i: 'upcoming_operations', x: 6, y: 2, w: 6, h: 8 },
    { i: 'stats_chart', x: 0, y: 10, w: 12, h: 5 },
    { i: 'alerts_panel', x: 0, y: 15, w: 7, h: 6 },
    { i: 'quick_actions', x: 7, y: 15, w: 5, h: 6 },
];

const adminLayout: Layout[] = [
    { i: 'kpi_cards', x: 0, y: 0, w: 12, h: 2, static: true },
    { i: 'stats_chart', x: 0, y: 2, w: 12, h: 5 },
    { i: 'global_metrics', x: 0, y: 7, w: 6, h: 6 },
    { i: 'alerts_panel', x: 6, y: 7, w: 6, h: 6 },
    { i: 'upcoming_operations', x: 0, y: 13, w: 7, h: 6 },
    { i: 'quick_actions', x: 7, y: 13, w: 5, h: 6 },
];

const getLayoutForRole = (role: string): Layout[] => {
    switch (role) {
        case 'buzo':
            return buzoLayout;
        case 'supervisor':
            return supervisorLayout;
        case 'admin_salmonera':
        case 'admin_servicio':
        case 'superuser':
            return adminLayout;
        default:
            return baseLayout;
    }
};

const defaultWidgets = {};

const breakpoints = { lg: 1200, md: 834, sm: 640, xs: 480, xxs: 0 };
const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

export const CustomizableDashboard = () => {
    const { currentRole } = useAuthRoles();
    const defaultLayoutForRole = getLayoutForRole(currentRole);

    const { layout, widgets: savedWidgets, isLoading, saveLayout, isSaving } = useDashboardLayout(defaultLayoutForRole, defaultWidgets);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentLayouts, setCurrentLayouts] = useState<Layouts>({});
    const [currentWidgets, setCurrentWidgets] = useState<any>(savedWidgets || defaultWidgets);
    const [configuringWidgetId, setConfiguringWidgetId] = useState<WidgetType | null>(null);
    const [widgetToRemove, setWidgetToRemove] = useState<string | null>(null);

    useEffect(() => {
        const roleLayout = getLayoutForRole(currentRole);
        const filteredRoleLayout = roleLayout.filter(item => widgetRegistry[item.i]);

        if (layout) {
             if (Array.isArray(layout) && layout.length > 0) { // Old format, convert to new
                const filteredLayout = layout.filter(item => widgetRegistry[item.i]);
                setCurrentLayouts({ lg: filteredLayout });
            } else if (typeof layout === 'object' && !Array.isArray(layout) && Object.keys(layout).length > 0) { // New format
                const filteredLayouts = Object.entries(layout).reduce((acc, [key, value]) => {
                    if(Array.isArray(value)) {
                        acc[key] = value.filter(item => widgetRegistry[item.i]);
                    }
                    return acc;
                }, {} as Layouts);
                setCurrentLayouts(filteredLayouts);
            } else { // Handles empty array or empty object from DB
                setCurrentLayouts({ lg: filteredRoleLayout });
            }
        } else if (!isLoading) {
            setCurrentLayouts({ lg: filteredRoleLayout });
        }
    }, [layout, isLoading, currentRole]);

    useEffect(() => {
        if (savedWidgets) {
            setCurrentWidgets(savedWidgets);
        }
    }, [savedWidgets]);

    const onLayoutChange = (newLayout: Layout[], newLayouts: Layouts) => {
        if (isEditMode) {
            setCurrentLayouts(newLayouts);
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

    const handleAddWidget = (widgetType: WidgetType) => {
        const widgetConfig = widgetRegistry[widgetType];
        if (!widgetConfig) return;

        const newLayouts = { ...currentLayouts };
        
        if (Object.keys(newLayouts).length === 0) {
            Object.keys(cols).forEach(bp => {
                newLayouts[bp] = [];
            });
        }
        
        Object.keys(newLayouts).forEach(bp => {
            const newWidgetItem: Layout = {
                i: widgetType,
                x: (newLayouts[bp].length * widgetConfig.defaultLayout.w) % (cols[bp] || 12),
                y: Infinity, // This will be placed at the bottom
                w: widgetConfig.defaultLayout.w,
                h: widgetConfig.defaultLayout.h,
            };
            newLayouts[bp] = [...(newLayouts[bp] || []), newWidgetItem];
        });

        setCurrentLayouts(newLayouts);
    };

    const handleRemoveWidget = (widgetId: string) => {
        setWidgetToRemove(widgetId);
    };

    const confirmRemoveWidget = () => {
        if (!widgetToRemove) return;
        const newLayouts = { ...currentLayouts };
        Object.keys(newLayouts).forEach(bp => {
            newLayouts[bp] = newLayouts[bp].filter(item => item.i !== widgetToRemove);
        });
        setCurrentLayouts(newLayouts);
        const newWidgets = { ...currentWidgets };
        delete newWidgets[widgetToRemove];
        setCurrentWidgets(newWidgets);
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
        setCurrentWidgets(newWidgets);
        setConfiguringWidgetId(null);
        toast({ title: "Configuración actualizada", description: "Los cambios se aplicarán al guardar el diseño del dashboard." });
    };

    const generateDOM = () => {
        const layoutForDOM = currentLayouts.lg || currentLayouts.md || currentLayouts.sm || defaultLayoutForRole;
        return (layoutForDOM || []).map((item) => {
            const widgetKey = item.i as WidgetType;
            if (!widgetRegistry[widgetKey]) {
                return <div key={item.i}><WidgetCard title={`Error: Widget '${item.i}' no encontrado`}>Componente no registrado.</WidgetCard></div>;
            }
            const { name, component: WidgetComponent, configComponent } = widgetRegistry[widgetKey];

            const widgetProps = configComponent ? { config: currentWidgets[widgetKey] } : {};

            return (
                <motion.div 
                    key={item.i} 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 150, damping: 20 }}
                    className={`rounded-lg h-full ${isEditMode && !item.static ? 'border-2 border-dashed border-primary/50 animate-border-pulse' : ''}`}
                >
                    <WidgetCard 
                        title={name} 
                        isDraggable={isEditMode}
                        isStatic={item.static}
                        onRemove={() => handleRemoveWidget(item.i)}
                        onConfigure={configComponent ? () => handleConfigureWidget(item.i as WidgetType) : undefined}
                    >
                        <WidgetComponent {...widgetProps} />
                    </WidgetCard>
                </motion.div>
            );
        });
    };
    
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

    const currentWidgetIds = (currentLayouts.lg || defaultLayoutForRole || []).map(item => item.i);

    return (
        <TooltipProvider>
            <div className="space-y-4">
                 <div className="flex justify-end gap-2">
                    {isEditMode ? (
                        <>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div>
                                        <WidgetCatalog 
                                            onAddWidget={handleAddWidget}
                                            currentWidgets={currentWidgetIds}
                                        />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Añadir nuevos widgets desde el catálogo.</p>
                                </TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button onClick={handleSaveLayout} disabled={isSaving}>
                                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                        {isSaving ? 'Guardando...' : 'Guardar Diseño'}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Guardar la disposición y configuración de tu dashboard.</p>
                                </TooltipContent>
                            </Tooltip>
                        </>
                    ) : (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" onClick={() => setIsEditMode(true)}>
                                    <Edit className="mr-2 h-4 w-4" /> Personalizar
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Activar modo edición para mover, quitar o configurar widgets.</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
                <ResponsiveGridLayout
                    layouts={currentLayouts}
                    onLayoutChange={onLayoutChange}
                    className="layout"
                    breakpoints={breakpoints}
                    cols={cols}
                    rowHeight={30}
                    isDraggable={isEditMode}
                    isResizable={isEditMode}
                    draggableHandle=".drag-handle"
                    margin={[16, 16]}
                    compactType="vertical"
                >
                    {generateDOM()}
                </ResponsiveGridLayout>
                <WidgetConfigSheet 
                    isOpen={!!configuringWidgetId}
                    onClose={() => setConfiguringWidgetId(null)}
                    widgetId={configuringWidgetId}
                    currentConfig={currentWidgets[configuringWidgetId || '']}
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
            </div>
        </TooltipProvider>
    );
}
