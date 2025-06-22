
import React from 'react';

// Widget Components (Lazy Loaded)
const KpiCardsWidget = React.lazy(() => import('./widgets/KpiCardsWidget'));
const StatsChartWidget = React.lazy(() => import('./widgets/StatsChartWidget'));
const UpcomingOperationsWidget = React.lazy(() => import('./widgets/UpcomingOperationsWidget'));
const MyImmersionsWidget = React.lazy(() => import('./widgets/MyImmersionsWidget'));
const QuickActionsWidget = React.lazy(() => import('./widgets/QuickActionsWidget'));
const SecurityAlertsWidget = React.lazy(() => import('./widgets/SecurityAlertsWidget'));
const TeamStatusWidget = React.lazy(() => import('./widgets/TeamStatusWidget'));
const WeatherWidget = React.lazy(() => import('./widgets/WeatherWidget'));
const CalendarWidget = React.lazy(() => import('./widgets/CalendarWidget'));
const EquipmentStatusWidget = React.lazy(() => import('./widgets/EquipmentStatusWidget'));
const GlobalMetricsWidget = React.lazy(() => import('./widgets/GlobalMetricsWidget'));
const AlertsPanelWidget = React.lazy(() => import('./widgets/AlertsPanelWidget'));
const NotificationWidget = React.lazy(() => import('./widgets/NotificationWidget'));
const BuzoStatsWidget = React.lazy(() => import('./widgets/BuzoStatsWidget'));

// Nuevos widgets para superuser
const SystemControlPanelWidget = React.lazy(() => import('./widgets/SystemControlPanelWidget'));
const ModuleStatusWidget = React.lazy(() => import('./widgets/ModuleStatusWidget'));
const GlobalSecurityAlertsWidget = React.lazy(() => import('./widgets/GlobalSecurityAlertsWidget'));
const UsageStatsWidget = React.lazy(() => import('./widgets/UsageStatsWidget'));
const InvitationManagementWidget = React.lazy(() => import('./widgets/InvitationManagementWidget'));

// Widget Config Components
const TeamStatusWidgetConfig = React.lazy(() => import('./widgets/configs/TeamStatusWidgetConfig'));
const AlertsPanelWidgetConfig = React.lazy(() => import('./widgets/configs/AlertsPanelWidgetConfig'));

// Widget Skeletons
import { KpiCardsWidgetSkeleton } from './widgets/skeletons/KpiCardsWidgetSkeleton';
import { StatsChartWidgetSkeleton } from './widgets/skeletons/StatsChartWidgetSkeleton';
import { UpcomingOperationsWidgetSkeleton } from './widgets/skeletons/UpcomingOperationsWidgetSkeleton';
import { MyImmersionsWidgetSkeleton } from './widgets/skeletons/MyImmersionsWidgetSkeleton';
import { GenericWidgetSkeleton } from './widgets/skeletons/GenericWidgetSkeleton';
import { SecurityAlertsWidgetSkeleton } from './widgets/skeletons/SecurityAlertsWidgetSkeleton';
import { WeatherWidgetSkeleton } from './widgets/skeletons/WeatherWidgetSkeleton';
import { CalendarWidgetSkeleton } from './widgets/skeletons/CalendarWidgetSkeleton';
import { EquipmentStatusWidgetSkeleton } from './widgets/skeletons/EquipmentStatusWidgetSkeleton';
import { NotificationWidgetSkeleton } from './widgets/skeletons/NotificationWidgetSkeleton';
import { BuzoStatsWidgetSkeleton } from './widgets/skeletons/BuzoStatsWidgetSkeleton';

// Nuevos skeletons para superuser
import { SystemControlPanelWidgetSkeleton } from './widgets/skeletons/SystemControlPanelWidgetSkeleton';
import { ModuleStatusWidgetSkeleton } from './widgets/skeletons/ModuleStatusWidgetSkeleton';
import { GlobalSecurityAlertsWidgetSkeleton } from './widgets/skeletons/GlobalSecurityAlertsWidgetSkeleton';
import { UsageStatsWidgetSkeleton } from './widgets/skeletons/UsageStatsWidgetSkeleton';
import { InvitationManagementWidgetSkeleton } from './widgets/skeletons/InvitationManagementWidgetSkeleton';

