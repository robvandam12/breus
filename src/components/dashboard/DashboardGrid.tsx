
import React from 'react';
import { Responsive, WidthProvider, Layout, Layouts } from 'react-grid-layout';
import { motion } from 'framer-motion';
import { widgetRegistry, WidgetType } from './widgetRegistry';
import { WidgetCard } from './WidgetCard';
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

    const generateDOM = () => {
        const layoutForDOM = layouts.lg || layouts.md || layouts.sm || defaultLayout;
        return (layoutForDOM || []).map((item) => {
            const widgetKey = item.i as WidgetType;
            if (!widgetRegistry[widgetKey]) {
                return <div key={item.i}><WidgetCard title={`Error: Widget '${item.i}' no encontrado`}>Componente no registrado.</WidgetCard></div>;
            }
            const { name, component: WidgetComponent, configComponent, skeleton: SkeletonComponent } = widgetRegistry[widgetKey];

            const widgetProps = configComponent ? { config: widgets[widgetKey] } : {};

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
                        onRemove={() => onRemoveWidget(item.i)}
                        onConfigure={configComponent ? () => onConfigureWidget(item.i as WidgetType) : undefined}
                    >
                        <React.Suspense fallback={<SkeletonComponent />}>
                            <WidgetComponent {...widgetProps} />
                        </React.Suspense>
                    </WidgetCard>
                </motion.div>
            );
        });
    };

    return (
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
            {generateDOM()}
        </ResponsiveGridLayout>
    );
};
