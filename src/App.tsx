import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './hooks/useAuth';
import { SidebarProvider } from './hooks/useSidebar';
import { AppSidebar } from './components/AppSidebar';
import { Toaster } from '@/components/ui/toaster';

import Dashboard from './pages/Dashboard';
import ProfileSetup from './pages/ProfileSetup';
import EquipoDeBuceo from './pages/EquipoDeBuceo';
import Operaciones from './pages/Operaciones';
import FormulariosHPT from './pages/FormulariosHPT';
import FormulariosAnexoBravo from './pages/FormulariosAnexoBravo';
import Inmersiones from './pages/Inmersiones';
import BitacorasSupervisor from './pages/BitacorasSupervisor';
import BitacorasBuzo from './pages/BitacorasBuzo';
import Reportes from './pages/Reportes';
import EmpresasSalmoneras from './pages/EmpresasSalmoneras';
import EmpresasSitios from './pages/EmpresasSitios';
import EmpresasContratistas from './pages/EmpresasContratistas';
import Configuracion from './pages/Configuracion';
import AdminAlertRules from './pages/AdminAlertRules';
import AdminAlertsLog from './pages/AdminAlertsLog';
import PersonalPoolAdmin from './pages/PersonalPoolAdmin';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoles from "@/pages/admin/AdminRoles";
import AdminUsers from "@/pages/admin/AdminUsers";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <SidebarProvider>
            <Toaster />
            <div className="flex h-screen bg-gray-50">
              <AppSidebar />
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
                  <Route path="/equipo-de-buceo" element={<ProtectedRoute><EquipoDeBuceo /></ProtectedRoute>} />
                  <Route path="/operaciones" element={<ProtectedRoute><Operaciones /></ProtectedRoute>} />
                  <Route path="/formularios/hpt" element={<ProtectedRoute><FormulariosHPT /></ProtectedRoute>} />
                  <Route path="/formularios/anexo-bravo" element={<ProtectedRoute><FormulariosAnexoBravo /></ProtectedRoute>} />
                  <Route path="/inmersiones" element={<ProtectedRoute><Inmersiones /></ProtectedRoute>} />
                  <Route path="/bitacoras/supervisor" element={<ProtectedRoute><BitacorasSupervisor /></ProtectedRoute>} />
                  <Route path="/bitacoras/buzo" element={<ProtectedRoute><BitacorasBuzo /></ProtectedRoute>} />
                  <Route path="/reportes" element={<ProtectedRoute><Reportes /></ProtectedRoute>} />
                  <Route path="/empresas/salmoneras" element={<ProtectedRoute><EmpresasSalmoneras /></ProtectedRoute>} />
                  <Route path="/empresas/sitios" element={<ProtectedRoute><EmpresasSitios /></ProtectedRoute>} />
                  <Route path="/empresas/contratistas" element={<ProtectedRoute><EmpresasContratistas /></ProtectedRoute>} />
                  <Route path="/configuracion" element={<ProtectedRoute><Configuracion /></ProtectedRoute>} />
                  <Route path="/admin/alert-rules" element={<ProtectedRoute><AdminAlertRules /></ProtectedRoute>} />
                  <Route path="/admin/alerts-log" element={<ProtectedRoute><AdminAlertsLog /></ProtectedRoute>} />
                  <Route path="/admin/salmonera" element={<ProtectedRoute><PersonalPoolAdmin /></ProtectedRoute>} />
                  
                  {/* Admin routes */}
                  <Route path="/admin/roles" element={
                    <ProtectedRoute>
                      <AdminRoles />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <ProtectedRoute>
                      <AdminUsers />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
            </div>
          </SidebarProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
