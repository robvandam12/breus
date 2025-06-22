
import type { Layout, Layouts } from 'react-grid-layout';
import { type Role } from './widgetRegistry';

export const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

// Layout específico para superuser con widgets administrativos
const superuserLayout: Layout[] = [
  // Panel de control del sistema - ancho completo
  { i: 'system-control-panel', x: 0, y: 0, w: 12, h: 6 },
  
  // Segunda fila: Estados y estadísticas
  { i: 'module-status', x: 0, y: 6, w: 6, h: 8 },
  { i: 'global-security-alerts', x: 6, y: 6, w: 6, h: 8 },
  
  // Tercera fila: Uso y gestión
  { i: 'usage-stats', x: 0, y: 14, w: 8, h: 6 },
  { i: 'invitation-management', x: 8, y: 14, w: 4, h: 8 },
  
  // Widgets adicionales opcionales
  { i: 'notifications', x: 8, y: 22, w: 4, h: 6 },
  { i: 'quick-actions', x: 0, y: 20, w: 4, h: 6 },
];

// Layout para admin_salmonera
const adminSalmoneraLayout: Layout[] = [
  { i: 'kpi-cards', x: 0, y: 0, w: 12, h: 4 },
  { i: 'stats-chart', x: 0, y: 4, w: 8, h: 8 },
  { i: 'security-alerts', x: 8, y: 4, w: 4, h: 8 },
  { i: 'upcoming-operations', x: 0, y: 12, w: 6, h: 6 },
  { i: 'team-status', x: 6, y: 12, w: 6, h: 6 },
  { i: 'notifications', x: 8, y: 18, w: 4, h: 6 },
];

// Layout para admin_servicio
const adminServicioLayout: Layout[] = [
  { i: 'kpi-cards', x: 0, y: 0, w: 12, h: 4 },
  { i: 'upcoming-operations', x: 0, y: 4, w: 6, h: 6 },
  { i: 'security-alerts', x: 6, y: 4, w: 6, h: 6 },
  { i: 'equipment-status', x: 0, y: 10, w: 6, h: 6 },
  { i: 'team-status', x: 6, y: 10, w: 6, h: 6 },
  { i: 'notifications', x: 8, y: 16, w: 4, h: 6 },
];

// Layout para supervisor
const supervisorLayout: Layout[] = [
  { i: 'upcoming-operations', x: 0, y: 0, w: 6, h: 6 },
  { i: 'team-status', x: 6, y: 0, w: 6, h: 6 },
  { i: 'weather', x: 0, y: 6, w: 4, h: 4 },
  { i: 'quick-actions', x: 4, y: 6, w: 4, h: 6 },
  { i: 'calendar', x: 8, y: 6, w: 4, h: 8 },
  { i: 'notifications', x: 0, y: 12, w: 4, h: 6 },
];

// Layout para buzo
const buzoLayout: Layout[] = [
  { i: 'buzo-stats', x: 0, y: 0, w: 12, h: 4 },
  { i: 'my-immersions', x: 0, y: 4, w: 6, h: 6 },
  { i: 'upcoming-operations', x: 6, y: 4, w: 6, h: 6 },
  { i: 'weather', x: 0, y: 10, w: 4, h: 4 },
  { i: 'quick-actions', x: 4, y: 10, w: 4, h: 6 },
  { i: 'notifications', x: 8, y: 10, w: 4, h: 6 },
];

// Layout por defecto
const defaultLayout: Layout[] = [
  { i: 'quick-actions', x: 0, y: 0, w: 6, h: 6 },
  { i: 'notifications', x: 6, y: 0, w: 6, h: 6 },
  { i: 'weather', x: 0, y: 6, w: 4, h: 4 },
];

export const getLayoutsForRole = (role: Role): Layouts => {
  let layout: Layout[];
  
  switch (role) {
    case 'superuser':
      layout = superuserLayout;
      break;
    case 'admin_salmonera':
      layout = adminSalmoneraLayout;
      break;
    case 'admin_servicio':
      layout = adminServicioLayout;
      break;
    case 'supervisor':
      layout = supervisorLayout;
      break;
    case 'buzo':
      layout = buzoLayout;
      break;
    default:
      layout = defaultLayout;
  }

  return {
    lg: layout,
    md: layout.map(item => ({ ...item, w: Math.min(item.w, cols.md) })),
    sm: layout.map(item => ({ ...item, w: Math.min(item.w, cols.sm), x: 0 })),
    xs: layout.map(item => ({ ...item, w: cols.xs, x: 0 })),
    xxs: layout.map(item => ({ ...item, w: cols.xxs, x: 0 })),
  };
};

export const getDefaultLayoutForRole = (role: Role): Layout[] => {
  return getLayoutsForRole(role).lg;
};
