
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Dashboard } from '@/components/Dashboard';
import Salmoneras from '@/pages/empresas/Salmoneras';
import Sitios from '@/pages/empresas/Sitios';
import Contratistas from '@/pages/empresas/Contratistas';
import Operaciones from '@/pages/operaciones/Operaciones';
import Inmersiones from '@/pages/operaciones/Inmersiones';
import BitacorasSupervisor from '@/pages/operaciones/BitacorasSupervisor';
import BitacorasBuzo from '@/pages/operaciones/BitacorasBuzo';
import Profile from '@/pages/Profile';
import Configuracion from '@/pages/Configuracion';
import Reportes from '@/pages/Reportes';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import RequireAuth from '@/components/auth/RequireAuth';
import RequireSuperuser from '@/components/auth/RequireSuperuser';
import AdminLayout from '@/components/layout/AdminLayout';
import { Toaster } from '@/components/ui/toaster';
import WebhooksPage from '@/pages/WebhooksPage';
import AdminSalmoneraPage from "@/pages/admin/AdminSalmoneraPage";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/" element={<AdminLayout />}>
              <Route
                index
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="dashboard"
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="empresas/salmoneras"
                element={
                  <RequireAuth>
                    <RequireSuperuser>
                      <Salmoneras />
                    </RequireSuperuser>
                  </RequireAuth>
                }
              />
              <Route
                path="empresas/sitios"
                element={
                  <RequireAuth>
                    <Sitios />
                  </RequireAuth>
                }
              />
              <Route
                path="empresas/contratistas"
                element={
                  <RequireAuth>
                    <Contratistas />
                  </RequireAuth>
                }
              />
              <Route
                path="operaciones/operaciones"
                element={
                  <RequireAuth>
                    <Operaciones />
                  </RequireAuth>
                }
              />
              <Route
                path="operaciones/inmersiones"
                element={
                  <RequireAuth>
                    <Inmersiones />
                  </RequireAuth>
                }
              />
              <Route
                path="operaciones/bitacoras-supervisor"
                element={
                  <RequireAuth>
                    <BitacorasSupervisor />
                  </RequireAuth>
                }
              />
              <Route
                path="operaciones/bitacoras-buzo"
                element={
                  <RequireAuth>
                    <BitacorasBuzo />
                  </RequireAuth>
                }
              />
              <Route
                path="profile"
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />
              <Route
                path="configuracion"
                element={
                  <RequireAuth>
                    <Configuracion />
                  </RequireAuth>
                }
              />
              <Route
                path="reportes"
                element={
                  <RequireAuth>
                    <Reportes />
                  </RequireAuth>
                }
              />
              <Route
                path="webhooks"
                element={
                  <RequireAuth>
                    <WebhooksPage />
                  </RequireAuth>
                }
              />
            </Route>
            
            {/* Nueva ruta para admin salmonera */}
            <Route path="/admin/salmonera" element={<AdminSalmoneraPage />} />
            
            {/* Catch-all route for 404 */}
            <Route
              path="*"
              element={
                <main className="flex flex-col items-center justify-center h-screen">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Not Found</h1>
                  <p className="text-gray-600">Sorry, the page you are looking for does not exist.</p>
                </main>
              }
            />
          </Routes>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
