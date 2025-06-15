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
    'notifications';

export interface WidgetConfig {
  name: string;
  component: React.LazyExoticComponent<React.ComponentType<any>> | React.ComponentType<any>;
  skeleton: React.ComponentType;
  configComponent?: React.ComponentType<any>;
  defaultLayout: {
    w: number;
    h: number;
  };
  isHeavy?: boolean; // New property for performance optimization
  category?: 'metrics' | 'alerts' | 'actions' | 'status' | 'content';
}

export const widgetRegistry: Record<WidgetType, WidgetConfig> = {
  'kpi-cards': {
    name: 'KPIs Principales',
    component: KpiCardsWidget,
    skeleton: KpiCardsWidgetSkeleton,
    defaultLayout: { w: 12, h: 4 },
    category: 'metrics'
  },
  'stats-chart': {
    name: 'Gráfico de Estadísticas',
    component: StatsChartWidget,
    skeleton: StatsChartWidgetSkeleton,
    defaultLayout: { w: 8, h: 8 },
    isHeavy: true, // Charts are heavy components
    category: 'metrics'
  },
  'upcoming-operations': {
    name: 'Próximas Operaciones',
    component: UpcomingOperationsWidget,
    skeleton: UpcomingOperationsWidgetSkeleton,
    defaultLayout: { w: 6, h: 6 },
    category: 'content'
  },
  'my-immersions': {
    name: 'Mis Inmersiones',
    component: MyImmersionsWidget,
    skeleton: MyImmersionsWidgetSkeleton,
    defaultLayout: { w: 6, h: 6 },
    category: 'content'
  },
  'quick-actions': {
    name: 'Acciones Rápidas',
    component: QuickActionsWidget,
    skeleton: GenericWidgetSkeleton,
    defaultLayout: { w: 4, h: 6 },
    category: 'actions'
  },
  'security-alerts': {
    name: 'Alertas de Seguridad',
    component: SecurityAlertsWidget,
    skeleton: SecurityAlertsWidgetSkeleton,
    defaultLayout: { w: 6, h: 8 },
    category: 'alerts'
  },
  'team-status': {
    name: 'Estado del Equipo',
    component: TeamStatusWidget,
    skeleton: GenericWidgetSkeleton,
    configComponent: TeamStatusWidgetConfig,
    defaultLayout: { w: 4, h: 6 },
    category: 'status'
  },
  'weather': {
    name: 'Clima',
    component: WeatherWidget,
    skeleton: WeatherWidgetSkeleton,
    defaultLayout: { w: 4, h: 4 },
    category: 'content'
  },
  'calendar': {
    name: 'Calendario',
    component: CalendarWidget,
    skeleton: CalendarWidgetSkeleton,
    defaultLayout: { w: 8, h: 8 },
    isHeavy: true, // Calendar with many events can be heavy
    category: 'content'
  },
  'equipment-status': {
    name: 'Estado de Equipos',
    component: EquipmentStatusWidget,
    skeleton: EquipmentStatusWidgetSkeleton,
    defaultLayout: { w: 6, h: 6 },
    category: 'status'
  },
  'global-metrics': {
    name: 'Métricas Globales',
    component: GlobalMetricsWidget,
    skeleton: GenericWidgetSkeleton,
    defaultLayout: { w: 12, h: 6 },
    isHeavy: true, // Global metrics involve complex calculations
    category: 'metrics'
  },
  'alerts-panel': {
    name: 'Panel de Alertas',
    component: AlertsPanelWidget,
    skeleton: GenericWidgetSkeleton,
    configComponent: AlertsPanelWidgetConfig,
    defaultLayout: { w: 8, h: 8 },
    category: 'alerts'
  },
  'notifications': {
    name: 'Notificaciones',
    component: NotificationWidget,
    skeleton: NotificationWidgetSkeleton,
    defaultLayout: { w: 4, h: 8 },
    category: 'alerts'
  }
};
