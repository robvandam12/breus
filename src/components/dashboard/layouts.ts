
import type { Layout, Layouts } from 'react-grid-layout';

export const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
export const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

// Utility function to ensure optimal spacing for different screen sizes
const ensureOptimalSpacing = (layouts: Layout[], breakpoint: string): Layout[] => {
    return layouts.map((layout, index) => {
        // More compact heights for better space utilization
        const minHeight = layout.static ? 1 : 2;
        
        // Adjust dimensions based on breakpoint for better responsive behavior
        let adjustedLayout = {
            ...layout,
            h: Math.max(layout.h, minHeight),
            x: Math.max(0, layout.x),
            y: Math.max(0, layout.y),
        };

        // Special adjustments for mobile devices
        if (breakpoint === 'xs' || breakpoint === 'xxs') {
            adjustedLayout = {
                ...adjustedLayout,
                h: Math.max(adjustedLayout.h - 1, 1), // Reduce height on mobile
            };
        }

        return adjustedLayout;
    });
};

// Improved responsive positioning with better space utilization
const createResponsiveLayout = (baseLayout: Layout[], targetCols: number, breakpoint: string): Layout[] => {
    if (!Array.isArray(baseLayout)) return [];
    
    const scaleFactor = targetCols / 12;
    let currentY = 0;
    
    return baseLayout.map(item => {
        const scaledWidth = Math.max(1, Math.floor(item.w * scaleFactor));
        const adjustedWidth = Math.min(scaledWidth, targetCols);
        
        // Better mobile layout: stack widgets more efficiently
        let layout: Layout;
        
        if (targetCols <= 4) {
            // Mobile: full width, stacked vertically with minimal spacing
            layout = {
                ...item,
                x: 0,
                y: currentY,
                w: targetCols,
                h: breakpoint === 'xxs' ? Math.max(item.h - 2, 1) : Math.max(item.h - 1, 1),
            };
            currentY += layout.h;
        } else if (targetCols <= 6) {
            // Tablet: 2 columns when possible, better space utilization
            const canFitTwoColumns = adjustedWidth <= 3;
            layout = {
                ...item,
                x: canFitTwoColumns ? (index % 2) * 3 : 0,
                y: canFitTwoColumns ? Math.floor(index / 2) * item.h : currentY,
                w: canFitTwoColumns ? 3 : 6,
                h: item.h,
            };
            if (!canFitTwoColumns) currentY += layout.h;
        } else {
            // Desktop: preserve original layout but optimized
            layout = {
                ...item,
                x: Math.min(item.x * scaleFactor, targetCols - adjustedWidth),
                y: item.y,
                w: adjustedWidth,
                h: item.h,
            };
        }
        
        return layout;
    });
};

// More compact base layouts
const baseLayouts: Layouts = {
    lg: ensureOptimalSpacing([
        { i: 'kpi_cards', x: 0, y: 0, w: 12, h: 2, static: true },
        { i: 'stats_chart', x: 0, y: 2, w: 8, h: 4 },
        { i: 'quick_actions', x: 8, y: 2, w: 4, h: 4 },
        { i: 'upcoming_operations', x: 0, y: 6, w: 6, h: 5 },
        { i: 'alerts_panel', x: 6, y: 6, w: 6, h: 5 },
    ], 'lg'),
    md: [],
    sm: [],
    xs: [],
    xxs: []
};

const buzoLayouts: Layouts = {
    lg: ensureOptimalSpacing([
        { i: 'kpi_cards', x: 0, y: 0, w: 12, h: 2, static: true },
        { i: 'my_immersions', x: 0, y: 2, w: 8, h: 6 },
        { i: 'quick_actions', x: 8, y: 2, w: 4, h: 3 },
        { i: 'alerts_panel', x: 8, y: 5, w: 4, h: 3 },
    ], 'lg'),
    md: [],
    sm: [],
    xs: [],
    xxs: []
};

