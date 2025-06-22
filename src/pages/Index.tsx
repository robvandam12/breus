
import { MainLayout } from "@/components/layout/MainLayout";
import { SupervisorView } from "@/components/dashboard/SupervisorView";
import { BuzoDashboard } from "@/components/dashboard/BuzoDashboard";
import { BuzoRestrictedView } from "@/components/dashboard/BuzoRestrictedView";
import { BuzoOnboarding } from "@/components/onboarding/BuzoOnboarding";
import { useAuth } from "@/hooks/useAuth";
import { BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomizableDashboard } from "@/components/dashboard/CustomizableDashboard";

export default function Index() {
  const { profile, user, loading } = useAuth();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // No hacer nada si está cargando
    if (loading) return;

    console.log('Index.tsx - Auth state:', { user: !!user, profile, loading });

    // Redirect if not authenticated
    if (!user) {
      console.log('Index.tsx - No user found, redirecting to login');
      navigate('/login', { replace: true });
      return;
    }

    // Check if new user needs onboarding (only if they don't have basic profile info)
    if (user && profile && !profile.nombre && !profile.apellido) {
      console.log('Index.tsx - New user detected, redirecting to onboarding');
      navigate('/onboarding', { replace: true });
      return;
    }

    // Check if buzo needs onboarding (but don't redirect, show onboarding component)
    if (profile?.role === 'buzo') {
      const onboardingCompleted = localStorage.getItem('onboarding_completed');
      if (!onboardingCompleted) {
        console.log('Index.tsx - Showing buzo onboarding');
        setShowOnboarding(true);
      }
    }
  }, [loading, user, profile, navigate]);

  // Show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // If no user, don't render anything (will redirect)
  if (!user) {
    return null;
  }

  // Show onboarding for buzos who haven't seen it
  if (showOnboarding && profile?.role === 'buzo') {
    return <BuzoOnboarding onComplete={() => setShowOnboarding(false)} />;
  }

  const getDashboardContent = () => {
    if (!profile) {
      return <BuzoRestrictedView />;
    }
    
    switch (profile.role) {
      case 'superuser':
      case 'admin_salmonera':
      case 'admin_servicio':
        return <CustomizableDashboard />;
      case 'supervisor':
        return <SupervisorView />;
      case 'buzo':
        return <BuzoDashboard />;
      default:
        return <BuzoRestrictedView />;
    }
  };

  const getDashboardTitle = () => {
    if (!profile) return "Dashboard";
    
    switch (profile.role) {
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
    if (!profile) return "Panel de control";
    
    switch (profile.role) {
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
    <MainLayout
      title={getDashboardTitle()}
      subtitle={getDashboardSubtitle()}
      icon={BarChart3}
    >
      {getDashboardContent()}
    </MainLayout>
  );
}
