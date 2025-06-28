import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ModuleProtectedRoute } from "@/components/auth/ModuleProtectedRoute";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { DashboardWithSidebarSkeleton } from "@/components/dashboard/DashboardWithSidebarSkeleton";
import { PageWithSidebarSkeleton } from "@/components/layout/PageWithSidebarSkeleton";

// Auth components are loaded eagerly
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import EmailConfirmation from "../pages/auth/EmailConfirmation";
import AuthCallback from "../pages/auth/AuthCallback";

// Lazy-loaded pages
const Index = lazy(() => import("../pages/Index"));
const NotFound = lazy(() => import("../pages/NotFound"));
const RegisterFromInvitation = lazy(() => import("../pages/RegisterFromInvitation"));
const Salmoneras = lazy(() => import("../pages/empresas/Salmoneras"));
const Sitios = lazy(() => import("../pages/empresas/Sitios"));
const Centros = lazy(() => import("../pages/empresas/Centros"));  // AGREGADO: Import para Centros
const Contratistas = lazy(() => import("../pages/empresas/Contratistas"));
const Usuarios = lazy(() => import("../pages/empresas/Usuarios"));
const PersonalDeBuceo = lazy(() => import("../pages/PersonalDeBuceo"));
const PersonalPoolAdmin = lazy(() => {
  console.log('🔄 Loading PersonalPoolAdmin component...');
  return import("../pages/PersonalPoolAdmin");
});
const Operaciones = lazy(() => import("../pages/operaciones/Operaciones"));
const HPT = lazy(() => import("../pages/operaciones/HPT"));
const AnexoBravo = lazy(() => import("../pages/operaciones/AnexoBravo"));
const MantencionRedes = lazy(() => import("../pages/operaciones/MantencionRedes"));
const Inmersiones = lazy(() => import("../pages/Inmersiones"));
const BitacorasSupervisor = lazy(() => import("../pages/BitacorasSupervisor"));
const BitacorasBuzo = lazy(() => import("../pages/operaciones/BitacorasBuzo"));
const ProfileSetup = lazy(() => import("../pages/ProfileSetup"));
const Reportes = lazy(() => import("../pages/Reportes"));
const Configuracion = lazy(() => import("../pages/Configuracion"));
const AdminRoles = lazy(() => import("../pages/admin/AdminRoles"));
const AdminSalmoneraPage = lazy(() => import("../pages/admin/AdminSalmoneraPage"));
const UserManagement = lazy(() => import("../pages/admin/UserManagement"));
const AlertRulesAdmin = lazy(() => import("../pages/admin/AlertRulesAdmin"));
const AlertsLog = lazy(() => import("../pages/admin/AlertsLog"));
const BuzoOnboardingPage = lazy(() => import("../pages/BuzoOnboardingPage"));
const BuzoOperaciones = lazy(() => import("../pages/buzo/BuzoOperaciones"));
const BuzoInmersiones = lazy(() => import("../pages/buzo/BuzoInmersiones"));
const BuzoReportesPage = lazy(() => import("../pages/buzo/BuzoReportesPage"));
const SuperuserModules = lazy(() => import("../pages/admin/SuperuserModules"));
const SystemMonitoring = lazy(() => import("../pages/admin/SystemMonitoring"));

const FullPageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner text="Cargando página..." />
  </div>
);

// Component wrapper for debug
const DebugRouteWrapper = ({ children, routeName }: { children: React.ReactNode, routeName: string }) => {
  console.log(`🎯 Rendering route: ${routeName}`);
  return <>{children}</>;
};

