
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/layout/Header";
import { AdminSalmoneraView } from "@/components/dashboard/AdminSalmoneraView";
import { AdminServicioView } from "@/components/dashboard/AdminServicioView";
import { SupervisorView } from "@/components/dashboard/SupervisorView";
import { BuzoView } from "@/components/dashboard/BuzoView";
import { useAuth } from "@/hooks/useAuth";
import { BarChart3 } from "lucide-react";

export default function Index() {
  const { profile } = useAuth();

  const getDashboardContent = () => {
    switch (profile?.role) {
      case 'superuser':
        return <AdminSalmoneraView />;
      case 'admin_salmonera':
        return <AdminSalmoneraView />;
      case 'admin_servicio':
        return <AdminServicioView />;
      case 'supervisor':
        return <SupervisorView />;
      case 'buzo':
        return <BuzoView />;
      default:
        return <BuzoView />;
    }
  };

  const getDashboardTitle = () => {
    switch (profile?.role) {
      case 'superuser':
        return "Panel de Administración";
      case 'admin_salmonera':
        return "Dashboard Salmonera";
      case 'admin_servicio':
        return "Dashboard Servicio";
      case 'supervisor':
        return "Dashboard Supervisor";
      case 'buzo':
        return "Dashboard Buzo";
      default:
        return "Dashboard";
    }
  };

  const getDashboardSubtitle = () => {
    switch (profile?.role) {
      case 'superuser':
        return "Gestión completa del sistema";
      case 'admin_salmonera':
        return "Administración de sitios y operaciones";
      case 'admin_servicio':
        return "Control de equipos y servicios";
      case 'supervisor':
        return "Supervisión de operaciones de buceo";
      case 'buzo':
        return "Mis inmersiones y bitácoras";
      default:
        return "Panel de control personal";
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title={getDashboardTitle()} 
            subtitle={getDashboardSubtitle()} 
            icon={BarChart3} 
          />
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              {getDashboardContent()}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