const supervisorLayouts: Layouts = {
    lg: ensureOptimalSpacing([
        { i: 'kpi_cards', x: 0, y: 0, w: 12, h: 2, static: true },
        { i: 'team_status', x: 0, y: 2, w: 6, h: 5 },
        { i: 'upcoming_operations', x: 6, y: 2, w: 6, h: 5 },
        { i: 'stats_chart', x: 0, y: 7, w: 8, h: 4 },
        { i: 'equipment_status', x: 8, y: 7, w: 4, h: 4 },
        { i: 'alerts_panel', x: 0, y: 11, w: 6, h: 4 },
        { i: 'weather', x: 6, y: 11, w: 3, h: 4 },
        { i: 'quick_actions', x: 9, y: 11, w: 3, h: 4 },
    ], 'lg'),
    md: [],
    sm: [],
    xs: [],
    xxs: []
};

const adminLayouts: Layouts = {
    lg: ensureOptimalSpacing([
        { i: 'kpi_cards', x: 0, y: 0, w: 12, h: 2, static: true },
        { i: 'stats_chart', x: 0, y: 2, w: 8, h: 4 },
        { i: 'global_metrics', x: 8, y: 2, w: 4, h: 4 },
        { i: 'alerts_panel', x: 0, y: 6, w: 6, h: 4 },
        { i: 'equipment_status', x: 6, y: 6, w: 6, h: 4 },
        { i: 'upcoming_operations', x: 0, y: 10, w: 8, h: 4 },
        { i: 'quick_actions', x: 8, y: 10, w: 4, h: 4 },
    ], 'lg'),
    md: [],
    sm: [],
    xs: [],
    xxs: []
};

// Generate responsive layouts with improved mobile experience
const generateResponsiveLayouts = (baseLayoutConfig: Layouts): Layouts => {
    const baseLg = baseLayoutConfig.lg || [];
    
    return {
        lg: baseLg,
        md: createResponsiveLayout(baseLg, cols.md, 'md'),
        sm: createResponsiveLayout(baseLg, cols.sm, 'sm'),
        xs: createResponsiveLayout(baseLg, cols.xs, 'xs'),
        xxs: createResponsiveLayout(baseLg, cols.xxs, 'xxs'),
    };
};

// Generate all responsive layouts
const completeBaseLayouts = generateResponsiveLayouts(baseLayouts);
const completeBuzoLayouts = generateResponsiveLayouts(buzoLayouts);
const completeSupervisorLayouts = generateResponsiveLayouts(supervisorLayouts);
const completeAdminLayouts = generateResponsiveLayouts(adminLayouts);

export const getLayoutsForRole = (role: string): Layouts => {
    switch (role) {
        case 'buzo':
            return completeBuzoLayouts;
        case 'supervisor':
            return completeSupervisorLayouts;
        case 'admin_salmonera':
        case 'admin_servicio':
        case 'superuser':
            return completeAdminLayouts;
        default:
            return completeBaseLayouts;
    }
};

// Enhanced utility to prevent widget overlapping with better spacing
export const preventOverlapping = (layouts: Layouts): Layouts => {
    const processedLayouts: Layouts = {};
    
    Object.keys(layouts).forEach(breakpoint => {
        const layout = layouts[breakpoint as keyof Layouts];
        if (!Array.isArray(layout)) return;
        
        const processed = [...layout];
        
        // Sort by y position, then x position
        processed.sort((a, b) => {
            if (a.y !== b.y) return a.y - b.y;
            return a.x - b.x;
        });
        
        // Adjust positions to prevent overlap with minimal spacing
        for (let i = 1; i < processed.length; i++) {
            const current = processed[i];
            const previous = processed[i - 1];
            
            // Check if current overlaps with previous
            if (current.y < previous.y + previous.h) {
                current.y = previous.y + previous.h;
            }
        }
        
        processedLayouts[breakpoint as keyof Layouts] = processed;
    });
    
    return processedLayouts;
};
