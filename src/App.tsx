import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ModularSidebar } from '@/components/navigation/ModularSidebar';
import Dashboard from '@/pages/Dashboard';
import ProfileSetup from '@/pages/ProfileSetup';
import Operaciones from '@/pages/Operaciones';
import Inmersiones from '@/pages/Inmersiones';
import Salmoneras from '@/pages/Salmoneras';
import Contratistas from '@/pages/Contratistas';
import Centros from '@/pages/Centros';
import Usuarios from '@/pages/Usuarios';
import Roles from '@/pages/Roles';
import Modules from '@/pages/Modules';
import SystemMonitoring from '@/pages/SystemMonitoring';
import Reportes from '@/pages/Reportes';
import Configuracion from '@/pages/Configuracion';
import CuadrillasDeBuceo from '@/pages/CuadrillasDeBuceo';
import BitacorasSupervisor from '@/pages/bitacoras/BitacorasSupervisor';
import BitacorasBuzo from '@/pages/bitacoras/BitacorasBuzo';
import ModuleManagement from '@/pages/admin/ModuleManagement';
import Notifications from '@/pages/admin/Notifications';
import PersonalPoolAdmin from '@/pages/PersonalPoolAdmin';
import GlobalUserManagement from '@/pages/admin/GlobalUserManagement';
import CompanyPersonnel from '@/pages/empresas/CompanyPersonnel';
import SalmonerasAdmin from '@/pages/empresas/SalmonerasAdmin';
import Integraciones from '@/pages/Integraciones';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <TooltipProvider>
        <Router>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <ModularSidebar />
              <main className="flex-1 bg-gray-50">
                <div className="border-b bg-white">
                  <SidebarTrigger className="ml-4 mt-4" />
                </div>
                <Routes>
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile-setup" element={<ProfileSetup />} />
                  <Route path="/operaciones" element={
                    <ProtectedRoute>
                      <Operaciones />
                    </ProtectedRoute>
                  } />
                  <Route path="/inmersiones" element={
                    <ProtectedRoute>
                      <Inmersiones />
                    </ProtectedRoute>
                  } />
                  <Route path="/empresas/salmoneras" element={
                    <ProtectedRoute>
                      <Salmoneras />
                    </ProtectedRoute>
                  } />
                  <Route path="/empresas/contratistas" element={
                    <ProtectedRoute>
                      <Contratistas />
                    </ProtectedRoute>
                  } />
                  <Route path="/empresas/centros" element={
                    <ProtectedRoute>
                      <Centros />
                    </ProtectedRoute>
                  } />
                  <Route path="/empresas/usuarios" element={
                    <ProtectedRoute>
                      <Usuarios />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <ProtectedRoute>
                      <GlobalUserManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/roles" element={
                    <ProtectedRoute>
                      <Roles />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/modules" element={
                    <ProtectedRoute>
                      <Modules />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/system-monitoring" element={
                    <ProtectedRoute>
                      <SystemMonitoring />
                    </ProtectedRoute>
                  } />
                  <Route path="/reportes" element={
                    <ProtectedRoute>
                      <Reportes />
                    </ProtectedRoute>
                  } />
                  <Route path="/configuracion" element={
                    <ProtectedRoute>
                      <Configuracion />
                    </ProtectedRoute>
                  } />
                  <Route path="/cuadrillas-de-buceo" element={
                    <ProtectedRoute>
                      <CuadrillasDeBuceo />
                    </ProtectedRoute>
                  } />
                  
                  {/* Rutas optimizadas de Bitácoras */}
                  <Route path="/bitacoras/supervisor" element={
                    <ProtectedRoute>
                      <BitacorasSupervisor />
                    </ProtectedRoute>
                  } />
                  <Route path="/bitacoras/buzo" element={
                    <ProtectedRoute>
                      <BitacorasBuzo />
                    </ProtectedRoute>
                  } />
                  
                  {/* Legacy routes - mantener compatibilidad */}
                  <Route path="/operaciones/bitacoras-supervisor" element={
                    <Navigate to="/bitacoras/supervisor" replace />
                  } />
                  <Route path="/operaciones/bitacoras-buzo" element={
                    <Navigate to="/bitacoras/buzo" replace />
                  } />

                  <Route path="/admin/module-management" element={
                    <ProtectedRoute>
                      <ModuleManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/notifications" element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  } />
                  <Route path="/company-personnel" element={
                    <ProtectedRoute>
                      <PersonalPoolAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/empresas/salmoneras" element={
                    <ProtectedRoute>
                      <SalmonerasAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/integraciones" element={
                    <ProtectedRoute>
                      <Integraciones />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
            </div>
          </SidebarProvider>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
