import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import HPTList from '@/pages/formularios/HPTList';
import AnexoBravoList from '@/pages/formularios/AnexoBravoList';
import BitacorasSupervisor from '@/pages/operaciones/BitacorasSupervisor';
import Inmersiones from '@/pages/operaciones/Inmersiones';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Navigate to="/dashboard" replace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/formularios/hpt"
                element={
                  <ProtectedRoute>
                    <HPTList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/formularios/anexo-bravo"
                element={
                  <ProtectedRoute>
                    <AnexoBravoList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bitacoras/supervisor"
                element={
                  <ProtectedRoute>
                    <BitacorasSupervisor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inmersiones"
                element={
                  <ProtectedRoute>
                    <Inmersiones />
                  </ProtectedRoute>
                }
              />
              {/* Keep all other existing routes */}
            </Routes>
          </AuthProvider>
        </BrowserRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
