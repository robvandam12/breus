
import type { Layout, Layouts } from 'react-grid-layout';

export const breakpoints = { lg: 1200, md: 834, sm: 640, xs: 480, xxs: 0 };
export const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

const baseLayouts: Layouts = {
    lg: [
        { i: 'kpi_cards', x: 0, y: 0, w: 12, h: 2, static: true },
        { i: 'stats_chart', x: 0, y: 2, w: 12, h: 5 },
        { i: 'upcoming_operations', x: 0, y: 7, w: 5, h: 6 },
        { i: 'quick_actions', x: 5, y: 7, w: 3, h: 6 },
        { i: 'alerts_panel', x: 8, y: 7, w: 4, h: 6 },
    ],
    md: [
        { i: 'kpi_cards', x: 0, y: 0, w: 10, h: 2, static: true },
        { i: 'stats_chart', x: 0, y: 2, w: 10, h: 5 },
        { i: 'upcoming_operations', x: 0, y: 7, w: 5, h: 6 },
        { i: 'quick_actions', x: 5, y: 7, w: 5, h: 6 },
        { i: 'alerts_panel', x: 0, y: 13, w: 10, h: 6 },
    ],
    sm: [
        { i: 'kpi_cards', x: 0, y: 0, w: 6, h: 4, static: true },
        { i: 'stats_chart', x: 0, y: 4, w: 6, h: 5 },
        { i: 'upcoming_operations', x: 0, y: 9, w: 6, h: 6 },
        { i: 'quick_actions', x: 0, y: 15, w: 6, h: 6 },
        { i: 'alerts_panel', x: 0, y: 21, w: 6, h: 6 },
    ],
    xs: [
        { i: 'kpi_cards', x: 0, y: 0, w: 4, h: 4, static: true },
        { i: 'stats_chart', x: 0, y: 4, w: 4, h: 5 },
        { i: 'upcoming_operations', x: 0, y: 9, w: 4, h: 6 },
        { i: 'quick_actions', x: 0, y: 15, w: 4, h: 6 },
        { i: 'alerts_panel', x: 0, y: 21, w: 4, h: 6 },
    ]
};

const buzoLayouts: Layouts = {
    lg: [
        { i: 'my_immersions', x: 0, y: 0, w: 12, h: 7, isResizable: false },
        { i: 'kpi_cards', x: 0, y: 7, w: 12, h: 2, static: true },
        { i: 'quick_actions', x: 0, y: 9, w: 4, h: 6 },
        { i: 'alerts_panel', x: 4, y: 9, w: 8, h: 6 },
    ],
    md: [
        { i: 'my_immersions', x: 0, y: 0, w: 10, h: 7, isResizable: false },
        { i: 'kpi_cards', x: 0, y: 7, w: 10, h: 2, static: true },
        { i: 'quick_actions', x: 0, y: 9, w: 5, h: 6 },
        { i: 'alerts_panel', x: 5, y: 9, w: 5, h: 6 },
    ],
    sm: [
        { i: 'my_immersions', x: 0, y: 0, w: 6, h: 7, isResizable: false },
        { i: 'kpi_cards', x: 0, y: 7, w: 6, h: 4, static: true },
        { i: 'quick_actions', x: 0, y: 11, w: 6, h: 6 },
        { i: 'alerts_panel', x: 0, y: 17, w: 6, h: 6 },
    ],
    xs: [
        { i: 'my_immersions', x: 0, y: 0, w: 4, h: 8, isResizable: false },
        { i: 'kpi_cards', x: 0, y: 8, w: 4, h: 4, static: true },
        { i: 'quick_actions', x: 0, y: 12, w: 4, h: 6 },
        { i: 'alerts_panel', x: 0, y: 18, w: 4, h: 6 },
    ],
};

