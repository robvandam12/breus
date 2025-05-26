
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Index from "./pages/Index";
import Salmoneras from "./pages/empresas/Salmoneras";
import Sitios from "./pages/empresas/Sitios";
import Contratistas from "./pages/empresas/Contratistas";
import EquiposBuceo from "./pages/equipos-buceo/EquiposBuceo";
import Operaciones from "./pages/operaciones/Operaciones";
import HPT from "./pages/operaciones/HPT";
import AnexoBravo from "./pages/operaciones/AnexoBravo";
import Inmersiones from "./pages/operaciones/Inmersiones";
import BitacorasSupervisor from "./pages/operaciones/BitacorasSupervisor";
import BitacorasBuzo from "./pages/operaciones/BitacorasBuzo";
import Reportes from "./pages/Reportes";
import Configuracion from "./pages/configuracion/Configuracion";
import AdminUsuarios from "./pages/admin/Usuarios";
import PersonalPool from "./pages/PersonalPool";
import Login from "./pages/auth/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/empresas/salmoneras"
              element={
                <ProtectedRoute requiredRole="superuser">
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
              path="/pool-personal"
              element={
                <ProtectedRoute>
                  <PersonalPool />
                </ProtectedRoute>
              }
            />
            <Route
              path="/equipos-buceo"
              element={
                <ProtectedRoute>
                  <EquiposBuceo />
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
              path="/admin/usuarios"
              element={
                <ProtectedRoute requiredRole="superuser">
                  <AdminUsuarios />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
