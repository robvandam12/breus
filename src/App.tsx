
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Toaster } from '@/components/ui/sonner';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import ProfileSetup from '@/pages/ProfileSetup';
import Index from '@/pages/Index';
import Usuarios from '@/pages/empresas/Usuarios';
import Empresas from '@/pages/empresas/Empresas';
import PersonalPoolAdmin from '@/pages/PersonalPoolAdmin';
import RegisterFromInvitation from "@/pages/RegisterFromInvitation";
import { AppRoutes } from "@/routes/AppRoutes";

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <AppRoutes />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