const supervisorLayouts: Layouts = {
    lg: [
        { i: 'kpi_cards', x: 0, y: 0, w: 12, h: 2, static: true },
        { i: 'team_status', x: 0, y: 2, w: 6, h: 7 },
        { i: 'upcoming_operations', x: 6, y: 2, w: 6, h: 7 },
        { i: 'equipment_status', x: 0, y: 9, w: 6, h: 7 },
        { i: 'alerts_panel', x: 6, y: 9, w: 6, h: 7 },
        { i: 'stats_chart', x: 0, y: 16, w: 12, h: 5 },
        { i: 'weather', x: 0, y: 21, w: 6, h: 6 },
        { i: 'quick_actions', x: 6, y: 21, w: 6, h: 6 },
    ],
    md: [
        { i: 'kpi_cards', x: 0, y: 0, w: 10, h: 2, static: true },
        { i: 'team_status', x: 0, y: 2, w: 5, h: 7 },
        { i: 'upcoming_operations', x: 5, y: 2, w: 5, h: 7 },
        { i: 'equipment_status', x: 0, y: 9, w: 5, h: 7 },
        { i: 'alerts_panel', x: 5, y: 9, w: 5, h: 7 },
        { i: 'stats_chart', x: 0, y: 16, w: 10, h: 5 },
        { i: 'weather', x: 0, y: 21, w: 5, h: 6 },
        { i: 'quick_actions', x: 5, y: 21, w: 5, h: 6 },
    ],
    sm: [
        { i: 'kpi_cards', x: 0, y: 0, w: 6, h: 4, static: true },
        { i: 'team_status', x: 0, y: 4, w: 6, h: 7 },
        { i: 'upcoming_operations', x: 0, y: 11, w: 6, h: 7 },
        { i: 'equipment_status', x: 0, y: 18, w: 6, h: 7 },
        { i: 'alerts_panel', x: 0, y: 25, w: 6, h: 7 },
        { i: 'stats_chart', x: 0, y: 32, w: 6, h: 5 },
        { i: 'weather', x: 0, y: 37, w: 6, h: 6 },
        { i: 'quick_actions', x: 0, y: 43, w: 6, h: 6 },
    ],
    xs: [
        { i: 'kpi_cards', x: 0, y: 0, w: 4, h: 4, static: true },
        { i: 'team_status', x: 0, y: 4, w: 4, h: 7 },
        { i: 'upcoming_operations', x: 0, y: 11, w: 4, h: 7 },
        { i: 'equipment_status', x: 0, y: 18, w: 4, h: 7 },
        { i: 'alerts_panel', x: 0, y: 25, w: 4, h: 7 },
        { i: 'stats_chart', x: 0, y: 32, w: 4, h: 5 },
        { i: 'weather', x: 0, y: 37, w: 4, h: 6 },
        { i: 'quick_actions', x: 0, y: 43, w: 4, h: 6 },
    ],
};

const adminLayouts: Layouts = {
    lg: [
        { i: 'kpi_cards', x: 0, y: 0, w: 12, h: 2, static: true },
        { i: 'stats_chart', x: 0, y: 2, w: 12, h: 5 },
        { i: 'global_metrics', x: 0, y: 7, w: 6, h: 6 },
        { i: 'alerts_panel', x: 6, y: 7, w: 6, h: 6 },
        { i: 'equipment_status', x: 0, y: 13, w: 6, h: 6 },
        { i: 'upcoming_operations', x: 6, y: 13, w: 6, h: 6 },
        { i: 'quick_actions', x: 0, y: 19, w: 12, h: 4 },
    ],
    md: [
        { i: 'kpi_cards', x: 0, y: 0, w: 10, h: 2, static: true },
        { i: 'stats_chart', x: 0, y: 2, w: 10, h: 5 },
        { i: 'global_metrics', x: 0, y: 7, w: 5, h: 6 },
        { i: 'alerts_panel', x: 5, y: 7, w: 5, h: 6 },
        { i: 'equipment_status', x: 0, y: 13, w: 5, h: 6 },
        { i: 'upcoming_operations', x: 5, y: 13, w: 5, h: 6 },
        { i: 'quick_actions', x: 0, y: 19, w: 10, h: 4 },
    ],
    sm: [
        { i: 'kpi_cards', x: 0, y: 0, w: 6, h: 4, static: true },
        { i: 'stats_chart', x: 0, y: 4, w: 6, h: 5 },
        { i: 'global_metrics', x: 0, y: 9, w: 6, h: 6 },
        { i: 'alerts_panel', x: 0, y: 15, w: 6, h: 6 },
        { i: 'equipment_status', x: 0, y: 21, w: 6, h: 6 },
        { i: 'upcoming_operations', x: 0, y: 27, w: 6, h: 6 },
        { i: 'quick_actions', x: 0, y: 33, w: 6, h: 4 },
    ],
    xs: [
        { i: 'kpi_cards', x: 0, y: 0, w: 4, h: 4, static: true },
        { i: 'stats_chart', x: 0, y: 4, w: 4, h: 5 },
        { i: 'global_metrics', x: 0, y: 9, w: 4, h: 6 },
        { i: 'alerts_panel', x: 0, y: 15, w: 4, h: 6 },
        { i: 'equipment_status', x: 0, y: 21, w: 4, h: 6 },
        { i: 'upcoming_operations', x: 0, y: 27, w: 4, h: 6 },
        { i: 'quick_actions', x: 0, y: 33, w: 4, h: 4 },
    ],
};

export const getLayoutsForRole = (role: string): Layouts => {
    switch (role) {
        case 'buzo':
            return buzoLayouts;
        case 'supervisor':
            return supervisorLayouts;
        case 'admin_salmonera':
        case 'admin_servicio':
        case 'superuser':
            return adminLayouts;
        default:
            return baseLayouts;
    }
};

