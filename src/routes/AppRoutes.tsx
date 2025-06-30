
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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

// Importar las nuevas páginas de bitácoras
import BitacorasSupervisor from '@/pages/bitacoras/BitacorasSupervisor';
import BitacorasBuzo from '@/pages/bitacoras/BitacorasBuzo';

export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register/:token" element={<RegisterFromInvitation />} />

        {/* Rutas protegidas */}
        <Route path="/" element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } />
        
        <Route path="/profile-setup" element={
          <ProtectedRoute>
            <ProfileSetup />
          </ProtectedRoute>
        } />

        {/* Bitácoras - rutas unificadas */}
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

        {/* Redirects de rutas legacy */}
        <Route path="/operaciones/bitacoras-supervisor" element={<Navigate to="/bitacoras/supervisor" replace />} />
        <Route path="/operaciones/bitacoras-buzo" element={<Navigate to="/bitacoras/buzo" replace />} />

        {/* Empresas */}
        <Route path="/empresas/usuarios" element={
          <ProtectedRoute>
            <Usuarios />
          </ProtectedRoute>
        } />
        
        <Route path="/empresas" element={
          <ProtectedRoute>
            <Empresas />
          </ProtectedRoute>
        } />

        {/* Admin */}
        <Route path="/personal-pool-admin" element={
          <ProtectedRoute>
            <PersonalPoolAdmin />
          </ProtectedRoute>
        } />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};