export const AppRoutes = () => {
  console.log('🌐 AppRoutes component rendering');
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes - No protection needed */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/email-confirmation" element={<EmailConfirmation />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Invitation Registration Route */}
        <Route path="/register-invitation" element={
          <Suspense fallback={<FullPageLoader />}>
            <RegisterFromInvitation />
          </Suspense>
        } />

        {/* Onboarding & Profile Setup */}
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <Suspense fallback={<FullPageLoader />}>
              <BuzoOnboardingPage />
            </Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/profile-setup" element={
          <ProtectedRoute>
            <Suspense fallback={<FullPageLoader />}>
              <ProfileSetup />
            </Suspense>
          </ProtectedRoute>
        } />
        
        {/* Main Dashboard - Protected */}
        <Route path="/" element={
          <ProtectedRoute>
            <Suspense fallback={<DashboardWithSidebarSkeleton />}>
              <Index />
            </Suspense>
          </ProtectedRoute>
        } />
        
        {/* Empresa Routes */}
        <Route path="/empresas/salmoneras" element={
          <ProtectedRoute requiredRole="superuser">
            <Suspense fallback={<PageWithSidebarSkeleton />}>
              <Salmoneras />
            </Suspense>
          </ProtectedRoute>
        } />
        
        {/* CORREGIDO: Ruta principal para Centros */}
        <Route path="/empresas/centros" element={
          <ProtectedRoute>
            <Suspense fallback={<PageWithSidebarSkeleton />}>
              <Centros />
            </Suspense>
          </ProtectedRoute>
        } />
        
        {/* Legacy route redirect - mantener por compatibilidad */}
        <Route path="/empresas/sitios" element={
          <ProtectedRoute>
            <Suspense fallback={<PageWithSidebarSkeleton />}>
              <Sitios />
            </Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/empresas/contratistas" element={
          <ProtectedRoute>
            <Suspense fallback={<PageWithSidebarSkeleton />}>
              <Contratistas />
            </Suspense>
          </ProtectedRoute>
        } />
        
        {/* Ruta para usuarios de empresa */}
        <Route path="/empresas/usuarios" element={
          <ProtectedRoute>
            <Suspense fallback={<PageWithSidebarSkeleton />}>
              <DebugRouteWrapper routeName="/empresas/usuarios">
                <Usuarios />
              </DebugRouteWrapper>
            </Suspense>
          </ProtectedRoute>
        } />
        
        {/* Cuadrillas de Buceo Routes - Ruta principal consolidada */}
        <Route path="/cuadrillas-de-buceo" element={
          <ProtectedRoute>
            <Suspense fallback={<PageWithSidebarSkeleton />}>
              <PersonalDeBuceo />
            </Suspense>
          </ProtectedRoute>
        } />
        
        {/* Legacy route redirect para mantener compatibilidad */}
        <Route path="/personal-de-buceo" element={
          <ProtectedRoute>
            <Suspense fallback={<PageWithSidebarSkeleton />}>
              <PersonalDeBuceo />
            </Suspense>
          </ProtectedRoute>
        } />
        
        {/* Company Personnel Route - Para gestión global de personal (solo superuser) */}
        <Route path="/company-personnel" element={
          <ProtectedRoute requiredRole="superuser">
            <Suspense fallback={<PageWithSidebarSkeleton />}>
              <DebugRouteWrapper routeName="/company-personnel">
                <PersonalPoolAdmin />
              </DebugRouteWrapper>
            </Suspense>
          </ProtectedRoute>
        } />

        {/* Operations Routes - Protected by Planning Module */}
        <Route path="/operaciones" element={
          <ProtectedRoute>
            <ModuleProtectedRoute 
              requiredModule="planning_operations"
              moduleName="Módulo de Planificación de Operaciones"
              description="Este módulo permite la planificación y gestión de operaciones de buceo."
            >
              <Suspense fallback={<PageWithSidebarSkeleton />}>
                <Operaciones />
              </Suspense>
            </ModuleProtectedRoute>
          </ProtectedRoute>
        } />
        <Route path="/operaciones/hpt" element={
          <ProtectedRoute>
            <ModuleProtectedRoute 
              requiredModule="planning_operations"
              moduleName="HPT (Hoja de Planificación de Trabajo)"
            >
              <Suspense fallback={<PageWithSidebarSkeleton />}>
                <HPT />
              </Suspense>
            </ModuleProtectedRoute>
          </ProtectedRoute>
        } />
        <Route path="/operaciones/anexo-bravo" element={
          <ProtectedRoute>
            <ModuleProtectedRoute 
              requiredModule="planning_operations"
              moduleName="Anexo Bravo"
            >
              <Suspense fallback={<PageWithSidebarSkeleton />}>
                <AnexoBravo />
              </Suspense>
            </ModuleProtectedRoute>
          </ProtectedRoute>
        } />
        
        {/* Maintenance Routes - Protected by Maintenance Module */}
        <Route path="/operaciones/network-maintenance" element={
          <ProtectedRoute>
            <ModuleProtectedRoute 
              requiredModule="maintenance_networks"
              moduleName="Módulo de Mantención de Redes"
              description="Este módulo permite gestionar el mantenimiento de sistemas de redes."
            >
              <Suspense fallback={<PageWithSidebarSkeleton />}>
                <MantencionRedes />
              </Suspense>
            </ModuleProtectedRoute>
          </ProtectedRoute>
        } />

        {/* Immersions Route - Core functionality, always available */}
        <Route path="/inmersiones" element={
          <ProtectedRoute>
            <Suspense fallback={<PageWithSidebarSkeleton />}>
              <Inmersiones />
            </Suspense>
          </ProtectedRoute>
        } />
        
        {/* Bitacoras Routes - Core functionality */}
        <Route path="/bitacoras/supervisor" element={
          <ProtectedRoute>
            <Suspense fallback={<PageWithSidebarSkeleton />}>
              <BitacorasSupervisor />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/bitacoras/buzo" element={
          <ProtectedRoute>
            <Suspense fallback={<PageWithSidebarSkeleton />}>
              <BitacorasBuzo />
            </Suspense>
          </ProtectedRoute>
        } />
        
        {/* Reports Routes */}
        <Route path="/reportes" element={
          <ProtectedRoute>
            <Suspense fallback={<PageWithSidebarSkeleton />}>
              <Reportes />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/reportes/avanzados" element={
          <ProtectedRoute>
            <ModuleProtectedRoute 
              requiredModule="advanced_reporting"
              moduleName="Reportes Avanzados"
            >
              <Suspense fallback={<PageWithSidebarSkeleton />}>
                <Reportes />
              </Suspense>
            </ModuleProtectedRoute>
          </ProtectedRoute>
        } />
        
        {/* Integrations Route */}
        <Route path="/integraciones" element={
          <ProtectedRoute>
            <ModuleProtectedRoute 
              requiredModule="external_integrations"
              moduleName="Integraciones Externas"
            >
              <Suspense fallback={<PageWithSidebarSkeleton />}>
                <Configuracion />
              </Suspense>
            </ModuleProtectedRoute>
          </ProtectedRoute>
        } />
        <Route path="/configuracion" element={
          <ProtectedRoute>
            <Suspense fallback={<PageWithSidebarSkeleton />}>
              <Configuracion />
            </Suspense>
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin/roles" element={
          <ProtectedRoute requiredRole="superuser">
            <Suspense fallback={<PageWithSidebarSkeleton />}>
              <AdminRoles />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute>
            <Suspense fallback={<PageWithSidebarSkeleton />}>
              <UserManagement />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/admin/salmonera" element={
          <ProtectedRoute requiredRole="admin_salmonera">
            <Suspense fallback={<PageWithSidebarSkeleton />}>
              <AdminSalmoneraPage />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/admin/alert-rules" element={
          <ProtectedRoute requiredRole="superuser">
            <Suspense fallback={<PageWithSidebarSkeleton />}>
              <AlertRulesAdmin />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/admin/alerts-log" element={
          <ProtectedRoute requiredRole="superuser">
            <Suspense fallback={<PageWithSidebarSkeleton />}>
              <AlertsLog />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/admin/modules" element={
          <ProtectedRoute requiredRole="superuser">
            <Suspense fallback={<PageWithSidebarSkeleton />}>
              <SuperuserModules />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/admin/system-monitoring" element={
          <ProtectedRoute requiredRole="superuser">
            <Suspense fallback={<PageWithSidebarSkeleton />}>
              <SystemMonitoring />
            </Suspense>
          </ProtectedRoute>
        } />

        {/* Buzo Specific Routes */}
        <Route path="/buzo/operaciones" element={
          <ProtectedRoute requiredRole="buzo">
            <Suspense fallback={<PageWithSidebarSkeleton />}>
              <BuzoOperaciones />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/buzo/inmersiones" element={
          <ProtectedRoute requiredRole="buzo">
            <Suspense fallback={<PageWithSidebarSkeleton />}>
              <BuzoInmersiones />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/buzo/reportes" element={
          <ProtectedRoute requiredRole="buzo">
            <Suspense fallback={<PageWithSidebarSkeleton />}>
              <BuzoReportesPage />
            </Suspense>
          </ProtectedRoute>
        } />
        
        {/* Not Found */}
        <Route path="*" element={
          <Suspense fallback={<FullPageLoader />}>
            <NotFound />
          </Suspense>
        } />
      </Routes>
    </BrowserRouter>
  );
};
