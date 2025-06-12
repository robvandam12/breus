
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { AdminSalmoneraView } from "@/components/dashboard/AdminSalmoneraView";
import { AdminServicioView } from "@/components/dashboard/AdminServicioView";
import { SupervisorView } from "@/components/dashboard/SupervisorView";
import { BuzoView } from "@/components/dashboard/BuzoView";
import { BuzoDashboard } from "@/components/dashboard/BuzoDashboard";
import { BuzoRestrictedView } from "@/components/dashboard/BuzoRestrictedView";
import { BuzoOnboarding } from "@/components/onboarding/BuzoOnboarding";
import { useAuth } from "@/hooks/useAuth";
import { BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const { profile, user, loading } = useAuth();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !user) {
      navigate('/login');
      return;
    }

    // Redirect new users to onboarding
    if (user && profile && !profile.nombre && !profile.apellido) {
      navigate('/onboarding');
      return;
    }

    // Check if buzo needs onboarding
    if (user && profile && profile.role === 'buzo') {
      const onboardingCompleted = localStorage.getItem('onboarding_completed');
      if (!onboardingCompleted) {
        setShowOnboarding(true);
      }
    }
  }, [loading, user, profile, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show onboarding for buzos who haven't seen it
  if (showOnboarding && profile?.role === 'buzo') {
    return <BuzoOnboarding onComplete={() => setShowOnboarding(false)} />;
  }

  const getDashboardContent = () => {
    const isAssigned = profile?.salmonera_id || profile?.servicio_id;
    
    // Verificar si el perfil del buzo está completo
    const isProfileComplete = () => {
      if (!profile?.perfil_buzo) return false;
      const requiredFields = ['rut', 'telefono', 'direccion', 'ciudad', 'region', 'nacionalidad'];
      const perfilBuzo = profile.perfil_buzo as any;
      return requiredFields.every(field => perfilBuzo[field]?.toString().trim());
    };

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
        return "Gestión de inmersiones y bitácoras";
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
