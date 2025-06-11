
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Salmoneras from "./pages/empresas/Salmoneras";
import Sitios from "./pages/empresas/Sitios";
import Contratistas from "./pages/empresas/Contratistas";
import EquipoBuceo from "./pages/EquipoBuceo";
import Operaciones from "./pages/operaciones/Operaciones";
import HPT from "./pages/operaciones/HPT";
import AnexoBravo from "./pages/operaciones/AnexoBravo";
import Inmersiones from "./pages/operaciones/Inmersiones";
import BitacorasSupervisor from "./pages/operaciones/BitacorasSupervisor";
import BitacorasBuzo from "./pages/operaciones/BitacorasBuzo";
import HPTFormularios from "./pages/formularios/HPTFormularios";
import AnexoBravoFormularios from "./pages/formularios/AnexoBravoFormularios";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import EmailConfirmation from "./pages/auth/EmailConfirmation";
import ProfileSetup from "./pages/auth/ProfileSetup";
import AuthCallback from "./pages/auth/AuthCallback";
import Onboarding from "./pages/Onboarding";
import BuzoOnboardingPage from "./pages/BuzoOnboardingPage";
import Reportes from "./pages/Reportes";
import Configuracion from "./pages/Configuracion";
import AdminRoles from "./pages/admin/AdminRoles";
import AdminSalmoneraPage from "./pages/admin/AdminSalmoneraPage";
import UserManagement from "./pages/admin/UserManagement";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/email-confirmation" element={<EmailConfirmation />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } />
            <Route path="/buzo-onboarding" element={
              <ProtectedRoute>
                <BuzoOnboardingPage />
              </ProtectedRoute>
            } />
            <Route path="/profile-setup" element={
              <ProtectedRoute>
                <ProfileSetup />
              </ProtectedRoute>
            } />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            
            <Route path="/empresas/salmoneras" element={
              <ProtectedRoute requiredRole="superuser">
                <Salmoneras />
              </ProtectedRoute>
            } />
            
            <Route path="/empresas/sitios" element={
              <ProtectedRoute>
                <Sitios />
              </ProtectedRoute>
            } />
            
            <Route path="/empresas/contratistas" element={
              <ProtectedRoute>
                <Contratistas />
              </ProtectedRoute>
            } />
            
            <Route path="/equipo-de-buceo" element={
              <ProtectedRoute>
                <EquipoBuceo />
              </ProtectedRoute>
            } />
            
            <Route path="/operaciones" element={
              <ProtectedRoute>
                <Operaciones />
              </ProtectedRoute>
            } />
            
            <Route path="/formularios/hpt" element={
              <ProtectedRoute>
                <HPTFormularios />
              </ProtectedRoute>
            } />
            
            <Route path="/formularios/anexo-bravo" element={
              <ProtectedRoute>
                <AnexoBravoFormularios />
              </ProtectedRoute>
            } />
            
            <Route path="/operaciones/hpt" element={
              <ProtectedRoute>
                <HPT />
              </ProtectedRoute>
            } />
            
            <Route path="/operaciones/anexo-bravo" element={
              <ProtectedRoute>
                <AnexoBravo />
              </ProtectedRoute>
            } />
            
            <Route path="/inmersiones" element={
              <ProtectedRoute>
                <Inmersiones />
              </ProtectedRoute>
            } />
            
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
            
            <Route path="/admin/roles" element={
              <ProtectedRoute requiredRole="superuser">
                <AdminRoles />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/users" element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/salmonera" element={
              <ProtectedRoute requiredRole="admin_salmonera">
                <AdminSalmoneraPage />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
