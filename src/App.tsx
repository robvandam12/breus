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
import Index from "@/pages";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ResetPassword from "@/pages/auth/ResetPassword";
import AcceptInvitation from "@/pages/auth/AcceptInvitation";
import Usuarios from "@/pages/Usuarios";
import Salmoneras from "@/pages/empresas/Salmoneras";
import Sitios from "@/pages/empresas/Sitios";
import Contratistas from "@/pages/empresas/Contratistas";
import EmpresasUsuarios from "@/pages/empresas/Usuarios";
import AdminUsers from "@/pages/admin/UserManagement";
import AdminRoles from "@/pages/admin/RoleManagement";
import AdminModules from "@/pages/admin/ModuleManagement";
import SystemMonitoring from "@/pages/admin/SystemMonitoring";
import Configuracion from "@/pages/Configuracion";
import Inmersiones from "@/pages/Inmersiones";
import BitacoraSupervisor from "@/pages/bitacoras/BitacoraSupervisor";
import BitacoraBuzo from "@/pages/bitacoras/BitacoraBuzo";
import Reportes from "@/pages/Reportes";
import Operaciones from "@/pages/Operaciones";
import OperacionesHPT from "@/pages/operaciones/HPT";
import OperacionesAnexoBravo from "@/pages/operaciones/AnexoBravo";
import NetworkMaintenance from "@/pages/operaciones/NetworkMaintenance";
import ProfileSetup from "@/pages/ProfileSetup";
import PersonalDeBuceo from "@/pages/PersonalDeBuceo";
import PersonalPoolAdmin from "@/pages/PersonalPoolAdmin";

import RegisterWithToken from "@/pages/auth/RegisterWithToken";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <SidebarProvider>
              <Routes>
                {/* Auth Routes */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<RegisterWithToken />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/auth/accept-invitation" element={<AcceptInvitation />} />
                
                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                
                <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
                <Route path="/personal-de-buceo" element={<ProtectedRoute><PersonalDeBuceo /></ProtectedRoute>} />
                <Route path="/company-personnel" element={<ProtectedRoute><PersonalPoolAdmin /></ProtectedRoute>} />

                {/* Empresas Routes */}
                <Route path="/empresas/salmoneras" element={<ProtectedRoute><Salmoneras /></ProtectedRoute>} />
                <Route path="/empresas/sitios" element={<ProtectedRoute><Sitios /></ProtectedRoute>} />
                <Route path="/empresas/contratistas" element={<ProtectedRoute><Contratistas /></ProtectedRoute>} />
                <Route path="/empresas/usuarios" element={<ProtectedRoute><EmpresasUsuarios /></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
                <Route path="/admin/roles" element={<ProtectedRoute><AdminRoles /></ProtectedRoute>} />
                <Route path="/admin/modules" element={<ProtectedRoute><AdminModules /></ProtectedRoute>} />
                <Route path="/admin/system-monitoring" element={<ProtectedRoute><SystemMonitoring /></ProtectedRoute>} />

                {/* Configuración Route */}
                <Route path="/configuracion" element={<ProtectedRoute><Configuracion /></ProtectedRoute>} />

                {/* Inmersiones Route */}
                <Route path="/inmersiones" element={<ProtectedRoute><Inmersiones /></ProtectedRoute>} />

                {/* Bitácoras Routes */}
                <Route path="/bitacoras/supervisor" element={<ProtectedRoute><BitacoraSupervisor /></ProtectedRoute>} />
                <Route path="/bitacoras/buzo" element={<ProtectedRoute><BitacoraBuzo /></ProtectedRoute>} />

                {/* Reportes Route */}
                <Route path="/reportes" element={<ProtectedRoute><Reportes /></ProtectedRoute>} />

                {/* Operaciones Routes */}
                 <Route path="/operaciones" element={<ModuleProtectedRoute module="planning_operations"><Operaciones /></ModuleProtectedRoute>} />
                <Route path="/operaciones/hpt" element={<ModuleProtectedRoute module="planning_operations"><OperacionesHPT /></ModuleProtectedRoute>} />
                <Route path="/operaciones/anexo-bravo" element={<ModuleProtectedRoute module="planning_operations"><OperacionesAnexoBravo /></ModuleProtectedRoute>} />
                 <Route path="/operaciones/network-maintenance" element={<ModuleProtectedRoute module="maintenance_networks"><NetworkMaintenance /></ModuleProtectedRoute>} />
              </Routes>
            </SidebarProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
