
import { KpiCardsWidget } from './widgets/KpiCardsWidget';
import { UpcomingOperationsWidget } from './widgets/UpcomingOperationsWidget';
import { QuickActionsWidget } from './widgets/QuickActionsWidget';
import { StatsChartWidget } from './widgets/StatsChartWidget';
import { AlertasPanelWidget } from './widgets/AlertsPanelWidget';
import React from 'react';
import { MyImmersionsWidget } from './widgets/MyImmersionsWidget';
import { TeamStatusWidget } from './widgets/TeamStatusWidget';
import { GlobalMetricsWidget } from './widgets/GlobalMetricsWidget';

export interface WidgetRegistryEntry {
  name: string;
  component: React.ComponentType<any>;
  description?: string;
  defaultLayout: {
    w: number;
    h: number;
  };
}

export const widgetRegistry: Record<string, WidgetRegistryEntry> = {
  kpi_cards: {
    name: 'KPIs Principales',
    component: KpiCardsWidget,
    description: 'Indicadores clave de rendimiento.',
    defaultLayout: { w: 12, h: 2 },
  },
  stats_chart: {
    name: 'Estadísticas',
    component: StatsChartWidget,
    description: 'Gráfico con estadísticas de operaciones.',
    defaultLayout: { w: 12, h: 5 },
  },
  upcoming_operations: {
    name: 'Próximas Operaciones',
    component: UpcomingOperationsWidget,
    description: 'Lista de las próximas operaciones programadas.',
    defaultLayout: { w: 5, h: 6 },
  },
  quick_actions: {
    name: 'Acciones Rápidas',
    component: QuickActionsWidget,
    description: 'Accesos directos a acciones comunes.',
    defaultLayout: { w: 3, h: 6 },
  },
  alerts_panel: {
    name: 'Panel de Alertas',
    component: AlertasPanelWidget,
    description: 'Muestra alertas importantes del sistema.',
    defaultLayout: { w: 4, h: 6 },
  },
  my_immersions: {
    name: 'Mis Inmersiones (Buzo)',
    component: MyImmersionsWidget,
    description: 'Resumen de tu actividad de buceo.',
    defaultLayout: { w: 12, h: 7 },
  },
  team_status: {
    name: 'Estado del Equipo (Supervisor)',
    component: TeamStatusWidget,
    description: 'Supervisa el estado de tu equipo de buzos.',
    defaultLayout: { w: 6, h: 8 },
  },
  global_metrics: {
    name: 'Métricas Globales (Admin)',
    component: GlobalMetricsWidget,
    description: 'Métricas y reportes para administradores.',
    defaultLayout: { w: 6, h: 6 },
  },
};

export type WidgetType = keyof typeof widgetRegistry;
