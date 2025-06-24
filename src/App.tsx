
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/useAuth';
import { SidebarProvider } from './hooks/useSidebar';
import { AppSidebar } from './components/AppSidebar';
import { Toaster } from '@/components/ui/toaster';

// Import existing pages
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import AdminRoles from "@/pages/admin/AdminRoles";
import AdminUsers from "@/pages/admin/AdminUsers";

// Create basic page components for missing pages
const Dashboard = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Dashboard</h1>
    <p>Panel principal del sistema</p>
  </div>
);

const ProfileSetup = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Configuración de Perfil</h1>
    <p>Configurar perfil de usuario</p>
  </div>
);

const EquipoDeBuceo = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Equipo de Buceo</h1>
    <p>Gestión de equipos de buceo</p>
  </div>
);

const Operaciones = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Operaciones</h1>
    <p>Gestión de operaciones de buceo</p>
  </div>
);

const FormulariosHPT = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Formularios HPT</h1>
    <p>Gestión de formularios HPT</p>
  </div>
);

const FormulariosAnexoBravo = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Formularios Anexo Bravo</h1>
    <p>Gestión de formularios Anexo Bravo</p>
  </div>
);

const Inmersiones = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Inmersiones</h1>
    <p>Registro de inmersiones</p>
  </div>
);

const BitacorasSupervisor = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Bitácoras de Supervisor</h1>
    <p>Bitácoras del supervisor</p>
  </div>
);

const BitacorasBuzo = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Bitácoras de Buzo</h1>
    <p>Bitácoras del buzo</p>
  </div>
);

const Reportes = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Reportes</h1>
    <p>Generación de reportes</p>
  </div>
);

const EmpresasSalmoneras = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Empresas Salmoneras</h1>
    <p>Gestión de empresas salmoneras</p>
  </div>
);

const EmpresasSitios = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Sitios</h1>
    <p>Gestión de sitios</p>
  </div>
);

const EmpresasContratistas = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Empresas Contratistas</h1>
    <p>Gestión de empresas contratistas</p>
  </div>
);

const Configuracion = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Configuración</h1>
    <p>Configuración del sistema</p>
  </div>
);

const AdminAlertRules = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Reglas de Alertas</h1>
    <p>Gestión de reglas de alertas</p>
  </div>
);

const AdminAlertsLog = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Log de Alertas</h1>
    <p>Registro de alertas del sistema</p>
  </div>
);

const PersonalPoolAdmin = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Personal Pool Admin</h1>
    <p>Administración de personal</p>
  </div>
);

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
