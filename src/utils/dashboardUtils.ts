
import { Layout, Layouts } from 'react-grid-layout';
import { widgetRegistry, WidgetType, Role } from '@/components/dashboard/widgetRegistry';
import { getLayoutsForRole } from '@/components/dashboard/layouts';

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
    
    // Verificar que al menos tenga un breakpoint válido
    const breakpoints = Object.keys(layouts);
    if (breakpoints.length === 0) return false;
    
    // Verificar que cada breakpoint tenga un array válido
    return breakpoints.every(bp => {
        const layout = layouts[bp];
        return Array.isArray(layout) && layout.every(isValidLayout);
    });
};

export const sanitizeLayouts = (layouts: Layouts | Layout[] | null | undefined, fallbackLayouts: Layouts): Layouts => {
    // Si layouts es null/undefined, usar fallback
    if (!layouts) return fallbackLayouts;
    
    // Si es un array, convertir a formato Layouts
    if (Array.isArray(layouts)) {
        const sanitizedArray = layouts.filter(isValidLayout);
        return sanitizedArray.length > 0 ? { lg: sanitizedArray } : fallbackLayouts;
    }
    
    // Si es un objeto Layouts, validar y sanitizar
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
        
        // Si no hay breakpoints válidos, usar fallback
        if (!hasValidBreakpoint) return fallbackLayouts;
        
        // Asegurar que al menos 'lg' existe
        if (!sanitizedLayouts.lg && sanitizedLayouts.md) {
            sanitizedLayouts.lg = sanitizedLayouts.md;
        } else if (!sanitizedLayouts.lg && fallbackLayouts.lg) {
            sanitizedLayouts.lg = fallbackLayouts.lg;
        }
        
        return sanitizedLayouts;
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
        // Si roles están definidos, el rol actual debe estar incluido. Si no están definidos, widget disponible para todos.
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

    // Si no hay elementos válidos después del filtrado, usar layouts por defecto para el rol
    if (!hasValidItems) {
        return fallbackLayouts;
    }

    // Asegurar que lg existe
    if (!filteredLayouts.lg) {
        filteredLayouts.lg = fallbackLayouts.lg || [];
    }
    
    return filteredLayouts;
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
    
    return cleanedLayouts;
};
