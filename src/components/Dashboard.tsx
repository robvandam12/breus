
import { KPICard } from "@/components/KPICard";
import { FileText, Anchor, Users, AlertTriangle } from "lucide-react";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { UpcomingOperations } from "@/components/dashboard/UpcomingOperations";
import { AlertasPanel } from "@/components/dashboard/AlertasPanel";
import { StatsChart } from "@/components/dashboard/StatsChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { NotificationToasts } from "@/components/dashboard/NotificationToasts";
import { useDashboardData } from "@/hooks/useDashboardData";

export function Dashboard() {
  const { stats, upcomingOperations } = useDashboardData();

  const kpiData = [
    {
      title: "Bitácoras Totales",
      value: stats.totalBitacoras.toString(),
      change: { value: `${stats.bitacorasFirmadas}/${stats.totalBitacoras}`, type: "neutral" as const },
      description: "Firmadas/Total",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      title: "Inmersiones Hoy",
      value: stats.inmersionesHoy.toString(),
      change: { value: "+25%", type: "positive" as const },
      description: "Respecto a ayer",
      icon: <Anchor className="w-4 h-4" />,
    },
    {
      title: "Operaciones Activas",
      value: stats.operacionesActivas.toString(),
      change: { value: "100%", type: "positive" as const },
      description: "En progreso",
      icon: <Users className="w-4 h-4" />,
    },
    {
      title: "Alertas Activas",
      value: stats.alertasActivas.toString(),
      change: { value: stats.alertasActivas > 0 ? "-1" : "0", type: stats.alertasActivas > 0 ? "positive" as const : "neutral" as const },
      description: "Requieren atención",
      icon: <AlertTriangle className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Componente de notificaciones toast */}
      <NotificationToasts />

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Dashboard
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Monitoreo operacional en tiempo real
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <div key={kpi.title} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
            <KPICard
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
              description={kpi.description}
              icon={kpi.icon}
              className="ios-card hover:scale-105 transition-transform duration-200"
            />
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <StatsChart />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Operations and Actions */}
        <div className="space-y-6">
          <UpcomingOperations operations={upcomingOperations} />
          <QuickActions />
        </div>

        {/* Recent Activity */}
        <div className="xl:col-span-2">
          <RecentActivity />
        </div>
      </div>

      {/* Alertas Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-1 gap-8">
        <AlertasPanel />
      </div>
    </div>
  );
}