export type Role = 'admin_servicio' | 'admin_salmonera' | 'admin_contratista' | 'supervisor' | 'buzo' | 'superuser';

export type WidgetType =
    'kpi-cards' |
    'stats-chart' |
    'upcoming-operations' |
    'my-immersions' |
    'quick-actions' |
    'security-alerts' |
    'team-status' |
    'weather' |
    'calendar' |
    'equipment-status' |
    'global-metrics' |
    'alerts-panel' |
    'notifications' |
    'buzo-stats' |
    'system-control-panel' |
    'module-status' |
    'global-security-alerts' |
    'usage-stats' |
    'invitation-management';

export interface WidgetConfig {
  name: string;
  description: string;
  component: React.LazyExoticComponent<React.ComponentType<any>> | React.ComponentType<any>;
  skeleton: React.ComponentType;
  configComponent?: React.ComponentType<any>;
  defaultLayout: {
    w: number;
    h: number;
    static?: boolean;
  };
  isHeavy?: boolean;
  category?: 'metrics' | 'alerts' | 'actions' | 'status' | 'content' | 'admin';
  roles?: Role[];
}

export const widgetRegistry: Record<WidgetType, WidgetConfig> = {
  'kpi-cards': {
    name: 'KPIs Principales',
    description: 'Indicadores clave de rendimiento del sistema',
    component: KpiCardsWidget,
    skeleton: KpiCardsWidgetSkeleton,
    defaultLayout: { w: 12, h: 4 },
    category: 'metrics',
    roles: ['admin_servicio', 'admin_salmonera', 'supervisor', 'superuser']
  },
  'stats-chart': {
    name: 'Gráfico de Estadísticas',
    description: 'Visualización de datos estadísticos en tiempo real',
    component: StatsChartWidget,
    skeleton: StatsChartWidgetSkeleton,
    defaultLayout: { w: 8, h: 8 },
    isHeavy: true,
    category: 'metrics',
    roles: ['admin_servicio', 'admin_salmonera', 'supervisor', 'superuser']
  },
  'upcoming-operations': {
    name: 'Próximas Operaciones',
    description: 'Lista de operaciones programadas próximamente',
    component: UpcomingOperationsWidget,
    skeleton: UpcomingOperationsWidgetSkeleton,
    defaultLayout: { w: 6, h: 6 },
    category: 'content',
    roles: ['supervisor', 'buzo', 'superuser']
  },
  'my-immersions': {
    name: 'Mis Inmersiones',
    description: 'Resumen de tus inmersiones recientes',
    component: MyImmersionsWidget,
    skeleton: MyImmersionsWidgetSkeleton,
    defaultLayout: { w: 6, h: 6 },
    category: 'content',
    roles: ['buzo']
  },
  'quick-actions': {
    name: 'Acciones Rápidas',
    description: 'Acceso directo a funciones frecuentes',
    component: QuickActionsWidget,
    skeleton: GenericWidgetSkeleton,
    defaultLayout: { w: 4, h: 6 },
    category: 'actions'
  },
  'security-alerts': {
    name: 'Alertas de Seguridad',
    description: 'Monitoreo de alertas críticas del sistema',
    component: SecurityAlertsWidget,
    skeleton: SecurityAlertsWidgetSkeleton,
    defaultLayout: { w: 6, h: 8 },
    category: 'alerts',
    roles: ['admin_salmonera', 'admin_servicio', 'supervisor', 'superuser']
  },
  'team-status': {
    name: 'Estado del Equipo',
    description: 'Estado actual de los miembros del equipo',
    component: TeamStatusWidget,
    skeleton: GenericWidgetSkeleton,
    configComponent: TeamStatusWidgetConfig,
    defaultLayout: { w: 4, h: 6 },
    category: 'status',
    roles: ['supervisor', 'superuser']
  },
  'weather': {
    name: 'Clima',
    description: 'Condiciones meteorológicas actuales',
    component: WeatherWidget,
    skeleton: WeatherWidgetSkeleton,
    defaultLayout: { w: 4, h: 4 },
    category: 'content'
  },
  'calendar': {
    name: 'Calendario',
    description: 'Vista de eventos y citas programadas',
    component: CalendarWidget,
    skeleton: CalendarWidgetSkeleton,
    defaultLayout: { w: 8, h: 8 },
    isHeavy: true,
    category: 'content'
  },
  'equipment-status': {
    name: 'Estado de Equipos',
    description: 'Monitoreo del estado de equipos de buceo',
    component: EquipmentStatusWidget,
    skeleton: EquipmentStatusWidgetSkeleton,
    defaultLayout: { w: 6, h: 6 },
    category: 'status',
    roles: ['supervisor', 'superuser']
  },
  'global-metrics': {
    name: 'Métricas Globales',
    description: 'Métricas generales del sistema',
    component: GlobalMetricsWidget,
    skeleton: GenericWidgetSkeleton,
    defaultLayout: { w: 12, h: 6 },
    isHeavy: true,
    category: 'metrics',
    roles: ['admin_servicio', 'superuser', 'admin_salmonera']
  },
  'alerts-panel': {
    name: 'Panel de Alertas',
    description: 'Centro de control de alertas del sistema',
    component: AlertsPanelWidget,
    skeleton: GenericWidgetSkeleton,
    configComponent: AlertsPanelWidgetConfig,
    defaultLayout: { w: 8, h: 8 },
    category: 'alerts',
    roles: ['admin_salmonera', 'admin_servicio', 'supervisor', 'superuser']
  },
  'notifications': {
    name: 'Notificaciones',
    description: 'Centro de notificaciones del usuario',
    component: NotificationWidget,
    skeleton: NotificationWidgetSkeleton,
    defaultLayout: { w: 4, h: 8 },
    category: 'alerts'
  },
  'buzo-stats': {
    name: 'Estadísticas de Buzo',
    description: 'Métricas clave de tu actividad como buzo.',
    component: BuzoStatsWidget,
    skeleton: BuzoStatsWidgetSkeleton,
    defaultLayout: { w: 12, h: 4 },
    category: 'metrics',
    roles: ['buzo']
  },
  
  // Nuevos widgets para superuser
  'system-control-panel': {
    name: 'Panel de Control del Sistema',
    description: 'Métricas globales y control del sistema completo',
    component: SystemControlPanelWidget,
    skeleton: SystemControlPanelWidgetSkeleton,
    defaultLayout: { w: 12, h: 6 },
    isHeavy: true,
    category: 'admin',
    roles: ['superuser']
  },
  'module-status': {
    name: 'Estado de Módulos',
    description: 'Estado de activación de módulos por empresa',
    component: ModuleStatusWidget,
    skeleton: ModuleStatusWidgetSkeleton,
    defaultLayout: { w: 6, h: 8 },
    category: 'admin',
    roles: ['superuser']
  },
  'global-security-alerts': {
    name: 'Alertas de Seguridad Globales',
    description: 'Vista unificada de todas las alertas de seguridad del sistema',
    component: GlobalSecurityAlertsWidget,
    skeleton: GlobalSecurityAlertsWidgetSkeleton,
    defaultLayout: { w: 6, h: 8 },
    category: 'admin',
    roles: ['superuser']
  },
  'usage-stats': {
    name: 'Estadísticas de Uso',
    description: 'Métricas de adopción y uso del sistema por empresa',
    component: UsageStatsWidget,
    skeleton: UsageStatsWidgetSkeleton,
    defaultLayout: { w: 8, h: 6 },
    isHeavy: true,
    category: 'admin',
    roles: ['superuser']
  },
  'invitation-management': {
    name: 'Gestión de Invitaciones',
    description: 'Panel de control de invitaciones de contratistas',
    component: InvitationManagementWidget,
    skeleton: InvitationManagementWidgetSkeleton,
    defaultLayout: { w: 4, h: 8 },
    category: 'admin',
    roles: ['superuser']
  }
};
