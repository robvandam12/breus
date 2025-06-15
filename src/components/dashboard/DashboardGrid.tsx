
import React, { useEffect, useRef, useMemo } from 'react';
import { Responsive, WidthProvider, Layout, Layouts } from 'react-grid-layout';
import { widgetRegistry, WidgetType } from './widgetRegistry';
import { WidgetCard } from './WidgetCard';
import { LazyWidget } from './LazyWidget';
import { breakpoints, cols } from './layouts';
import { isValidLayout } from '@/utils/dashboardUtils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
    layouts: Layouts;
    onLayoutChange: (newLayout: Layout[], newLayouts: Layouts) => void;
    isEditMode: boolean;
    widgets: any;
    defaultLayout: Layout[];
    onRemoveWidget: (widgetId: string) => void;
    onConfigureWidget: (widgetId: WidgetType) => void;
}

export const DashboardGrid = ({
    layouts,
    onLayoutChange,
    isEditMode,
    widgets,
    defaultLayout,
    onRemoveWidget,
    onConfigureWidget,
}: DashboardGridProps) => {
    const gridContainerRef = useRef<HTMLDivElement>(null);

    // Validar layouts recibidos
    const validatedLayouts = useMemo(() => {
        if (!layouts || typeof layouts !== 'object') {
            console.warn('Layouts inválidos recibidos, usando layout por defecto');
            return { lg: defaultLayout || [] };
        }
        
        const validated: Layouts = {};
        let hasValidBreakpoint = false;
        
        Object.keys(layouts).forEach(bp => {
            const layout = layouts[bp];
            if (Array.isArray(layout)) {
                const validItems = layout.filter(isValidLayout);
                if (validItems.length > 0) {
                    validated[bp] = validItems;
                    hasValidBreakpoint = true;
                }
            }
        });
        
        if (!hasValidBreakpoint) {
            return { lg: defaultLayout || [] };
        }
        
        // Asegurar que lg existe
        if (!validated.lg && defaultLayout) {
            validated.lg = defaultLayout;
        }
        
        return validated;
    }, [layouts, defaultLayout]);

    useEffect(() => {
        if (isEditMode && gridContainerRef.current) {
            // Enfoca el primer widget disponible al entrar en modo edición.
            const firstWidget = gridContainerRef.current.querySelector<HTMLElement>('.react-grid-item [tabindex="0"]');
            if (firstWidget) {
                setTimeout(() => firstWidget.focus(), 100);
            }
        }
    }, [isEditMode]);

    useEffect(() => {
        const container = gridContainerRef.current;
        if (!container || !isEditMode) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                return;
            }

            const widgets = Array.from(
                container.querySelectorAll<HTMLElement>('.react-grid-item [role="group"][tabindex="0"]')
            );
            if (widgets.length <= 1) return;
            
            event.preventDefault();

            const focusedElement = document.activeElement as HTMLElement;
            const currentIndex = widgets.findIndex(widget => widget === focusedElement || widget.contains(focusedElement));

            let nextIndex = currentIndex;
            if (currentIndex === -1) {
                nextIndex = 0;
            } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                nextIndex = (currentIndex + 1) % widgets.length;
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                nextIndex = (currentIndex - 1 + widgets.length) % widgets.length;
            }

            if (widgets[nextIndex]) {
                widgets[nextIndex].focus();
            }
        };

        container.addEventListener('keydown', handleKeyDown);
        return () => {
            if (container) {
                container.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, [isEditMode, validatedLayouts]);

    const domElements = useMemo(() => {
        try {
            const layoutForDOM = validatedLayouts.lg || validatedLayouts.md || validatedLayouts.sm || defaultLayout || [];
            
            if (!Array.isArray(layoutForDOM) || layoutForDOM.length === 0) {
                return [(
                    <div key="empty-state" className="flex items-center justify-center h-32">
                        <Alert className="max-w-md">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                No hay widgets configurados para mostrar.
                            </AlertDescription>
                        </Alert>
                    </div>
                )];
            }
            
            return layoutForDOM.map((item) => {
                if (!isValidLayout(item)) {
                    return (
                        <div key={`invalid-${Math.random()}`} className="p-4 border-2 border-dashed border-red-300 rounded">
                            <p className="text-sm text-red-600">Widget inválido</p>
                        </div>
                    );
                }
                
                const widgetKey = item.i as WidgetType;
                if (!widgetRegistry[widgetKey]) {
                    return (
                        <div key={item.i} className="p-4 border-2 border-dashed border-yellow-300 rounded">
                            <WidgetCard title={`Error: Widget '${item.i}' no encontrado`}>
                                <p className="text-sm text-yellow-700">Componente no registrado.</p>
                            </WidgetCard>
                        </div>
                    );
                }
                
                const { 
                    name, 
                    component: WidgetComponent, 
                    configComponent, 
                    skeleton: SkeletonComponent,
                    isHeavy = false
                } = widgetRegistry[widgetKey];

                const widgetProps = configComponent ? { config: widgets[widgetKey] } : {};

                const widgetContent = (
                    <React.Suspense fallback={<SkeletonComponent />}>
                        <WidgetComponent {...widgetProps} />
                    </React.Suspense>
                );

                const skeletonContent = <SkeletonComponent />;

                return (
                    <div 
                        key={item.i} 
                        className={`rounded-lg h-full animate-scale-in transition-all duration-300 ${
                            isEditMode && !item.static ? 'border-2 border-dashed border-primary/50 animate-border-pulse' : ''
                        }`}
                        role="gridcell"
                    >
                        <WidgetCard 
                            title={name} 
                            isDraggable={isEditMode}
                            isStatic={item.static}
                            onRemove={() => onRemoveWidget(item.i)}
                            onConfigure={configComponent ? () => onConfigureWidget(item.i as WidgetType) : undefined}
                        >
                            <LazyWidget
                                skeleton={skeletonContent}
                                isHeavy={isHeavy}
                            >
                                {widgetContent}
                            </LazyWidget>
                        </WidgetCard>
                    </div>
                );
            });
        } catch (error) {
            console.error('Error al generar elementos del DOM:', error);
            return [(
                <div key="error-state" className="flex items-center justify-center h-32">
                    <Alert variant="destructive" className="max-w-md">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            Error al cargar widgets. Por favor, recarga la página.
                        </AlertDescription>
                    </Alert>
                </div>
            )];
        }
    }, [validatedLayouts, isEditMode, widgets, defaultLayout, onRemoveWidget, onConfigureWidget]);

    const handleLayoutChange = (newLayout: Layout[], newLayouts: Layouts) => {
        try {
            // Validar el nuevo layout antes de aplicarlo
            const validLayout = newLayout.filter(isValidLayout);
            const validLayouts: Layouts = {};
            
            Object.keys(newLayouts).forEach(bp => {
                const layout = newLayouts[bp];
                if (Array.isArray(layout)) {
                    const filtered = layout.filter(isValidLayout);
                    if (filtered.length > 0) {
                        validLayouts[bp] = filtered;
                    }
                }
            });
            
            onLayoutChange(validLayout, validLayouts);
        } catch (error) {
            console.error('Error al manejar cambio de layout:', error);
        }
    };

    return (
        <div ref={gridContainerRef} role="grid" aria-label="Panel de control de widgets" tabIndex={-1}>
            <ResponsiveGridLayout
                layouts={validatedLayouts}
                onLayoutChange={handleLayoutChange}
                className="layout"
                breakpoints={breakpoints}
                cols={cols}
                rowHeight={30}
                isDraggable={isEditMode}
                isResizable={isEditMode}
                draggableHandle=".drag-handle"
                margin={[16, 16]}
                compactType="vertical"
                preventCollision={false}
                useCSSTransforms={true}
            >
                {domElements}
            </ResponsiveGridLayout>
        </div>
    );
};
