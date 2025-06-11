
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { AdminSalmoneraView } from "@/components/dashboard/AdminSalmoneraView";
import { AdminServicioView } from "@/components/dashboard/AdminServicioView";
import { SupervisorView } from "@/components/dashboard/SupervisorView";
import { BuzoView } from "@/components/dashboard/BuzoView";
import { BuzoRestrictedView } from "@/components/dashboard/BuzoRestrictedView";
import { BuzoDashboard } from "@/components/dashboard/BuzoDashboard";
import { useAuth } from "@/hooks/useAuth";
import { useBuzoNotifications } from "@/hooks/useBuzoNotifications";
import { BarChart3 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const { profile, user, loading } = useAuth();
  const navigate = useNavigate();

  // Inicializar notificaciones para buzos
  useBuzoNotifications();

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !user) {
      navigate('/login');
      return;
    }

    // Para buzos nuevos sin perfil, ir al onboarding
    if (user && profile?.role === 'buzo' && !profile.perfil_completado) {
      navigate('/buzo-onboarding');
      return;
    }

    // Redirect new users to onboarding (otros roles)
    if (user && profile && !profile.nombre && !profile.apellido && profile.role !== 'buzo') {
      navigate('/onboarding');
      return;
    }
  }, [loading, user, profile, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getDashboardContent = () => {
    const isAssigned = profile?.salmonera_id || profile?.servicio_id;

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
        // Usar el nuevo dashboard específico para buzos
        return <BuzoDashboard />;
      default:
        return <BuzoRestrictedView />;
    }
  };

  const getDashboardTitle = () => {
    const isAssigned = profile?.salmonera_id || profile?.servicio_id;

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
        return isAssigned ? "Mi Dashboard de Buceo" : "Bienvenido a Breus";
      default:
        return "Dashboard";
    }
  };

  const getDashboardSubtitle = () => {
    const isAssigned = profile?.salmonera_id || profile?.servicio_id;

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
        return isAssigned ? "Mis inmersiones, bitácoras y operaciones" : "Completa tu perfil para comenzar";
      default:
        return "Panel de control personal";
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <RoleBasedSidebar />
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
