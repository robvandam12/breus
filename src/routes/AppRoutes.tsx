
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
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
const Salmoneras = lazy(() => import("../pages/empresas/Salmoneras"));
const Sitios = lazy(() => import("../pages/empresas/Sitios"));
const Contratistas = lazy(() => import("../pages/empresas/Contratistas"));
const EquipoBuceo = lazy(() => import("../pages/EquipoBuceo"));
const Operaciones = lazy(() => import("../pages/operaciones/Operaciones"));
const HPT = lazy(() => import("../pages/operaciones/HPT"));
const AnexoBravo = lazy(() => import("../pages/operaciones/AnexoBravo"));
const NetworkMaintenance = lazy(() => import("../pages/operaciones/NetworkMaintenance"));
const Inmersiones = lazy(() => import("../pages/Inmersiones"));
const BitacorasSupervisor = lazy(() => import("../pages/operaciones/BitacorasSupervisor"));
const BitacorasBuzo = lazy(() => import("../pages/operaciones/BitacorasBuzo"));
const HPTFormularios = lazy(() => import("../pages/formularios/HPTFormularios"));
const AnexoBravoFormularios = lazy(() => import("../pages/formularios/AnexoBravoFormularios"));
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

export const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Auth Routes - No protection needed */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/email-confirmation" element={<EmailConfirmation />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

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
      
      {/* Equipment Routes */}
      <Route path="/equipo-de-buceo" element={
        <ProtectedRoute>
          <Suspense fallback={<PageWithSidebarSkeleton />}>
            <EquipoBuceo />
          </Suspense>
        </ProtectedRoute>
      } />
      
      {/* Operations Routes */}
      <Route path="/operaciones" element={
        <ProtectedRoute>
          <Suspense fallback={<PageWithSidebarSkeleton />}>
            <Operaciones />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/operaciones/planificar" element={
        <ProtectedRoute>
          <Suspense fallback={<PageWithSidebarSkeleton />}>
            <Operaciones />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/operaciones/hpt" element={
        <ProtectedRoute>
          <Suspense fallback={<PageWithSidebarSkeleton />}>
            <HPT />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/operaciones/anexo-bravo" element={
        <ProtectedRoute>
          <Suspense fallback={<PageWithSidebarSkeleton />}>
            <AnexoBravo />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/operaciones/network-maintenance" element={
        <ProtectedRoute>
          <Suspense fallback={<PageWithSidebarSkeleton />}>
            <NetworkMaintenance />
          </Suspense>
        </ProtectedRoute>
      } />

      {/* Immersions Route */}
      <Route path="/inmersiones" element={
        <ProtectedRoute>
          <Suspense fallback={<PageWithSidebarSkeleton />}>
            <Inmersiones />
          </Suspense>
        </ProtectedRoute>
      } />
      
      {/* Bitacoras Routes */}
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

      {/* Forms Routes */}
      <Route path="/formularios/hpt" element={
        <ProtectedRoute>
          <Suspense fallback={<PageWithSidebarSkeleton />}>
            <HPTFormularios />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/formularios/anexo-bravo" element={
        <ProtectedRoute>
          <Suspense fallback={<PageWithSidebarSkeleton />}>
            <AnexoBravoFormularios />
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
          <Suspense fallback={<PageWithSidebarSkeleton />}>
            <Reportes />
          </Suspense>
        </ProtectedRoute>
      } />
      
      {/* Integrations Route */}
      <Route path="/integraciones" element={
        <ProtectedRoute>
          <Suspense fallback={<PageWithSidebarSkeleton />}>
            <Configuracion />
          </Suspense>
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
