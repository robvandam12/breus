import React, { useEffect, useRef, useMemo } from 'react';
import { Responsive, WidthProvider, Layout, Layouts } from 'react-grid-layout';
import { widgetRegistry, WidgetType } from './widgetRegistry';
import { WidgetCard } from './WidgetCard';
import { LazyWidget } from './LazyWidget';
import { breakpoints, cols } from './layouts';

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

    useEffect(() => {
        if (isEditMode && gridContainerRef.current) {
            // Enfoca el primer widget disponible al entrar en modo edición.
            // Esto mejora la accesibilidad del teclado al proporcionar un punto de partida claro.
            const firstWidget = gridContainerRef.current.querySelector<HTMLElement>('.react-grid-item [tabindex="0"]');
            if (firstWidget) {
                // Pequeño timeout para asegurar que el elemento sea enfocable después del cambio de estado.
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
                // If nothing is focused, start from the first one
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

        // We attach the listener to the grid container to avoid global conflicts
        container.addEventListener('keydown', handleKeyDown);
        return () => {
            if (container) {
                container.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, [isEditMode, layouts]);

    const domElements = useMemo(() => {
        const layoutForDOM = layouts.lg || layouts.md || layouts.sm || defaultLayout;
        return (layoutForDOM || []).map((item) => {
            const widgetKey = item.i as WidgetType;
            if (!widgetRegistry[widgetKey]) {
                return <div key={item.i}><WidgetCard title={`Error: Widget '${item.i}' no encontrado`}>Componente no registrado.</WidgetCard></div>;
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
                    className={`rounded-lg h-full animate-scale-in transition-all duration-300 ${isEditMode && !item.static ? 'border-2 border-dashed border-primary/50 animate-border-pulse' : ''}`}
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
    }, [layouts, isEditMode, widgets, defaultLayout, onRemoveWidget, onConfigureWidget]);


    return (
        <div ref={gridContainerRef} role="grid" aria-label="Panel de control de widgets" tabIndex={-1}>
            <ResponsiveGridLayout
                layouts={layouts}
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
                {domElements}
            </ResponsiveGridLayout>
        </div>
    );
};
