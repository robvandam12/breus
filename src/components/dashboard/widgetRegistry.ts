
import React from 'react';
import { AlertasPanelWidget } from './widgets/AlertsPanelWidget';
import { QuickActionsWidget } from './widgets/QuickActionsWidget';
import { TeamStatusWidget } from './widgets/TeamStatusWidget';
import { GlobalMetricsWidget } from './widgets/GlobalMetricsWidget';
import { TeamStatusWidgetConfig } from './widgets/config/TeamStatusWidgetConfig';
import { AlertsPanelWidgetConfig } from './widgets/config/AlertsPanelWidgetConfig';

// Skeletons
import { KpiCardsWidgetSkeleton } from './widgets/skeletons/KpiCardsWidgetSkeleton';
import { StatsChartWidgetSkeleton } from './widgets/skeletons/StatsChartWidgetSkeleton';
import { UpcomingOperationsWidgetSkeleton } from './widgets/skeletons/UpcomingOperationsWidgetSkeleton';
import { MyImmersionsWidgetSkeleton } from './widgets/skeletons/MyImmersionsWidgetSkeleton';
import { GenericWidgetSkeleton } from './widgets/skeletons/GenericWidgetSkeleton';
import { SecurityAlertsWidgetSkeleton } from './widgets/skeletons/SecurityAlertsWidgetSkeleton';

export interface WidgetRegistryEntry {
  name: string;
  component: React.ComponentType<any>;
  configComponent?: React.ComponentType<any>;
  description?: string;
  defaultLayout: {
    w: number;
    h: number;
  };
  skeleton: React.ComponentType<any>;
}

export const widgetRegistry: Record<string, WidgetRegistryEntry> = {
  kpi_cards: {
    name: 'KPIs Principales',
    component: React.lazy(() => import('./widgets/KpiCardsWidget')),
    skeleton: KpiCardsWidgetSkeleton,
    description: 'Indicadores clave de rendimiento.',
    defaultLayout: { w: 12, h: 2 },
  },
  stats_chart: {
    name: 'Estadísticas',
    component: React.lazy(() => import('./widgets/StatsChartWidget')),
    skeleton: StatsChartWidgetSkeleton,
    description: 'Gráfico con estadísticas de operaciones.',
    defaultLayout: { w: 12, h: 5 },
  },
  upcoming_operations: {
    name: 'Próximas Operaciones',
    component: React.lazy(() => import('./widgets/UpcomingOperationsWidget')),
    skeleton: UpcomingOperationsWidgetSkeleton,
    description: 'Lista de las próximas operaciones programadas.',
    defaultLayout: { w: 5, h: 6 },
  },
  quick_actions: {
    name: 'Acciones Rápidas',
    component: QuickActionsWidget,
    skeleton: GenericWidgetSkeleton,
    description: 'Accesos directos a acciones comunes.',
    defaultLayout: { w: 3, h: 6 },
  },
  alerts_panel: {
    name: 'Alertas Generales',
    component: AlertasPanelWidget,
    configComponent: AlertsPanelWidgetConfig,
    skeleton: GenericWidgetSkeleton,
    description: 'Muestra alertas importantes del sistema.',
    defaultLayout: { w: 4, h: 8 },
  },
  security_alerts: {
    name: 'Alertas de Seguridad',
    component: React.lazy(() => import('./widgets/SecurityAlertsWidget')),
    skeleton: SecurityAlertsWidgetSkeleton,
    description: 'Muestra alertas de seguridad críticas en tiempo real.',
    defaultLayout: { w: 4, h: 8 },
  },
  my_immersions: {
    name: 'Mis Inmersiones (Buzo)',
    component: React.lazy(() => import('./widgets/MyImmersionsWidget')),
    skeleton: MyImmersionsWidgetSkeleton,
    description: 'Resumen de tu actividad de buceo.',
    defaultLayout: { w: 12, h: 7 },
  },
  team_status: {
    name: 'Estado del Equipo (Supervisor)',
    component: TeamStatusWidget,
    configComponent: TeamStatusWidgetConfig,
    skeleton: GenericWidgetSkeleton,
    description: 'Supervisa el estado de tu equipo de buzos.',
    defaultLayout: { w: 6, h: 8 },
  },
  global_metrics: {
    name: 'Métricas Globales (Admin)',
    component: GlobalMetricsWidget,
    skeleton: GenericWidgetSkeleton,
    description: 'Métricas y reportes para administradores.',
    defaultLayout: { w: 6, h: 6 },
  },
};

export type WidgetType = keyof typeof widgetRegistry;
