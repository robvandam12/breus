
import { MainLayout } from "@/components/layout/MainLayout";
import { SupervisorView } from "@/components/dashboard/SupervisorView";
import { BuzoDashboard } from "@/components/dashboard/BuzoDashboard";
import { BuzoRestrictedView } from "@/components/dashboard/BuzoRestrictedView";
import { BuzoOnboarding } from "@/components/onboarding/BuzoOnboarding";
import { useAuth } from "@/hooks/useAuth";
import { BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CustomizableDashboard } from "@/components/dashboard/CustomizableDashboard";

export default function Index() {
  const { profile, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [redirectHandled, setRedirectHandled] = useState(false);

  useEffect(() => {
    // Solo ejecutar redirecciones una vez y cuando no esté cargando
    if (loading || redirectHandled) return;

    console.log('Index.tsx - Checking redirections:', { user: !!user, profile, pathname: location.pathname });

    // Redirect if not authenticated
    if (!user) {
      console.log('Index.tsx - No user found, redirecting to login');
      setRedirectHandled(true);
      navigate('/login');
      return;
    }

    // Redirect new users to onboarding (only if they don't have basic profile info)
    if (user && profile && !profile.nombre && !profile.apellido) {
      console.log('Index.tsx - New user detected, redirecting to onboarding');
      setRedirectHandled(true);
      navigate('/onboarding');
      return;
    }

    // Handle /dashboard to / redirect
    if (location.pathname === '/dashboard') {
      console.log('Index.tsx - Redirecting from /dashboard to /');
      setRedirectHandled(true);
      navigate('/', { replace: true });
      return;
    }

    // Check if buzo needs onboarding (but don't redirect, show onboarding component)
    if (user && profile && profile.role === 'buzo') {
      const onboardingCompleted = localStorage.getItem('onboarding_completed');
      if (!onboardingCompleted) {
        console.log('Index.tsx - Showing buzo onboarding');
        setShowOnboarding(true);
      }
    }

    // Mark redirections as handled
    setRedirectHandled(true);
  }, [loading, user, profile, navigate, location.pathname, redirectHandled]);

  // Reset redirect flag when user or profile changes
  useEffect(() => {
    setRedirectHandled(false);
  }, [user?.id, profile?.id]);

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
    
    switch (profile?.role) {
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
    <MainLayout
      title={getDashboardTitle()}
      subtitle={getDashboardSubtitle()}
      icon={BarChart3}
    >
      {getDashboardContent()}
    </MainLayout>
  );
}
