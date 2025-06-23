
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { SimpleProtectedRoute } from "@/components/auth/SimpleProtectedRoute";

// Import pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Configuracion from "./pages/Configuracion";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminRoles from "./pages/admin/AdminRoles";
import AdminModules from "./pages/admin/AdminModules";
import SystemMonitoring from "./pages/admin/SystemMonitoring";
import Operaciones from "./pages/operaciones/Operaciones";
import PlanificarOperaciones from "./pages/operaciones/PlanificarOperaciones";
import HPT from "./pages/operaciones/HPT";
import AnexoBravo from "./pages/operaciones/AnexoBravo";
import NetworkMaintenance from "./pages/operaciones/NetworkMaintenance";
import Inmersiones from "./pages/Inmersiones";
import BitacorasSupervisor from "./pages/bitacoras/BitacorasSupervisor";
import BitacorasBuzo from "./pages/bitacoras/BitacorasBuzo";
import Reportes from "./pages/Reportes";
import ReportesOperativos from "./pages/reportes/ReportesOperativos";
import DashboardRol from "./pages/reportes/DashboardRol";
import Comparativas from "./pages/reportes/Comparativas";
import EmpresasSalmoneras from "./pages/empresas/EmpresasSalmoneras";
import EmpresasSitios from "./pages/empresas/EmpresasSitios";
import EmpresasContratistas from "./pages/empresas/EmpresasContratistas";
import EquipoDeBuceo from "./pages/EquipoDeBuceo";
import Integraciones from "./pages/Integraciones";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route
      path="/"
      element={
        <SimpleProtectedRoute>
          <Index />
        </SimpleProtectedRoute>
      }
    />
    <Route
      path="/configuracion"
      element={
        <SimpleProtectedRoute>
          <Configuracion />
        </SimpleProtectedRoute>
      }
    />
    <Route
      path="/admin/users"
      element={
        <SimpleProtectedRoute>
          <AdminUsers />
        </SimpleProtectedRoute>
      }
    />
    <Route
      path="/admin/roles"
      element={
        <SimpleProtectedRoute>
          <AdminRoles />
        </SimpleProtectedRoute>
      }
    />
    <Route
      path="/admin/modules"
      element={
        <SimpleProtectedRoute>
          <AdminModules />
        </SimpleProtectedRoute>
      }
    />
    <Route
      path="/admin/system-monitoring"
      element={
        <SimpleProtectedRoute>
          <SystemMonitoring />
        </SimpleProtectedRoute>
      }
    />
    <Route
      path="/operaciones"
      element={
        <SimpleProtectedRoute>
          <Operaciones />
        </SimpleProtectedRoute>
      }
    />
    <Route
      path="/operaciones/planificar"
      element={
        <SimpleProtectedRoute>
          <PlanificarOperaciones />
        </SimpleProtectedRoute>
      }
    />
    <Route
      path="/operaciones/hpt"
      element={
        <SimpleProtectedRoute>
          <HPT />
        </SimpleProtectedRoute>
      }
    />
    <Route
      path="/operaciones/anexo-bravo"
      element={
        <SimpleProtectedRoute>
          <AnexoBravo />
        </SimpleProtectedRoute>
      }
    />
    <Route
      path="/operaciones/network-maintenance"
      element={
        <SimpleProtectedRoute>
          <NetworkMaintenance />
        </SimpleProtectedRoute>
      }
    />
    <Route
      path="/inmersiones"
      element={
        <SimpleProtectedRoute>
          <Inmersiones />
        </SimpleProtectedRoute>
      }
    />
    <Route
      path="/bitacoras/supervisor"
      element={
        <SimpleProtectedRoute>
          <BitacorasSupervisor />
        </SimpleProtectedRoute>
      }
    />
    <Route
      path="/bitacoras/buzo"
      element={
        <SimpleProtectedRoute>
          <BitacorasBuzo />
        </SimpleProtectedRoute>
      }
    />
    <Route
      path="/reportes"
      element={
        <SimpleProtectedRoute>
          <Reportes />
        </SimpleProtectedRoute>
      }
    />
    <Route
      path="/reportes/operativos"
      element={
        <SimpleProtectedRoute>
          <ReportesOperativos />
        </SimpleProtectedRoute>
      }
    />
    <Route
      path="/reportes/dashboard-rol"
      element={
        <SimpleProtectedRoute>
          <DashboardRol />
        </SimpleProtectedRoute>
      }
    />
    <Route
      path="/reportes/comparativas"
      element={
        <SimpleProtectedRoute>
          <Comparativas />
        </SimpleProtectedRoute>
      }
    />
    <Route
      path="/empresas/salmoneras"
      element={
        <SimpleProtectedRoute>
          <EmpresasSalmoneras />
        </SimpleProtectedRoute>
      }
    />
    <Route
      path="/empresas/sitios"
      element={
        <SimpleProtectedRoute>
          <EmpresasSitios />
        </SimpleProtectedRoute>
      }
    />
    <Route
      path="/empresas/contratistas"
      element={
        <SimpleProtectedRoute>
          <EmpresasContratistas />
        </SimpleProtectedRoute>
      }
    />
    <Route
      path="/equipo-de-buceo"
      element={
        <SimpleProtectedRoute>
          <EquipoDeBuceo />
        </SimpleProtectedRoute>
      }
    />
    <Route
      path="/integraciones"
      element={
        <SimpleProtectedRoute>
          <Integraciones />
        </SimpleProtectedRoute>
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
