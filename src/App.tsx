
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ModuleProtectedRoute } from "@/components/auth/ModuleProtectedRoute";
import { SidebarProvider } from "@/components/ui/sidebar";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ResetPassword from "@/pages/auth/ForgotPassword";
import Usuarios from "@/pages/Usuarios";
import Salmoneras from "@/pages/empresas/Salmoneras";
import Sitios from "@/pages/empresas/Sitios";
import Contratistas from "@/pages/empresas/Contratistas";
import EmpresasUsuarios from "@/pages/empresas/Usuarios";
import AdminUsers from "@/pages/admin/UserManagement";
import AdminRoles from "@/pages/admin/AdminRoles";
import AdminModules from "@/pages/admin/ModuleManagement";
import SystemMonitoring from "@/pages/admin/SystemMonitoring";
import Configuracion from "@/pages/Configuracion";
import Inmersiones from "@/pages/Inmersiones";
import BitacoraSupervisor from "@/pages/operaciones/BitacorasSupervisor";
import BitacoraBuzo from "@/pages/operaciones/BitacorasBuzo";
import Reportes from "@/pages/Reportes";
import Operaciones from "@/pages/operaciones/Operaciones";
import OperacionesHPT from "@/pages/operaciones/HPT";
import OperacionesAnexoBravo from "@/pages/operaciones/AnexoBravo";
import NetworkMaintenance from "@/pages/operaciones/NetworkMaintenance";
import ProfileSetup from "@/pages/ProfileSetup";
import PersonalDeBuceo from "@/pages/PersonalDeBuceo";
import PersonalPoolAdmin from "@/pages/PersonalPoolAdmin";

import RegisterWithToken from "@/pages/auth/RegisterWithToken";

const queryClient = new QueryClient();

// Component wrapper for protected routes with sidebar
const ProtectedWithSidebar = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  </SidebarProvider>
);

// Component wrapper for module protected routes with sidebar
const ModuleProtectedWithSidebar = ({ children, requiredModule }: { children: React.ReactNode; requiredModule: string }) => (
  <SidebarProvider>
    <ModuleProtectedRoute requiredModule={requiredModule}>
      {children}
    </ModuleProtectedRoute>
  </SidebarProvider>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Auth Routes - SIN SIDEBAR */}
              <Route path="/login" element={<Login />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<RegisterWithToken />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Protected Routes - CON SIDEBAR */}
              <Route path="/" element={<ProtectedWithSidebar><Index /></ProtectedWithSidebar>} />
              
              <Route path="/profile-setup" element={<ProtectedWithSidebar><ProfileSetup /></ProtectedWithSidebar>} />
              <Route path="/personal-de-buceo" element={<ProtectedWithSidebar><PersonalDeBuceo /></ProtectedWithSidebar>} />
              <Route path="/company-personnel" element={<ProtectedWithSidebar><PersonalPoolAdmin /></ProtectedWithSidebar>} />

              {/* Empresas Routes */}
              <Route path="/empresas/salmoneras" element={<ProtectedWithSidebar><Salmoneras /></ProtectedWithSidebar>} />
              <Route path="/empresas/sitios" element={<ProtectedWithSidebar><Sitios /></ProtectedWithSidebar>} />
              <Route path="/empresas/contratistas" element={<ProtectedWithSidebar><Contratistas /></ProtectedWithSidebar>} />
              <Route path="/empresas/usuarios" element={<ProtectedWithSidebar><EmpresasUsuarios /></ProtectedWithSidebar>} />

              {/* Admin Routes */}
              <Route path="/admin/users" element={<ProtectedWithSidebar><AdminUsers /></ProtectedWithSidebar>} />
              <Route path="/admin/roles" element={<ProtectedWithSidebar><AdminRoles /></ProtectedWithSidebar>} />
              <Route path="/admin/modules" element={<ProtectedWithSidebar><AdminModules /></ProtectedWithSidebar>} />
              <Route path="/admin/system-monitoring" element={<ProtectedWithSidebar><SystemMonitoring /></ProtectedWithSidebar>} />

              {/* Configuración Route */}
              <Route path="/configuracion" element={<ProtectedWithSidebar><Configuracion /></ProtectedWithSidebar>} />

              {/* Inmersiones Route */}
              <Route path="/inmersiones" element={<ProtectedWithSidebar><Inmersiones /></ProtectedWithSidebar>} />

              {/* Bitácoras Routes */}
              <Route path="/bitacoras/supervisor" element={<ProtectedWithSidebar><BitacoraSupervisor /></ProtectedWithSidebar>} />
              <Route path="/bitacoras/buzo" element={<ProtectedWithSidebar><BitacoraBuzo /></ProtectedWithSidebar>} />

              {/* Reportes Route */}
              <Route path="/reportes" element={<ProtectedWithSidebar><Reportes /></ProtectedWithSidebar>} />

              {/* Operaciones Routes */}
              <Route path="/operaciones" element={<ModuleProtectedWithSidebar requiredModule="planning_operations"><Operaciones /></ModuleProtectedWithSidebar>} />
              <Route path="/operaciones/hpt" element={<ModuleProtectedWithSidebar requiredModule="planning_operations"><OperacionesHPT /></ModuleProtectedWithSidebar>} />
              <Route path="/operaciones/anexo-bravo" element={<ModuleProtectedWithSidebar requiredModule="planning_operations"><OperacionesAnexoBravo /></ModuleProtectedWithSidebar>} />
              <Route path="/operaciones/network-maintenance" element={<ModuleProtectedWithSidebar requiredModule="maintenance_networks"><NetworkMaintenance /></ModuleProtectedWithSidebar>} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
