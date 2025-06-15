
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import Index from "@/pages/Index";
import HPT from "@/pages/formularios/HPT";
import AnexoBravo from "@/pages/formularios/AnexoBravo";
import HPTFormularios from "@/pages/formularios/HPTFormularios";
import AnexoBravoFormularios from "@/pages/formularios/AnexoBravoFormularios";
import { AuthLayout } from "@/pages/auth/AuthLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import ProfileSetup from "@/pages/ProfileSetup";
import Onboarding from "@/pages/Onboarding";
import BuzoOnboardingPage from "@/pages/BuzoOnboardingPage";
import EquipoBuceo from "@/pages/EquipoBuceo";
import PersonalPool from "@/pages/PersonalPool";
import PersonalPoolAdmin from "@/pages/PersonalPoolAdmin";
import Inmersiones from "@/pages/Inmersiones";
import Operaciones from "@/pages/operaciones/Operaciones";
import Reportes from "@/pages/Reportes";
import Configuracion from "@/pages/Configuracion";
import Usuarios from "@/pages/Usuarios";
import NotFound from "@/pages/NotFound";
import MultiX from "@/pages/formularios/MultiX";
import { useAuth } from "@/hooks/useAuth";

export const AppRoutes = () => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const authPages = ['/login', '/register', '/auth/forgot-password'];
  const isAuthPage = authPages.includes(location.pathname);

  // Componente para rutas de autenticación que redirigen si ya está autenticado
  const AuthRoute = ({ children }: { children: JSX.Element }) => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (user) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <Routes>
      {/* Auth routes - redirigen al dashboard si ya está autenticado */}
      <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
      <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
      <Route path="/auth/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>} />
      <Route path="/auth/*" element={
        <AuthLayout title="Autenticación">
          <Routes>
            <Route path="/*" element={<div>Auth routes placeholder</div>} />
          </Routes>
        </AuthLayout>
      } />
      
      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/inmersiones" element={<ProtectedRoute><Inmersiones /></ProtectedRoute>} />
      <Route path="/operaciones" element={<ProtectedRoute><Operaciones /></ProtectedRoute>} />
      <Route path="/reportes" element={<ProtectedRoute><Reportes /></ProtectedRoute>} />
      <Route path="/configuracion" element={<ProtectedRoute><Configuracion /></ProtectedRoute>} />
      <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
      <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/buzo-onboarding" element={<ProtectedRoute><BuzoOnboardingPage /></ProtectedRoute>} />
      <Route path="/equipo-buceo" element={<ProtectedRoute><EquipoBuceo /></ProtectedRoute>} />
      <Route path="/personal-pool" element={<ProtectedRoute><PersonalPool /></ProtectedRoute>} />
      <Route path="/personal-pool-admin" element={<ProtectedRoute><PersonalPoolAdmin /></ProtectedRoute>} />

      {/* Formularios routes */}
      <Route path="/formularios/hpt" element={<ProtectedRoute><HPT /></ProtectedRoute>} />
      <Route path="/formularios/hpt-formularios" element={<ProtectedRoute><HPTFormularios /></ProtectedRoute>} />
      <Route path="/formularios/anexo-bravo" element={<ProtectedRoute><AnexoBravo /></ProtectedRoute>} />
      <Route path="/formularios/anexo-bravo-formularios" element={<ProtectedRoute><AnexoBravoFormularios /></ProtectedRoute>} />
      <Route path="/formularios/multix" element={<ProtectedRoute><MultiX /></ProtectedRoute>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
