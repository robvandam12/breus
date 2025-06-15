
import { Layout, Layouts } from 'react-grid-layout';
import { widgetRegistry, WidgetType, Role } from '@/components/dashboard/widgetRegistry';
import { getLayoutsForRole, preventOverlapping } from '@/components/dashboard/layouts';

export const isValidLayout = (layout: Layout): boolean => {
    return (
        layout &&
        typeof layout.i === 'string' &&
        typeof layout.x === 'number' &&
        typeof layout.y === 'number' &&
        typeof layout.w === 'number' &&
        typeof layout.h === 'number' &&
        layout.w > 0 &&
        layout.h > 0 &&
        layout.x >= 0 &&
        layout.y >= 0
    );
};

export const isValidLayouts = (layouts: Layouts): boolean => {
    if (!layouts || typeof layouts !== 'object') return false;
    
    const breakpoints = Object.keys(layouts);
    if (breakpoints.length === 0) return false;
    
    return breakpoints.every(bp => {
        const layout = layouts[bp];
        return Array.isArray(layout) && layout.every(isValidLayout);
    });
};

export const sanitizeLayouts = (layouts: Layouts | Layout[] | null | undefined, fallbackLayouts: Layouts): Layouts => {
    if (!layouts) return fallbackLayouts;
    
    if (Array.isArray(layouts)) {
        const sanitizedArray = layouts.filter(isValidLayout);
        return sanitizedArray.length > 0 ? { lg: sanitizedArray } : fallbackLayouts;
    }
    
    if (typeof layouts === 'object') {
        const sanitizedLayouts: Layouts = {};
        let hasValidBreakpoint = false;
        
        Object.keys(layouts).forEach(bp => {
            const layout = layouts[bp];
            if (Array.isArray(layout)) {
                const sanitizedLayout = layout.filter(isValidLayout);
                if (sanitizedLayout.length > 0) {
                    sanitizedLayouts[bp] = sanitizedLayout;
                    hasValidBreakpoint = true;
                }
            }
        });
        
        if (!hasValidBreakpoint) return fallbackLayouts;
        
        if (!sanitizedLayouts.lg && sanitizedLayouts.md) {
            sanitizedLayouts.lg = sanitizedLayouts.md;
        } else if (!sanitizedLayouts.lg && fallbackLayouts.lg) {
            sanitizedLayouts.lg = fallbackLayouts.lg;
        }
        
        // Apply overlap prevention
        return preventOverlapping(sanitizedLayouts);
    }
    
    return fallbackLayouts;
};

export const filterLayoutsByRole = (layouts: Layouts | Layout[] | null | undefined, role: Role): Layouts => {
    const fallbackLayouts = getLayoutsForRole(role);
    const sanitizedLayouts = sanitizeLayouts(layouts, fallbackLayouts);
    
    const roleFilter = (item: Layout) => {
        if (!isValidLayout(item)) return false;
        const widgetConfig = widgetRegistry[item.i as WidgetType];
        if (!widgetConfig) return false;
        return !widgetConfig.roles || widgetConfig.roles.includes(role);
    };

    const filteredLayouts: Layouts = {};
    let hasValidItems = false;

    Object.keys(sanitizedLayouts).forEach(breakpoint => {
        const key = breakpoint as keyof Layouts;
        const layoutForBreakpoint = sanitizedLayouts[key];
        if (Array.isArray(layoutForBreakpoint)) {
            const filtered = layoutForBreakpoint.filter(roleFilter);
            if (filtered.length > 0) {
                filteredLayouts[key] = filtered;
                hasValidItems = true;
            }
        }
    });

    if (!hasValidItems) {
        return fallbackLayouts;
    }

    if (!filteredLayouts.lg) {
        filteredLayouts.lg = fallbackLayouts.lg || [];
    }
    
    // Apply overlap prevention to final result
    return preventOverlapping(filteredLayouts);
};

export const validateWidgetExists = (widgetId: string): boolean => {
    return !!widgetRegistry[widgetId as WidgetType];
};

export const cleanupInvalidWidgets = (layouts: Layouts): Layouts => {
    const cleanedLayouts: Layouts = {};
    
    Object.keys(layouts).forEach(bp => {
        const key = bp as keyof Layouts;
        const layout = layouts[key];
        if (Array.isArray(layout)) {
            cleanedLayouts[key] = layout.filter(item => 
                isValidLayout(item) && validateWidgetExists(item.i)
            );
        }
    });
    
    return preventOverlapping(cleanedLayouts);
};

// New utility functions for responsive behavior
export const optimizeLayoutForMobile = (layouts: Layouts): Layouts => {
    const optimized: Layouts = { ...layouts };
    
    // For xs and xxs breakpoints, ensure widgets are stacked vertically
    ['xs', 'xxs'].forEach(bp => {
        const layout = optimized[bp as keyof Layouts];
        if (Array.isArray(layout)) {
            let yOffset = 0;
            optimized[bp as keyof Layouts] = layout.map(item => {
                const optimizedItem = {
                    ...item,
                    x: 0, // Force full width on mobile
                    y: yOffset,
                    w: bp === 'xxs' ? 2 : 4, // Use full available width
                    h: Math.max(item.h, 3), // Minimum height for mobile
                };
                yOffset += optimizedItem.h;
                return optimizedItem;
            });
        }
    });
    
    return optimized;
};

export const ensureMinimumWidgetSize = (layouts: Layouts): Layouts => {
    const ensured: Layouts = {};
    
    Object.keys(layouts).forEach(bp => {
        const layout = layouts[bp as keyof Layouts];
        if (Array.isArray(layout)) {
            ensured[bp as keyof Layouts] = layout.map(item => ({
                ...item,
                w: Math.max(item.w, 1),
                h: Math.max(item.h, item.static ? 2 : 3),
            }));
        }
    });
    
    return ensured;
};
