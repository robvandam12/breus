import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { OperationalFlowProvider } from "@/contexts/OperationalFlowContext";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import Usuarios from "@/pages/empresas/Usuarios";
import Operaciones from "@/pages/operaciones/Operaciones";
import HPT from "@/pages/operaciones/HPT";
import AnexoBravo from "@/pages/operaciones/AnexoBravo";
import Inmersiones from "@/pages/Inmersiones";
import Bitacoras from "@/pages/Bitacoras";
import Configuracion from "@/pages/Configuracion";
import Profile from "@/pages/Profile";
import Mantenedores from "@/pages/Mantenedores";
import { Register } from "@/pages/auth/Register";
import { Login } from "@/pages/auth/Login";
import { ForgotPassword } from "@/pages/auth/ForgotPassword";
import { ResetPassword } from "@/pages/auth/ResetPassword";
import { VerifyEmail } from "@/pages/auth/VerifyEmail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <OperationalFlowProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} />
                <Route path="/auth/verify-email" element={<VerifyEmail />} />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/empresas/usuarios" element={
                  <ProtectedRoute>
                    <Usuarios />
                  </ProtectedRoute>
                } />
                <Route path="/operaciones/operaciones" element={
                  <ProtectedRoute>
                    <Operaciones />
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
                <Route path="/bitacoras" element={
                  <ProtectedRoute>
                    <Bitacoras />
                  </ProtectedRoute>
                } />
                <Route path="/configuracion" element={
                  <ProtectedRoute>
                    <Configuracion />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/mantenedores" element={
                  <ProtectedRoute>
                    <Mantenedores />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
            <Toaster />
          </Router>
        </OperationalFlowProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
