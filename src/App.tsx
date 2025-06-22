
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { SimpleProtectedRoute } from '@/components/auth/SimpleProtectedRoute';
import { PageWithSidebarSkeleton } from '@/components/layout/PageWithSidebarSkeleton';

// Lazy load pages with proper error boundaries
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

// Error boundary component
const LazyComponentWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<PageWithSidebarSkeleton />}>
      {children}
    </Suspense>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={
                <LazyComponentWrapper>
                  <Login />
                </LazyComponentWrapper>
              } 
            />
            <Route 
              path="/register" 
              element={
                <LazyComponentWrapper>
                  <Register />
                </LazyComponentWrapper>
              } 
            />
            <Route 
              path="/forgot-password" 
              element={
                <LazyComponentWrapper>
                  <ForgotPassword />
                </LazyComponentWrapper>
              } 
            />
            
            {/* Protected routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/dashboard" 
              element={
                <SimpleProtectedRoute>
                  <LazyComponentWrapper>
                    <Dashboard />
                  </LazyComponentWrapper>
                </SimpleProtectedRoute>
              } 
            />
            <Route 
              path="/inmersiones" 
              element={
                <SimpleProtectedRoute>
                  <LazyComponentWrapper>
                    <Inmersiones />
                  </LazyComponentWrapper>
                </SimpleProtectedRoute>
              } 
            />
            <Route 
              path="/hpt" 
              element={
                <SimpleProtectedRoute>
                  <LazyComponentWrapper>
                    <HPT />
                  </LazyComponentWrapper>
                </SimpleProtectedRoute>
              } 
            />
            <Route 
              path="/anexo-bravo" 
              element={
                <SimpleProtectedRoute>
                  <LazyComponentWrapper>
                    <AnexoBravo />
                  </LazyComponentWrapper>
                </SimpleProtectedRoute>
              } 
            />
            <Route 
              path="/bitacoras" 
              element={
                <SimpleProtectedRoute>
                  <LazyComponentWrapper>
                    <Bitacoras />
                  </LazyComponentWrapper>
                </SimpleProtectedRoute>
              } 
            />
            <Route 
              path="/reportes" 
              element={
                <SimpleProtectedRoute>
                  <LazyComponentWrapper>
                    <Reportes />
                  </LazyComponentWrapper>
                </SimpleProtectedRoute>
              } 
            />
            <Route 
              path="/reportes/operativos" 
              element={
                <SimpleProtectedRoute>
                  <LazyComponentWrapper>
                    <ReportesOperativos />
                  </LazyComponentWrapper>
                </SimpleProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <SimpleProtectedRoute>
                  <LazyComponentWrapper>
                    <Admin />
                  </LazyComponentWrapper>
                </SimpleProtectedRoute>
              } 
            />
            
            {/* Operaciones routes */}
            <Route 
              path="/operaciones/planificar" 
              element={
                <SimpleProtectedRoute>
                  <LazyComponentWrapper>
                    <PlanificarOperaciones />
                  </LazyComponentWrapper>
                </SimpleProtectedRoute>
              } 
            />
            <Route 
              path="/operaciones/mantencion-redes" 
              element={
                <SimpleProtectedRoute>
                  <LazyComponentWrapper>
                    <MantencionRedes />
                  </LazyComponentWrapper>
                </SimpleProtectedRoute>
              } 
            />
            <Route 
              path="/operaciones/faenas-redes" 
              element={
                <SimpleProtectedRoute>
                  <LazyComponentWrapper>
                    <FaenasRedes />
                  </LazyComponentWrapper>
                </SimpleProtectedRoute>
              } 
            />
            
            {/* Integration routes */}
            <Route 
              path="/integraciones" 
              element={
                <SimpleProtectedRoute>
                  <LazyComponentWrapper>
                    <Integraciones />
                  </LazyComponentWrapper>
                </SimpleProtectedRoute>
              } 
            />
            
            {/* Fallback for unknown routes */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
