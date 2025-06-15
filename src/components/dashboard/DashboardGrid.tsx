
import React, { useMemo } from 'react';
import { Responsive, WidthProvider, Layout, Layouts } from 'react-grid-layout';
import { widgetRegistry } from './widgetRegistry';
import { WidgetCard } from './WidgetCard';
import { LazyWidget } from './LazyWidget';
import { breakpoints, cols } from './layouts';
import { GenericWidgetSkeleton } from './widgets/skeletons/GenericWidgetSkeleton';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  layouts: Layouts;
  widgets: Record<string, any>;
  isEditMode: boolean;
  onLayoutChange: (layout: Layout[], layouts: Layouts) => void;
  onRemoveWidget?: (widgetId: string) => void;
  onConfigureWidget?: (widgetId: string) => void;
}

export const DashboardGrid = ({
  layouts,
  widgets,
  isEditMode,
  onLayoutChange,
  onRemoveWidget,
  onConfigureWidget,
}: DashboardGridProps) => {
  const gridItems = useMemo(() => {
    const lgLayout = layouts?.lg || [];
    
    return lgLayout.map((item) => {
      const widgetConfig = widgetRegistry[item.i];
      if (!widgetConfig) return null;

      const WidgetComponent = widgetConfig.component;
      const widgetProps = widgets[item.i] || {};

      return (
        <div key={item.i} className="dashboard-widget">
          <WidgetCard
            title={widgetConfig.title}
            isDraggable={isEditMode}
            onRemove={onRemoveWidget ? () => onRemoveWidget(item.i) : undefined}
            onConfigure={onConfigureWidget ? () => onConfigureWidget(item.i) : undefined}
            isStatic={item.static}
          >
            <LazyWidget
              skeleton={<GenericWidgetSkeleton />}
              isHeavy={false}
              priority="normal"
            >
              <WidgetComponent {...widgetProps} />
            </LazyWidget>
          </WidgetCard>
        </div>
      );
    }).filter(Boolean);
  }, [layouts, widgets, isEditMode, onRemoveWidget, onConfigureWidget]);

  const gridProps = useMemo(() => ({
    className: "layout",
    layouts,
    breakpoints,
    cols,
    rowHeight: 50,
    isDraggable: isEditMode,
    isResizable: isEditMode,
    onLayoutChange,
    margin: [4, 4] as [number, number],
    containerPadding: [4, 4] as [number, number],
    useCSSTransforms: true,
    preventCollision: false,
    compactType: 'vertical' as const,
    draggableHandle: '.drag-handle',
  }), [layouts, isEditMode, onLayoutChange]);

  return (
    <div className="dashboard-grid-container">
      <ResponsiveGridLayout {...gridProps}>
        {gridItems}
      </ResponsiveGridLayout>
    </div>
  );
};
