
import { KPICard } from "@/components/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Anchor, Users, FileText, AlertTriangle, TrendingUp, Calendar } from "lucide-react";

export function Dashboard() {
  const kpiData = [
    {
      title: "HPT Pendientes",
      value: "12",
      change: { value: "+2", type: "neutral" as const },
      description: "Desde la semana pasada",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      title: "Inmersiones Hoy",
      value: "8",
      change: { value: "+25%", type: "positive" as const },
      description: "Respecto a ayer",
      icon: <Anchor className="w-4 h-4" />,
    },
    {
      title: "Buzos Activos",
      value: "24",
      change: { value: "100%", type: "positive" as const },
      description: "Disponibles",
      icon: <Users className="w-4 h-4" />,
    },
    {
      title: "Alertas Activas",
      value: "3",
      change: { value: "-1", type: "positive" as const },
      description: "Desde ayer",
      icon: <AlertTriangle className="w-4 h-4" />,
    },
  ];

  const upcomingOperations = [
    {
      id: 1,
      name: "Limpieza Redes - Centro Ancud",
      date: "2024-01-15",
      supervisor: "Diego Martínez",
      status: "programada",
      divers: 4,
    },
    {
      id: 2,
      name: "Inspección Jaulas - Chiloé Norte",
      date: "2024-01-16",
      supervisor: "Carlos Ruiz",
      status: "en_progreso",
      divers: 2,
    },
    {
      id: 3,
      name: "Mantención Fondeo - Castro",
      date: "2024-01-17",
      supervisor: "Ana López",
      status: "programada",
      divers: 3,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "programada":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "en_progreso":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "completada":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "programada":
        return "Programada";
      case "en_progreso":
        return "En Progreso";
      case "completada":
        return "Completada";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Dashboard
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
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
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Inmersiones Últimos 30 Días
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 md:h-80 flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">Gráfico próximamente</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Operations List */}
        <div className="space-y-6">
          <Card className="ios-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Operaciones Próximas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingOperations.map((operation, index) => (
                <div
                  key={operation.id}
                  className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200 cursor-pointer group"
                  style={{ animationDelay: `${(index + 4) * 100}ms` }}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm leading-snug group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                        {operation.name}
                      </h4>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(operation.status)}`}>
                        {getStatusText(operation.status)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                      <span>{operation.supervisor}</span>
                      <span>{operation.divers} buzos</span>
                    </div>
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-500">
                      {new Date(operation.date).toLocaleDateString('es-CL', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="ios-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full p-3 text-left rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 ios-button touch-target">
                Nueva Operación
              </button>
              <button className="w-full p-3 text-left rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 font-medium transition-all duration-200 ios-button touch-target">
                Crear HPT
              </button>
              <button className="w-full p-3 text-left rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 font-medium transition-all duration-200 ios-button touch-target">
                Ver Reportes
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
