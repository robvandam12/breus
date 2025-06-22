
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { SimpleProtectedRoute } from '@/components/auth/SimpleProtectedRoute';
import { PageWithSidebarSkeleton } from '@/components/layout/PageWithSidebarSkeleton';

// Lazy load pages
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const Dashboard = lazy(() => import('@/pages/Index'));
const Inmersiones = lazy(() => import('@/pages/Inmersiones'));
const HPT = lazy(() => import('@/pages/formularios/HPT'));
const AnexoBravo = lazy(() => import('@/pages/formularios/AnexoBravo'));
const Bitacoras = lazy(() => import('@/pages/operaciones/BitacorasBuzo'));
const Reportes = lazy(() => import('@/pages/Reportes'));
const ReportesOperativos = lazy(() => import('@/pages/reportes/ReportesAvanzados'));
const Admin = lazy(() => import('@/pages/admin/AdminSalmoneraPage'));
const PlanificarOperaciones = lazy(() => import('@/pages/operaciones/Operaciones'));
const MantencionRedes = lazy(() => import('@/pages/operaciones/MantencionRedes'));
const FaenasRedes = lazy(() => import('@/pages/operaciones/FaenasRedes'));
const Integraciones = lazy(() => import('@/pages/integraciones/Integraciones'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Suspense fallback={<PageWithSidebarSkeleton />}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Protected routes */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={
                <SimpleProtectedRoute>
                  <Dashboard />
                </SimpleProtectedRoute>
              } />
              <Route path="/inmersiones" element={
                <SimpleProtectedRoute>
                  <Inmersiones />
                </SimpleProtectedRoute>
              } />
              <Route path="/hpt" element={
                <SimpleProtectedRoute>
                  <HPT />
                </SimpleProtectedRoute>
              } />
              <Route path="/anexo-bravo" element={
                <SimpleProtectedRoute>
                  <AnexoBravo />
                </SimpleProtectedRoute>
              } />
              <Route path="/bitacoras" element={
                <SimpleProtectedRoute>
                  <Bitacoras />
                </SimpleProtectedRoute>
              } />
              <Route path="/reportes" element={
                <SimpleProtectedRoute>
                  <Reportes />
                </SimpleProtectedRoute>
              } />
              <Route path="/reportes/operativos" element={
                <SimpleProtectedRoute>
                  <ReportesOperativos />
                </SimpleProtectedRoute>
              } />
              <Route path="/admin" element={
                <SimpleProtectedRoute>
                  <Admin />
                </SimpleProtectedRoute>
              } />
              
              {/* Operaciones routes */}
              <Route path="/operaciones/planificar" element={
                <SimpleProtectedRoute>
                  <PlanificarOperaciones />
                </SimpleProtectedRoute>
              } />
              <Route path="/operaciones/mantencion-redes" element={
                <SimpleProtectedRoute>
                  <MantencionRedes />
                </SimpleProtectedRoute>
              } />
              <Route path="/operaciones/faenas-redes" element={
                <SimpleProtectedRoute>
                  <FaenasRedes />
                </SimpleProtectedRoute>
              } />
              
              {/* Integration routes */}
              <Route path="/integraciones" element={
                <SimpleProtectedRoute>
                  <Integraciones />
                </SimpleProtectedRoute>
              } />
              
              {/* Fallback for unknown routes */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
