
import { useState, useEffect } from 'react';
import RGL, { WidthProvider, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { widgetRegistry, WidgetType } from './widgetRegistry';
import { WidgetCard } from './WidgetCard';
import { Button } from '@/components/ui/button';
import { Edit, Save, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

const ReactGridLayout = WidthProvider(RGL);

const defaultLayout: Layout[] = [
  { i: 'kpi_cards', x: 0, y: 0, w: 12, h: 2, static: true },
  { i: 'stats_chart', x: 0, y: 2, w: 12, h: 5 },
  { i: 'upcoming_operations', x: 0, y: 7, w: 5, h: 6 },
  { i: 'quick_actions', x: 5, y: 7, w: 3, h: 6 },
  { i: 'alerts_panel', x: 8, y: 7, w: 4, h: 6 },
];

const defaultWidgets = {};

export const CustomizableDashboard = () => {
    const { layout, widgets, isLoading, saveLayout, isSaving } = useDashboardLayout(defaultLayout, defaultWidgets);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentLayout, setCurrentLayout] = useState<Layout[]>([]);

    useEffect(() => {
        setCurrentLayout(layout);
    }, [layout]);

    const onLayoutChange = (newLayout: Layout[]) => {
        if (isEditMode) {
            setCurrentLayout(newLayout);
        }
    };

    const handleSaveLayout = () => {
        saveLayout({ layout: currentLayout, widgets }, {
            onSuccess: () => {
                toast({ title: "Diseño guardado", description: "Tu dashboard ha sido actualizado." });
                setIsEditMode(false);
            },
            onError: () => {
                toast({ title: "Error", description: "No se pudo guardar el diseño.", variant: "destructive" });
            }
        });
    }

    const generateDOM = () => {
        return (currentLayout || []).map((item) => {
            const widgetKey = item.i as WidgetType;
            if (!widgetRegistry[widgetKey]) {
                return <div key={item.i}><WidgetCard title={`Error: Widget '${item.i}' no encontrado`}>Componente no registrado.</WidgetCard></div>;
            }
            const { name, component: WidgetComponent } = widgetRegistry[widgetKey];

            return (
                <div key={item.i} className={isEditMode ? 'border-2 border-dashed border-primary/50 rounded-lg' : ''}>
                    <WidgetCard title={name} isDraggable={isEditMode}>
                        <WidgetComponent />
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
                    <Button onClick={handleSaveLayout} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        {isSaving ? 'Guardando...' : 'Guardar Diseño'}
                    </Button>
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
                rowHeight={50}
                isDraggable={isEditMode}
                isResizable={isEditMode}
                draggableHandle=".drag-handle"
                margin={[16, 16]}
            >
                {generateDOM()}
            </ReactGridLayout>
        </div>
    );
}
