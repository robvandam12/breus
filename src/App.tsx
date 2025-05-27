
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Suspense, lazy } from "react";
import { ThemeProvider } from "next-themes";

// Lazy load components
const Dashboard = lazy(() => import("@/components/Dashboard").then(module => ({ default: module.Dashboard })));
const LoginForm = lazy(() => import("@/components/auth/LoginForm").then(module => ({ default: module.LoginForm })));

// Pages
const Operaciones = lazy(() => import("@/pages/operaciones/Operaciones"));
const OperacionesAnexoBravo = lazy(() => import("@/pages/operaciones/AnexoBravo"));
const Inmersiones = lazy(() => import("@/pages/operaciones/Inmersiones"));
const BitacorasSupervisor = lazy(() => import("@/pages/operaciones/BitacorasSupervisor"));
const BitacorasBuzo = lazy(() => import("@/pages/operaciones/BitacorasBuzo"));

// Empresas
const Salmoneras = lazy(() => import("@/pages/empresas/Salmoneras"));
const Sitios = lazy(() => import("@/pages/empresas/Sitios"));
const Contratistas = lazy(() => import("@/pages/empresas/Contratistas"));

// Formularios
const HPT = lazy(() => import("@/pages/formularios/HPT"));
const AnexoBravo = lazy(() => import("@/pages/formularios/AnexoBravo"));

// Admin
const UserManagement = lazy(() => import("@/pages/admin/UserManagement"));

// Reportes
const Reportes = lazy(() => import("@/pages/Reportes"));

// Configuración
const Configuracion = lazy(() => import("@/pages/Configuracion"));

// Equipo de Buceo
const EquipoBuceo = lazy(() => import("@/pages/equipos/EquipoBuceo"));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/login" element={<LoginForm />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/operaciones"
                    element={
                      <ProtectedRoute>
                        <Operaciones />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/operaciones/anexo-bravo"
                    element={
                      <ProtectedRoute>
                        <OperacionesAnexoBravo />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/inmersiones"
                    element={
                      <ProtectedRoute>
                        <Inmersiones />
                      </ProtectedRoute>
                    }
                  />
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
                  <Route
                    path="/empresas/salmoneras"
                    element={
                      <ProtectedRoute>
                        <Salmoneras />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/empresas/sitios"
                    element={
                      <ProtectedRoute>
                        <Sitios />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/empresas/contratistas"
                    element={
                      <ProtectedRoute>
                        <Contratistas />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/formularios/hpt"
                    element={
                      <ProtectedRoute>
                        <HPT />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/formularios/anexo-bravo"
                    element={
                      <ProtectedRoute>
                        <AnexoBravo />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute requiredRole="superuser">
                        <UserManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/reportes"
                    element={
                      <ProtectedRoute>
                        <Reportes />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/configuracion"
                    element={
                      <ProtectedRoute>
                        <Configuracion />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/equipo-de-buceo"
                    element={
                      <ProtectedRoute>
                        <EquipoBuceo />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Suspense>
            </div>
            <Toaster />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
