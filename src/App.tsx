
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Import pages
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Configuracion from "./pages/Configuracion";
import AdminUsers from "./pages/admin/UserManagement";
import AdminRoles from "./pages/admin/AdminRoles";
import AdminModules from "./pages/admin/ModuleManagement";
import SystemMonitoring from "./pages/admin/SystemMonitoring";
import Operaciones from "./pages/operaciones/Operaciones";
import HPT from "./pages/operaciones/HPT";
import AnexoBravo from "./pages/operaciones/AnexoBravo";
import NetworkMaintenance from "./pages/operaciones/NetworkMaintenance";
import Inmersiones from "./pages/Inmersiones";
import BitacorasSupervisor from "./pages/operaciones/BitacorasSupervisor";
import BitacorasBuzo from "./pages/operaciones/BitacorasBuzo";
import Reportes from "./pages/Reportes";
import ReportesOperativos from "./pages/reportes/ReportesOperativos";
import DashboardRol from "./pages/reportes/DashboardRol";
import Comparativas from "./pages/reportes/Comparativas";
import EmpresasSalmoneras from "./pages/empresas/Salmoneras";
import EmpresasSitios from "./pages/empresas/Sitios";
import EmpresasContratistas from "./pages/empresas/Contratistas";
import PersonalDeBuceo from "./pages/PersonalDeBuceo";
import Integraciones from "./pages/integraciones/Integraciones";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    
    {/* Dashboard - Available to all authenticated users */}
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      }
    />
    
    {/* Empresa Management - Role-based access */}
    <Route
      path="/empresas/salmoneras"
      element={
        <ProtectedRoute requiredRole="superuser">
          <EmpresasSalmoneras />
        </ProtectedRoute>
      }
    />
    <Route
      path="/empresas/sitios"
      element={
        <ProtectedRoute>
          <EmpresasSitios />
        </ProtectedRoute>
      }
    />
    <Route
      path="/empresas/contratistas"
      element={
        <ProtectedRoute>
          <EmpresasContratistas />
        </ProtectedRoute>
      }
    />
    
    {/* Personal Management */}
    <Route
      path="/personal-de-buceo"
      element={
        <ProtectedRoute>
          <PersonalDeBuceo />
        </ProtectedRoute>
      }
    />
    
    {/* Operations - Module-dependent */}
    <Route
      path="/operaciones"
      element={
        <ProtectedRoute>
          <Operaciones />
        </ProtectedRoute>
      }
    />
    <Route
      path="/operaciones/hpt"
      element={
        <ProtectedRoute>
          <HPT />
        </ProtectedRoute>
      }
    />
    <Route
      path="/operaciones/anexo-bravo"
      element={
        <ProtectedRoute>
          <AnexoBravo />
        </ProtectedRoute>
      }
    />
    <Route
      path="/operaciones/network-maintenance"
      element={
        <ProtectedRoute>
          <NetworkMaintenance />
        </ProtectedRoute>
      }
    />

    {/* Immersions - Core functionality */}
    <Route
      path="/inmersiones"
      element={
        <ProtectedRoute>
          <Inmersiones />
        </ProtectedRoute>
      }
    />
    
    {/* Bitacoras - Role-based */}
    <Route
      path="/bitacoras/supervisor"
      element={
        <ProtectedRoute>
          <BitacorasSupervisor />
        </ProtectedRoute>
      }
    />
    <Route
      path="/bitacoras/buzo"
      element={
        <ProtectedRoute>
          <BitacorasBuzo />
        </ProtectedRoute>
      }
    />

    {/* Reports */}
    <Route
      path="/reportes"
      element={
        <ProtectedRoute>
          <Reportes />
        </ProtectedRoute>
      }
    />
    <Route
      path="/reportes/operativos"
      element={
        <ProtectedRoute>
          <ReportesOperativos />
        </ProtectedRoute>
      }
    />
    <Route
      path="/reportes/dashboard-rol"
      element={
        <ProtectedRoute>
          <DashboardRol />
        </ProtectedRoute>
      }
    />
    <Route
      path="/reportes/comparativas"
      element={
        <ProtectedRoute>
          <Comparativas />
        </ProtectedRoute>
      }
    />

    {/* Configuration */}
    <Route
      path="/configuracion"
      element={
        <ProtectedRoute>
          <Configuracion />
        </ProtectedRoute>
      }
    />

    {/* Admin Routes - Superuser only */}
    <Route
      path="/admin/users"
      element={
        <ProtectedRoute requiredRole="superuser">
          <AdminUsers />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/roles"
      element={
        <ProtectedRoute requiredRole="superuser">
          <AdminRoles />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/modules"
      element={
        <ProtectedRoute requiredRole="superuser">
          <AdminModules />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/system-monitoring"
      element={
        <ProtectedRoute requiredRole="superuser">
          <SystemMonitoring />
        </ProtectedRoute>
      }
    />

    {/* Integrations */}
    <Route
      path="/integraciones"
      element={
        <ProtectedRoute>
          <Integraciones />
        </ProtectedRoute>
      }
    />
  </Routes>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
