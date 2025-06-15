import { Layouts } from 'react-grid-layout';
import { widgetRegistry, WidgetType, Role } from './widgetRegistry';

export interface SystemDashboardTemplate {
  name: string;
  description: string;
  layout_config: Layouts;
  widget_configs: any;
  type: 'system';
  role_target: Role;
}

const createLayoutItem = (widgetId: WidgetType, x: number, y: number, overrides: { w?: number, h?: number } = {}) => {
  const config = widgetRegistry[widgetId];
  if (!config) {
    console.warn(`Widget configuration for "${widgetId}" not found. Using default layout values.`);
    return { i: widgetId, x, y, w: 1, h: 1, static: false };
  }
  return {
    i: widgetId,
    x,
    y,
    w: overrides.w ?? config.defaultLayout.w,
    h: overrides.h ?? config.defaultLayout.h,
    static: !!config.defaultLayout.static,
  };
};

// Template for 'buzo'
const buzoTemplateLayout = {
  lg: [
    createLayoutItem('buzo-stats', 0, 0, { w: 12, h: 4 }),
    createLayoutItem('my-immersions', 0, 4, { w: 8, h: 8 }),
    createLayoutItem('quick-actions', 8, 4, { w: 4, h: 4 }),
    createLayoutItem('weather', 8, 8, { w: 4, h: 4 }),
    createLayoutItem('notifications', 0, 12, { w: 12, h: 6 }),
  ],
};

// Template for 'supervisor'
const supervisorTemplateLayout = {
    lg: [
        createLayoutItem('kpi-cards', 0, 0, { w: 12, h: 4 }),
        createLayoutItem('team-status', 0, 4, { w: 6, h: 6 }),
        createLayoutItem('upcoming-operations', 6, 4, { w: 6, h: 6 }),
        createLayoutItem('alerts-panel', 0, 10, { w: 8, h: 8 }),
        createLayoutItem('equipment-status', 8, 10, { w: 4, h: 8 }),
        createLayoutItem('stats-chart', 0, 18, { w: 12, h: 8 }),
    ]
};

// Template for 'admin_servicio', 'admin_empresa', 'superuser'
const adminTemplateLayout = {
    lg: [
        createLayoutItem('global-metrics', 0, 0, { w: 12, h: 6 }),
        createLayoutItem('kpi-cards', 0, 6, { w: 12, h: 4 }),
        createLayoutItem('stats-chart', 0, 10, { w: 8, h: 8 }),
        createLayoutItem('security-alerts', 8, 10, { w: 4, h: 8 }),
        createLayoutItem('alerts-panel', 0, 18, { w: 12, h: 8 }),
    ]
};

export const systemTemplates: SystemDashboardTemplate[] = [
  {
    name: "Panel del Buzo",
    description: "Una vista centrada en tus inmersiones, métricas personales y acciones rápidas.",
    layout_config: buzoTemplateLayout,
    widget_configs: {},
    type: 'system',
    role_target: 'buzo'
  },
  {
    name: "Centro de Mando del Supervisor",
    description: "Monitorea tu equipo, las próximas operaciones y el estado de los equipos.",
    layout_config: supervisorTemplateLayout,
    widget_configs: {},
    type: 'system',
    role_target: 'supervisor'
  },
  {
    name: "Vista de Administración de Empresa",
    description: "Métricas clave, alertas y estado general de las operaciones de la empresa.",
    layout_config: adminTemplateLayout,
    widget_configs: {},
    type: 'system',
    role_target: 'admin_empresa'
  },
  {
    name: "Vista de Administración de Salmonera",
    description: "Métricas clave, alertas y estado general de las operaciones de la salmonera.",
    layout_config: adminTemplateLayout,
    widget_configs: {},
    type: 'system',
    role_target: 'admin_salmonera'
  },
  {
    name: "Monitor Global del Servicio",
    description: "Una vista de alto nivel con métricas globales, seguridad y rendimiento del sistema.",
    layout_config: adminTemplateLayout,
    widget_configs: {},
    type: 'system',
    role_target: 'admin_servicio'
  },
   {
    name: "Panel de Superusuario",
    description: "Acceso a todos los widgets y métricas para una supervisión completa.",
    layout_config: adminTemplateLayout,
    widget_configs: {},
    type: 'system',
    role_target: 'superuser'
  },
];
