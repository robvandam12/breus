
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/dashboard/KPICard";
import { ImmersionChart } from "@/components/dashboard/ImmersionChart";
import { ActiveOperationsTable } from "@/components/dashboard/ActiveOperationsTable";
import { 
  BarChart3, 
  Waves, 
  FileText, 
  AlertTriangle, 
  Users, 
  Calendar,
  Building
} from "lucide-react";

const Dashboard = () => {
  // Mock data para KPIs
  const kpiData = {
    hptPendientes: 12,
    inmersionesHoy: 8,
    operacionesActivas: 5,
    alertasActivas: 3
  };

  // Mock data para gráfico de inmersiones
  const immersionData = [
    { date: "01/01", inmersiones: 12, completadas: 10 },
    { date: "02/01", inmersiones: 15, completadas: 14 },
    { date: "03/01", inmersiones: 8, completadas: 8 },
    { date: "04/01", inmersiones: 18, completadas: 16 },
    { date: "05/01", inmersiones: 22, completadas: 20 },
    { date: "06/01", inmersiones: 16, completadas: 15 },
    { date: "07/01", inmersiones: 14, completadas: 13 },
    { date: "08/01", inmersiones: 20, completadas: 18 },
    { date: "09/01", inmersiones: 25, completadas: 24 },
    { date: "10/01", inmersiones: 19, completadas: 17 },
    { date: "11/01", inmersiones: 23, completadas: 22 },
    { date: "12/01", inmersiones: 17, completadas: 16 },
    { date: "13/01", inmersiones: 21, completadas: 20 },
    { date: "14/01", inmersiones: 16, completadas: 15 },
    { date: "15/01", inmersiones: 24, completadas: 23 }
  ];

  // Mock data para operaciones activas
  const activeOperations = [
    {
      id: 1,
      codigo: "OP-2024-001",
      salmonera: "AquaChile S.A.",
      sitio: "Sitio Chiloé Norte",
      fechaInicio: "15/01/2024",
      fechaFin: "25/01/2024",
      supervisor: "Diego Martínez",
      buzos: 4,
      estado: "Activa",
      prioridad: "Alta" as const
    },
    {
      id: 2,
      codigo: "OP-2024-002",
      salmonera: "Salmones Camanchaca",
      sitio: "Centro Los Fiordos",
      fechaInicio: "18/01/2024",
      fechaFin: "28/01/2024",
      supervisor: "Carlos Mendoza",
      buzos: 3,
      estado: "En Preparación",
      prioridad: "Media" as const
    },
    {
      id: 3,
      codigo: "OP-2024-003",
      salmonera: "Cermaq Chile",
      sitio: "Piscicultura Río Blanco",
      fechaInicio: "20/01/2024",
      fechaFin: "30/01/2024",
      supervisor: "Ana López",
      buzos: 2,
      estado: "Activa",
      prioridad: "Baja" as const
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
            <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
              <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Dashboard</h1>
                  <p className="text-sm text-zinc-500">Resumen ejecutivo de operaciones</p>
                </div>
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Exportar Reporte
                </Button>
                <Button className="ios-button">
                  <Building className="w-4 h-4 mr-2" />
                  Nueva Operación
                </Button>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
              {/* KPIs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                  title="HPT Pendientes"
                  value={kpiData.hptPendientes}
                  description="Requieren aprobación"
                  icon={FileText}
                  badge={{
                    text: "Urgente",
                    variant: "destructive"
                  }}
                  trend={{
                    value: 8,
                    isPositive: false
                  }}
                />
                <KPICard
                  title="Inmersiones Hoy"
                  value={kpiData.inmersionesHoy}
                  description="Programadas para hoy"
                  icon={Waves}
                  trend={{
                    value: 12,
                    isPositive: true
                  }}
                />
                <KPICard
                  title="Operaciones Activas"
                  value={kpiData.operacionesActivas}
                  description="En curso actualmente"
                  icon={Building}
                  badge={{
                    text: "En Tiempo",
                    variant: "outline"
                  }}
                />
                <KPICard
                  title="Alertas Activas"
                  value={kpiData.alertasActivas}
                  description="Requieren atención"
                  icon={AlertTriangle}
                  badge={{
                    text: "Revisar",
                    variant: "secondary"
                  }}
                  trend={{
                    value: 25,
                    isPositive: false
                  }}
                />
              </div>

              {/* Chart Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ImmersionChart data={immersionData} />
                
                {/* Quick Stats Card */}
                <div className="space-y-6">
                  <KPICard
                    title="Buzos Activos"
                    value="24"
                    description="Certificados y disponibles"
                    icon={Users}
                    trend={{
                      value: 5,
                      isPositive: true
                    }}
                  />
                  <KPICard
                    title="Eficiencia Operacional"
                    value="94.2%"
                    description="Inmersiones completadas exitosamente"
                    icon={BarChart3}
                    badge={{
                      text: "Excelente",
                      variant: "default"
                    }}
                    trend={{
                      value: 2.1,
                      isPositive: true
                    }}
                  />
                </div>
              </div>

              {/* Active Operations Table */}
              <ActiveOperationsTable operations={activeOperations} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
