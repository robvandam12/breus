
import { MainLayout } from "@/components/layout/MainLayout";
import { SupervisorView } from "@/components/dashboard/SupervisorView";
import { BuzoDashboard } from "@/components/dashboard/BuzoDashboard";
import { BuzoRestrictedView } from "@/components/dashboard/BuzoRestrictedView";
import { BuzoOnboarding } from "@/components/onboarding/BuzoOnboarding";
import { useAuth } from "@/hooks/useAuth";
import { BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";
import { CustomizableDashboard } from "@/components/dashboard/CustomizableDashboard";
import { Navigate } from "react-router-dom";

export default function Index() {
  const { profile, user, session, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  console.log('Index - loading:', loading, 'user:', !!user, 'profile:', profile?.role, 'session:', !!session);

  // Show loading while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Inicializando aplicación...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    console.log('Index - Usuario no autenticado, redirigiendo a login');
    return <Navigate to="/login" replace />;
  }

  // Check for onboarding only after profile is available
  useEffect(() => {
    if (profile?.role === 'buzo' && !showOnboarding) {
      const onboardingCompleted = localStorage.getItem('onboarding_completed');
      if (!onboardingCompleted) {
        setShowOnboarding(true);
      }
    }
  }, [profile, showOnboarding]);

  if (showOnboarding && profile?.role === 'buzo') {
    return <BuzoOnboarding onComplete={() => setShowOnboarding(false)} />;
  }

  const getDashboardContent = () => {
    // Show customizable dashboard for all roles initially
    // If profile is not loaded yet, show default dashboard
    if (!profile) {
      console.log('Index - No profile yet, showing default dashboard');
      return <CustomizableDashboard />;
    }
    
    console.log('Index - Showing dashboard for role:', profile.role);
    
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
