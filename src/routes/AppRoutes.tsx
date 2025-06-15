
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Index from "@/pages/Index";
import HPT from "@/pages/formularios/HPT";
import AnexoBravo from "@/pages/formularios/AnexoBravo";
import HPTFormularios from "@/pages/formularios/HPTFormularios";
import AnexoBravoFormularios from "@/pages/formularios/AnexoBravoFormularios";
import { AuthLayout } from "@/pages/auth/AuthLayout";
import ProfileSetup from "@/pages/auth/ProfileSetup";
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

export const AppRoutes = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem('supabase.auth.token');

    if (!token && !isLoginPage) {
      return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
  };

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/auth/*" element={<AuthLayout />} />
      
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
