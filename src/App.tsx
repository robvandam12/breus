
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ProfileSetup from '@/pages/ProfileSetup';
import Usuarios from '@/pages/Usuarios';
import Empresas from '@/pages/Empresas';
import PersonalPoolAdmin from '@/pages/PersonalPoolAdmin';
import RegisterFromInvitation from "@/pages/RegisterFromInvitation";
import { IndependentImmersionManager } from "@/components/inmersiones/IndependentImmersionManager";

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Auth routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/register-invitation" element={<RegisterFromInvitation />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/setup-profile" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />

            {/* App routes */}
            <Route path="/" element={<ProtectedRoute><IndependentImmersionManager /></ProtectedRoute>} />
            <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
            <Route path="/empresas" element={<ProtectedRoute><Empresas /></ProtectedRoute>} />
            <Route path="/admin/salmonera" element={<ProtectedRoute><PersonalPoolAdmin /></ProtectedRoute>} />
            <Route path="/inmersiones" element={<ProtectedRoute><IndependentImmersionManager /></ProtectedRoute>} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
