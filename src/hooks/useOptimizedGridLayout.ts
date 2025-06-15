
import { useCallback, useMemo } from 'react';
import { Layout, Layouts } from 'react-grid-layout';

export const useOptimizedGridLayout = (layouts: Layouts, onLayoutChange: (layout: Layout[], layouts: Layouts) => void) => {
  
  // Memoize layout to prevent unnecessary re-renders
  const memoizedLayouts = useMemo(() => {
    return JSON.parse(JSON.stringify(layouts));
  }, [JSON.stringify(layouts)]);

  // Debounced layout change handler
  const optimizedOnLayoutChange = useCallback((newLayout: Layout[], newLayouts: Layouts) => {
    // Only trigger if there's a meaningful change
    const hasChanges = JSON.stringify(newLayouts) !== JSON.stringify(layouts);
    if (hasChanges) {
      onLayoutChange(newLayout, newLayouts);
    }
  }, [layouts, onLayoutChange]);

  // Generate stable keys for grid items
  const generateStableKey = useCallback((item: Layout) => {
    return `${item.i}-${item.x}-${item.y}-${item.w}-${item.h}`;
  }, []);

  return {
    optimizedLayouts: memoizedLayouts,
    optimizedOnLayoutChange,
    generateStableKey
  };
};
