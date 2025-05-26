
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/AppSidebar';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/auth/Login';
import PoolUsuarios from '@/pages/PoolUsuarios';
import Salmoneras from '@/pages/empresas/Salmoneras';
import Sitios from '@/pages/empresas/Sitios';
import Contratistas from '@/pages/empresas/Contratistas';
import Operaciones from '@/pages/operaciones/Operaciones';
import Inmersiones from '@/pages/operaciones/Inmersiones';
import BitacorasSupervisor from '@/pages/operaciones/BitacorasSupervisor';
import BitacorasBuzo from '@/pages/operaciones/BitacorasBuzo';
import FormulariosHPT from '@/pages/operaciones/HPT';
import FormulariosAnexoBravo from '@/pages/operaciones/AnexoBravo';
import Reportes from '@/pages/Reportes';
import Configuracion from '@/pages/Configuracion';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route path="/*" element={
              <ProtectedRoute>
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    
                    {/* Pool de Usuarios */}
                    <Route path="/pool-usuarios" element={<PoolUsuarios />} />
                    
                    {/* Admin routes (superuser only) */}
                    <Route path="/admin/salmoneras" element={<Salmoneras />} />
                    <Route path="/admin/contratistas" element={<Contratistas />} />
                    <Route path="/admin/usuarios" element={<PoolUsuarios />} />
                    
                    {/* Empresas */}
                    <Route path="/empresas/salmoneras" element={<Salmoneras />} />
                    <Route path="/empresas/sitios" element={<Sitios />} />
                    <Route path="/empresas/contratistas" element={<Contratistas />} />
                    
                    {/* Operaciones */}
                    <Route path="/operaciones" element={<Operaciones />} />
                    
                    {/* Formularios */}
                    <Route path="/formularios/hpt" element={<FormulariosHPT />} />
                    <Route path="/formularios/anexo-bravo" element={<FormulariosAnexoBravo />} />
                    
                    {/* Inmersiones */}
                    <Route path="/inmersiones" element={<Inmersiones />} />
                    
                    {/* Bitácoras */}
                    <Route path="/bitacoras/supervisor" element={<BitacorasSupervisor />} />
                    <Route path="/bitacoras/buzo" element={<BitacorasBuzo />} />
                    
                    {/* Reportes */}
                    <Route path="/reportes" element={<Reportes />} />
                    
                    {/* Configuración */}
                    <Route path="/configuracion" element={<Configuracion />} />
                  </Routes>
                </AppLayout>
              </ProtectedRoute>
            } />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
