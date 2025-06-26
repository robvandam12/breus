
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ToastProvider } from '@/components/ui/toast-provider';
import { SimpleProtectedRoute } from '@/components/auth/SimpleProtectedRoute';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ProfileSetup from '@/pages/ProfileSetup';
import Index from '@/pages/Index';
import Usuarios from '@/pages/Usuarios';
import PersonalPoolAdmin from '@/pages/PersonalPoolAdmin';
import Inmersiones from '@/pages/Inmersiones';
import RegisterFromInvitation from "@/pages/RegisterFromInvitation";

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <Router>
            <Routes>
              {/* Auth routes - both with and without /auth prefix for compatibility */}
              <Route path="/login" element={<Login />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/register-invitation" element={<RegisterFromInvitation />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/setup-profile" element={<SimpleProtectedRoute><ProfileSetup /></SimpleProtectedRoute>} />

              {/* App routes */}
              <Route path="/" element={<SimpleProtectedRoute><Index /></SimpleProtectedRoute>} />
              <Route path="/usuarios" element={<SimpleProtectedRoute><Usuarios /></SimpleProtectedRoute>} />
              <Route path="/inmersiones" element={<SimpleProtectedRoute><Inmersiones /></SimpleProtectedRoute>} />
              <Route path="/admin/salmonera" element={<SimpleProtectedRoute><PersonalPoolAdmin /></SimpleProtectedRoute>} />
            </Routes>
          </Router>
        </ToastProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
