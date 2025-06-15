
import { Layout, Layouts } from 'react-grid-layout';
import { widgetRegistry, WidgetType, Role } from '@/components/dashboard/widgetRegistry';

export const filterLayoutsByRole = (layouts: Layouts | Layout[] | null | undefined, role: Role): Layouts => {
    const roleFilter = (item: Layout) => {
        const widgetConfig = widgetRegistry[item.i as WidgetType];
        if (!widgetConfig) return false;
        // If roles are defined, the current role must be included. If not defined, widget is available for all roles.
        return !widgetConfig.roles || widgetConfig.roles.includes(role);
    };

    if (!layouts) return { lg: [] };

    const layoutsObj: Layouts = Array.isArray(layouts) ? { lg: layouts } : layouts;
    const filteredLayouts: Layouts = {};

    Object.keys(layoutsObj).forEach(breakpoint => {
        const key = breakpoint as keyof Layouts;
        const layoutForBreakpoint = layoutsObj[key];
        if (Array.isArray(layoutForBreakpoint)) {
            filteredLayouts[key] = layoutForBreakpoint.filter(roleFilter);
        }
    });

    if (!filteredLayouts.lg) {
        filteredLayouts.lg = [];
    }
    
    return filteredLayouts;
};
