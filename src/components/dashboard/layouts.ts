
import type { Layout } from 'react-grid-layout';

export const baseLayout: Layout[] = [
  { i: 'kpi_cards', x: 0, y: 0, w: 12, h: 2, static: true },
  { i: 'stats_chart', x: 0, y: 2, w: 12, h: 5 },
  { i: 'upcoming_operations', x: 0, y: 7, w: 5, h: 6 },
  { i: 'quick_actions', x: 5, y: 7, w: 3, h: 6 },
  { i: 'alerts_panel', x: 8, y: 7, w: 4, h: 6 },
];

export const buzoLayout: Layout[] = [
    { i: 'my_immersions', x: 0, y: 0, w: 12, h: 7, isResizable: false },
    { i: 'kpi_cards', x: 0, y: 7, w: 12, h: 2, static: true },
    { i: 'quick_actions', x: 0, y: 9, w: 4, h: 6 },
    { i: 'alerts_panel', x: 4, y: 9, w: 8, h: 6 },
];

export const supervisorLayout: Layout[] = [
    { i: 'kpi_cards', x: 0, y: 0, w: 12, h: 2, static: true },
    { i: 'team_status', x: 0, y: 2, w: 6, h: 7 },
    { i: 'upcoming_operations', x: 6, y: 2, w: 6, h: 7 },
    { i: 'equipment_status', x: 0, y: 9, w: 6, h: 7 },
    { i: 'alerts_panel', x: 6, y: 9, w: 6, h: 7 },
    { i: 'stats_chart', x: 0, y: 16, w: 12, h: 5 },
    { i: 'weather', x: 0, y: 21, w: 6, h: 6 },
    { i: 'quick_actions', x: 6, y: 21, w: 6, h: 6 },
];

export const adminLayout: Layout[] = [
    { i: 'kpi_cards', x: 0, y: 0, w: 12, h: 2, static: true },
    { i: 'stats_chart', x: 0, y: 2, w: 12, h: 5 },
    { i: 'global_metrics', x: 0, y: 7, w: 6, h: 6 },
    { i: 'alerts_panel', x: 6, y: 7, w: 6, h: 6 },
    { i: 'equipment_status', x: 0, y: 13, w: 6, h: 6 },
    { i: 'upcoming_operations', x: 6, y: 13, w: 6, h: 6 },
    { i: 'quick_actions', x: 0, y: 19, w: 12, h: 4 },
];

export const getLayoutForRole = (role: string): Layout[] => {
    switch (role) {
        case 'buzo':
            return buzoLayout;
        case 'supervisor':
            return supervisorLayout;
        case 'admin_salmonera':
        case 'admin_servicio':
        case 'superuser':
            return adminLayout;
        default:
            return baseLayout;
    }
};

export const breakpoints = { lg: 1200, md: 834, sm: 640, xs: 480, xxs: 0 };
export const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };
