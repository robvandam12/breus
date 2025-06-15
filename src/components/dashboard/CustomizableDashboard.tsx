import { useState, useEffect } from 'react';
import RGL, { WidthProvider, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { widgetRegistry, WidgetType } from './widgetRegistry';
import { WidgetCard } from './WidgetCard';
import { Button } from '@/components/ui/button';
import { Edit, Save, Loader2, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { WidgetCatalog } from './WidgetCatalog';
import { useAuthRoles } from '@/hooks/useAuthRoles';
import { WidgetConfigSheet } from './WidgetConfigSheet';

const ReactGridLayout = WidthProvider(RGL);

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

export const CustomizableDashboard = () => {
    const { currentRole } = useAuthRoles();
    const defaultLayoutForRole = getLayoutForRole(currentRole);

    const { layout, widgets: savedWidgets, isLoading, saveLayout, isSaving } = useDashboardLayout(defaultLayoutForRole, defaultWidgets);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentLayout, setCurrentLayout] = useState<Layout[]>([]);
    const [currentWidgets, setCurrentWidgets] = useState<any>(savedWidgets || defaultWidgets);
    const [configuringWidgetId, setConfiguringWidgetId] = useState<WidgetType | null>(null);

    useEffect(() => {
        const roleLayout = getLayoutForRole(currentRole);
        if (layout && layout.length > 0) {
            const filteredLayout = layout.filter(item => widgetRegistry[item.i]);
            setCurrentLayout(filteredLayout);
        } else if (!isLoading) {
            setCurrentLayout(roleLayout);
        }
    }, [layout, isLoading, currentRole]);

    useEffect(() => {
        if (savedWidgets) {
            setCurrentWidgets(savedWidgets);
        }
    }, [savedWidgets]);

    const onLayoutChange = (newLayout: Layout[]) => {
        if (isEditMode) {
            setCurrentLayout(newLayout);
        }
    };

    const handleSaveLayout = () => {
        saveLayout({ layout: currentLayout, widgets: currentWidgets }, {
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

        const newWidgetLayout: Layout = {
            i: widgetType,
            x: (currentLayout.length * 4) % 12, // A simple way to position new widgets
            y: Infinity, // This will be placed at the bottom
            w: widgetConfig.defaultLayout.w,
            h: widgetConfig.defaultLayout.h,
        };

        setCurrentLayout([...currentLayout, newWidgetLayout]);
    };

    const handleRemoveWidget = (widgetId: string) => {
        setCurrentLayout(currentLayout.filter(item => item.i !== widgetId));
        const newWidgets = { ...currentWidgets };
        delete newWidgets[widgetId];
        setCurrentWidgets(newWidgets);
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
        return (currentLayout || []).map((item) => {
            const widgetKey = item.i as WidgetType;
            if (!widgetRegistry[widgetKey]) {
                return <div key={item.i}><WidgetCard title={`Error: Widget '${item.i}' no encontrado`}>Componente no registrado.</WidgetCard></div>;
            }
            const { name, component: WidgetComponent, configComponent } = widgetRegistry[widgetKey];

            const widgetProps = configComponent ? { config: currentWidgets[widgetKey] } : {};

            return (
                <div key={item.i} className={isEditMode ? 'border-2 border-dashed border-primary/50 rounded-lg' : ''}>
                    <WidgetCard 
                        title={name} 
                        isDraggable={isEditMode}
                        isStatic={item.static}
                        onRemove={() => handleRemoveWidget(item.i)}
                        onConfigure={configComponent ? () => handleConfigureWidget(item.i as WidgetType) : undefined}
                    >
                        <WidgetComponent {...widgetProps} />
                    </WidgetCard>
                </div>
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

    return (
        <div className="space-y-4">
             <div className="flex justify-end gap-2">
                {isEditMode ? (
                    <>
                        <WidgetCatalog 
                            onAddWidget={handleAddWidget}
                            currentWidgets={currentLayout.map(item => item.i)}
                        />
                        <Button onClick={handleSaveLayout} disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            {isSaving ? 'Guardando...' : 'Guardar Diseño'}
                        </Button>
                    </>
                ) : (
                    <Button variant="outline" onClick={() => setIsEditMode(true)}>
                        <Edit className="mr-2 h-4 w-4" /> Personalizar
                    </Button>
                )}
            </div>
            <ReactGridLayout
                layout={currentLayout}
                onLayoutChange={onLayoutChange}
                className="layout"
                cols={12}
                rowHeight={30}
                isDraggable={isEditMode}
                isResizable={isEditMode}
                draggableHandle=".drag-handle"
                margin={[16, 16]}
                compactType="vertical"
            >
                {generateDOM()}
            </ReactGridLayout>
            <WidgetConfigSheet 
                isOpen={!!configuringWidgetId}
                onClose={() => setConfiguringWidgetId(null)}
                widgetId={configuringWidgetId}
                currentConfig={currentWidgets[configuringWidgetId || '']}
                onSave={handleWidgetConfigSave}
            />
        </div>
    );
}
