
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Operaciones from "./pages/operaciones/Operaciones";
import Inmersiones from "./pages/operaciones/Inmersiones";
import Documentos from "./pages/documentos/Documentos";
import HPT from "./pages/operaciones/HPT";
import AnexoBravo from "./pages/operaciones/AnexoBravo";
import Salmoneras from "./pages/empresas/Salmoneras";
import Contratistas from "./pages/empresas/Contratistas";
import Sitios from "./pages/empresas/Sitios";
import EquipoBuceo from "./pages/EquipoBuceo";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
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
            
            <Route path="/documentos" element={
              <ProtectedRoute>
                <Documentos />
              </ProtectedRoute>
            } />
            
            <Route path="/formularios/hpt" element={
              <ProtectedRoute>
                <HPT />
              </ProtectedRoute>
            } />
            
            <Route path="/formularios/anexo-bravo" element={
              <ProtectedRoute>
                <AnexoBravo />
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
            
            <Route path="/empresas/sitios" element={
              <ProtectedRoute>
                <Sitios />
              </ProtectedRoute>
            } />
            
            <Route path="/equipo-de-buceo" element={
              <ProtectedRoute>
                <EquipoBuceo />
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />

            {/* Redirect old route */}
            <Route path="/personal-pool" element={<Navigate to="/equipo-de-buceo" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
