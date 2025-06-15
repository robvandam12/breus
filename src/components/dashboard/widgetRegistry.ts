
import { KpiCardsWidget } from './widgets/KpiCardsWidget';
import { UpcomingOperationsWidget } from './widgets/UpcomingOperationsWidget';
import { QuickActionsWidget } from './widgets/QuickActionsWidget';
import { StatsChartWidget } from './widgets/StatsChartWidget';
import { AlertasPanelWidget } from './widgets/AlertsPanelWidget';

export const widgetRegistry = {
  kpi_cards: {
    name: 'KPIs Principales',
    component: KpiCardsWidget,
  },
  stats_chart: {
    name: 'Estadísticas',
    component: StatsChartWidget,
  },
  upcoming_operations: {
    name: 'Próximas Operaciones',
    component: UpcomingOperationsWidget,
  },
  quick_actions: {
    name: 'Acciones Rápidas',
    component: QuickActionsWidget,
  },
  alerts_panel: {
    name: 'Panel de Alertas',
    component: AlertasPanelWidget,
  },
};

export type WidgetType = keyof typeof widgetRegistry;
