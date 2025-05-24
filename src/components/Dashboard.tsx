
import { KPICard } from "@/components/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Anchor, Users, AlertTriangle, TrendingUp } from "lucide-react";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { UpcomingOperations } from "@/components/dashboard/UpcomingOperations";
import { AlertasPanel } from "@/components/dashboard/AlertasPanel";
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="xl:col-span-2">
          <Card className="ios-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-zinc-600" />
                  Actividad Últimos 30 Días
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 md:h-80 flex items-center justify-center bg-gradient-to-br from-zinc-50 to-gray-50 dark:from-zinc-800 dark:to-zinc-900 rounded-xl">
                <div className="text-center space-y-4">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.totalBitacoras}</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">Bitácoras</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.inmersionesHoy}</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">Inmersiones</div>
                    </div>
                  </div>
                  <div className="w-12 h-12 mx-auto bg-zinc-100 dark:bg-zinc-900/30 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400">Gráfico detallado próximamente</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Operations and Actions */}
        <div className="space-y-6">
          <UpcomingOperations operations={upcomingOperations} />
          <QuickActions />
        </div>
      </div>

      {/* Alertas Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <AlertasPanel />
        
        {/* Espacio para futuras funcionalidades */}
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Próximas Funcionalidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                  Reportes Automáticos
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Generación automática de reportes de seguridad y cumplimiento
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                  Análisis Predictivo
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Predicción de riesgos y optimización de operaciones
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
