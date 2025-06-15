
import type { Layout, Layouts } from 'react-grid-layout';

export const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
export const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

// Utility function to ensure minimum spacing between widgets
const ensureMinSpacing = (layouts: Layout[]): Layout[] => {
    return layouts.map((layout, index) => {
        // Ensure minimum height for readability
        const minHeight = layout.static ? 2 : 3;
        return {
            ...layout,
            h: Math.max(layout.h, minHeight),
            // Ensure no negative positions
            x: Math.max(0, layout.x),
            y: Math.max(0, layout.y),
        };
    });
};

// Improved responsive positioning utility
const createResponsiveLayout = (baseLayout: Layout[], targetCols: number): Layout[] => {
    const scaleFactor = targetCols / 12;
    let currentY = 0;
    
    return baseLayout.map(item => {
        const scaledWidth = Math.max(1, Math.floor(item.w * scaleFactor));
        const adjustedWidth = Math.min(scaledWidth, targetCols);
        
        // Stack widgets vertically on smaller screens to prevent overlap
        const layout = {
            ...item,
            x: targetCols <= 4 ? 0 : Math.min(item.x * scaleFactor, targetCols - adjustedWidth),
            y: targetCols <= 4 ? currentY : item.y,
            w: adjustedWidth,
            h: item.h + (targetCols <= 4 ? 1 : 0), // Extra height on mobile for better readability
        };
        
        if (targetCols <= 4) {
            currentY += layout.h;
        }
        
        return layout;
    });
};

const baseLayouts: Layouts = {
    lg: ensureMinSpacing([
        { i: 'kpi_cards', x: 0, y: 0, w: 12, h: 2, static: true },
        { i: 'stats_chart', x: 0, y: 2, w: 12, h: 6 },
        { i: 'upcoming_operations', x: 0, y: 8, w: 5, h: 7 },
        { i: 'quick_actions', x: 5, y: 8, w: 3, h: 7 },
        { i: 'alerts_panel', x: 8, y: 8, w: 4, h: 7 },
    ]),
    md: [],
    sm: [],
    xs: [],
    xxs: []
};

const buzoLayouts: Layouts = {
    lg: ensureMinSpacing([
        { i: 'my_immersions', x: 0, y: 0, w: 12, h: 8, isResizable: false },
        { i: 'kpi_cards', x: 0, y: 8, w: 12, h: 2, static: true },
        { i: 'quick_actions', x: 0, y: 10, w: 4, h: 6 },
        { i: 'alerts_panel', x: 4, y: 10, w: 8, h: 6 },
    ]),
    md: [],
    sm: [],
    xs: [],
    xxs: []
};

const supervisorLayouts: Layouts = {
    lg: ensureMinSpacing([
        { i: 'kpi_cards', x: 0, y: 0, w: 12, h: 2, static: true },
        { i: 'team_status', x: 0, y: 2, w: 6, h: 8 },
        { i: 'upcoming_operations', x: 6, y: 2, w: 6, h: 8 },
        { i: 'equipment_status', x: 0, y: 10, w: 6, h: 7 },
        { i: 'alerts_panel', x: 6, y: 10, w: 6, h: 7 },
        { i: 'stats_chart', x: 0, y: 17, w: 12, h: 6 },
        { i: 'weather', x: 0, y: 23, w: 6, h: 6 },
        { i: 'quick_actions', x: 6, y: 23, w: 6, h: 6 },
    ]),
    md: [],
    sm: [],
    xs: [],
    xxs: []
};

const adminLayouts: Layouts = {
    lg: ensureMinSpacing([
        { i: 'kpi_cards', x: 0, y: 0, w: 12, h: 2, static: true },
        { i: 'stats_chart', x: 0, y: 2, w: 12, h: 6 },
        { i: 'global_metrics', x: 0, y: 8, w: 6, h: 7 },
        { i: 'alerts_panel', x: 6, y: 8, w: 6, h: 7 },
        { i: 'equipment_status', x: 0, y: 15, w: 6, h: 6 },
        { i: 'upcoming_operations', x: 6, y: 15, w: 6, h: 6 },
        { i: 'quick_actions', x: 0, y: 21, w: 12, h: 4 },
    ]),
    md: [],
    sm: [],
    xs: [],
    xxs: []
};

// Auto-generate responsive layouts
const generateResponsiveLayouts = (baseLayoutConfig: Layouts): Layouts => {
    const baseLg = baseLayoutConfig.lg || [];
    
    return {
        lg: baseLg,
        md: createResponsiveLayout(baseLg, cols.md),
        sm: createResponsiveLayout(baseLg, cols.sm),
        xs: createResponsiveLayout(baseLg, cols.xs),
        xxs: createResponsiveLayout(baseLg, cols.xxs),
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

// Utility to prevent widget overlapping
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
        
        // Adjust positions to prevent overlap
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
