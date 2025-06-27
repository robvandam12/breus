import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { ToastProvider } from '@/hooks/use-toast';
import { SimpleProtectedRoute } from '@/components/auth/ProtectedRoute';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import ProfileSetup from '@/pages/ProfileSetup';
import Dashboard from '@/pages/Dashboard';
import Usuarios from '@/pages/Usuarios';
import Empresas from '@/pages/Empresas';
import PersonalPoolAdmin from '@/pages/PersonalPoolAdmin';
import RegisterFromInvitation from "@/pages/RegisterFromInvitation";

function App() {
  return (
    <AuthProvider>
      <QueryClient>
        <ToastProvider>
          <Router>
            <Routes>
              {/* Auth routes */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/register-invitation" element={<RegisterFromInvitation />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/setup-profile" element={<SimpleProtectedRoute><ProfileSetup /></SimpleProtectedRoute>} />

              {/* App routes */}
              <Route path="/" element={<SimpleProtectedRoute><Dashboard /></SimpleProtectedRoute>} />
              <Route path="/usuarios" element={<SimpleProtectedRoute><Usuarios /></SimpleProtectedRoute>} />
              <Route path="/empresas" element={<SimpleProtectedRoute><Empresas /></SimpleProtectedRoute>} />
              <Route path="/admin/salmonera" element={<SimpleProtectedRoute><PersonalPoolAdmin /></SimpleProtectedRoute>} />
            </Routes>
          </Router>
        </ToastProvider>
      </QueryClient>
    </AuthProvider>
  );
}

export default App;
