
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthRouteWrapper } from "@/components/auth/AuthRouteWrapper";
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

const FullPageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner text="Cargando página..." />
  </div>
);

export const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Auth Routes with AuthRouteWrapper */}
      <Route path="/login" element={
        <AuthRouteWrapper>
          <Login />
        </AuthRouteWrapper>
      } />
      <Route path="/register" element={
        <AuthRouteWrapper>
          <Register />
        </AuthRouteWrapper>
      } />
      <Route path="/forgot-password" element={
        <AuthRouteWrapper>
          <ForgotPassword />
        </AuthRouteWrapper>
      } />
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
      
      {/* Core Protected Routes */}
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
      
      {/* Equipo Routes */}
      <Route path="/equipo-de-buceo" element={
        <ProtectedRoute>
          <Suspense fallback={<PageWithSidebarSkeleton />}>
            <EquipoBuceo />
          </Suspense>
        </ProtectedRoute>
      } />
      
      {/* Operaciones Routes */}
      <Route path="/operaciones" element={
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

      {/* Formularios Routes */}
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
      
      {/* Other Protected Routes */}
      <Route path="/reportes" element={
        <ProtectedRoute>
          <Suspense fallback={<PageWithSidebarSkeleton />}>
            <Reportes />
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

      {/* Rutas específicas para buzos */}
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
