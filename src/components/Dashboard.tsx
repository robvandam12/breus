
import { KPICard } from "./KPICard";
import { OperationsTable } from "./OperationsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Book } from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "HPT pendiente de firma",
    description: "Operación OP-001 requiere firma del supervisor",
    type: "warning",
    time: "hace 15 min"
  },
  {
    id: 2,
    title: "Inmersión completada",
    description: "Buzo Carlos Silva completó inmersión en Sitio Los Boldos",
    type: "success", 
    time: "hace 1 hora"
  },
  {
    id: 3,
    title: "Mantenimiento programado",
    description: "Equipo de buceo requiere inspección en 3 días",
    type: "info",
    time: "hace 2 horas"
  }
];

export function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen general de operaciones y actividades de buceo
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Operaciones Activas"
          value={12}
          change={{ value: "+2", type: "positive" }}
          description="vs. semana anterior"
          icon={<Calendar className="w-4 h-4" />}
        />
        <KPICard
          title="Inmersiones Hoy"
          value={7}
          change={{ value: "+1", type: "positive" }}
          description="programadas"
          icon={<Calendar className="w-4 h-4" />}
        />
        <KPICard
          title="HPT Pendientes"
          value={3}
          change={{ value: "-1", type: "positive" }}
          description="por firmar"
          icon={<FileText className="w-4 h-4" />}
        />
        <KPICard
          title="Bitácoras Abiertas"
          value={5}
          change={{ value: "=", type: "neutral" }}
          description="en progreso"
          icon={<Book className="w-4 h-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Operations Table */}
        <div className="lg:col-span-2">
          <OperationsTable />
        </div>

        {/* Notifications Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Notificaciones</span>
              <Badge variant="secondary">3</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    notification.type === 'warning'
                      ? 'bg-yellow-500'
                      : notification.type === 'success'
                      ? 'bg-green-500'
                      : 'bg-blue-500'
                  }`}
                />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {notification.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {notification.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {notification.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
