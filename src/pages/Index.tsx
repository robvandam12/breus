
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
  const [redirecting, setRedirecting] = useState(false);

  // Timeout de seguridad para evitar loading infinito
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.warn('Index: Loading timeout - user might be stuck');
      if (loading && !user) {
        console.log('Index: Forcing redirect to login due to timeout');
        navigate('/login', { replace: true });
      }
    }, 15000); // 15 segundos

    return () => clearTimeout(timeout);
  }, [loading, user, navigate]);

  useEffect(() => {
    console.log('Index: Auth state changed', { 
      loading, 
      hasUser: !!user, 
      hasProfile: !!profile,
      userRole: profile?.role,
      redirecting 
    });

    // Evitar redirecciones múltiples
    if (redirecting) {
      console.log('Index: Already redirecting, skipping');
      return;
    }

    // Si está cargando, esperar
    if (loading) {
      console.log('Index: Still loading, waiting...');
      return;
    }

    // Si no hay usuario, redirigir a login
    if (!user) {
      console.log('Index: No user found, redirecting to login');
      setRedirecting(true);
      navigate('/login', { replace: true });
      return;
    }

    // Si hay usuario pero no perfil completo, redirigir a onboarding
    if (user && (!profile || (!profile.nombre && !profile.apellido))) {
      console.log('Index: User exists but profile incomplete, redirecting to onboarding');
      setRedirecting(true);
      navigate('/onboarding', { replace: true });
      return;
    }

    // Check onboarding para buzos
    if (user && profile && profile.role === 'buzo') {
      const onboardingCompleted = localStorage.getItem('onboarding_completed');
      if (!onboardingCompleted) {
        console.log('Index: Buzo needs onboarding');
        setShowOnboarding(true);
      }
    }

    // Si llegamos aquí, todo está bien
    console.log('Index: Auth state is valid, showing dashboard');
  }, [loading, user, profile, navigate, redirecting]);

  // Loading state
  if (loading || redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">
            {redirecting ? 'Redirigiendo...' : 'Verificando autenticación...'}
          </p>
        </div>
      </div>
    );
  }

  // No debería llegar aquí sin user/profile, pero por seguridad
  if (!user || !profile) {
    console.warn('Index: Reached dashboard without user/profile');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Error de autenticación</h2>
          <p className="text-gray-600 mt-2">Por favor, inicia sesión nuevamente</p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Ir a Login
          </button>
        </div>
      </div>
    );
  }

  // Show onboarding for buzos who haven't seen it
  if (showOnboarding && profile.role === 'buzo') {
    return <BuzoOnboarding onComplete={() => setShowOnboarding(false)} />;
  }

  const getDashboardContent = () => {
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
