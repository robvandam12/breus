
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/components/auth/AuthProvider';

// Auth Pages
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';

// Main Pages
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';

// Management Pages (empresas)
import Salmoneras from '@/pages/empresas/Salmoneras';
import Contratistas from '@/pages/empresas/Contratistas';
import Sitios from '@/pages/empresas/Sitios';

// Management Pages
import Operaciones from '@/pages/operaciones/Operaciones';
import Usuarios from '@/pages/Usuarios';

// Equipment Pages
import EquipoBuceo from '@/pages/EquipoBuceo';

// Operations Pages
import Inmersiones from '@/pages/Inmersiones';

// Forms Pages
import HPTPage from '@/pages/formularios/HPT';
import AnexoBravoPage from '@/pages/formularios/AnexoBravo';

// Details Pages
import OperacionDetailPage from '@/pages/OperacionDetail';
import InmersionDetailPage from '@/pages/InmersionDetail';

// Profile and Settings
import ProfilePage from '@/pages/ProfilePage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Main Application Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Management Routes */}
            <Route path="/salmoneras" element={<Salmoneras />} />
            <Route path="/contratistas" element={<Contratistas />} />
            <Route path="/sitios" element={<Sitios />} />
            <Route path="/operaciones" element={<Operaciones />} />
            <Route path="/usuarios" element={<Usuarios />} />
            
            {/* Equipment Routes */}
            <Route path="/equipo-de-buceo" element={<EquipoBuceo />} />
            
            {/* Operations Routes */}
            <Route path="/inmersiones" element={<Inmersiones />} />
            
            {/* Forms Routes */}
            <Route path="/formularios/hpt" element={<HPTPage />} />
            <Route path="/formularios/anexo-bravo" element={<AnexoBravoPage />} />
            
            {/* Details Routes */}
            <Route path="/operacion/:id" element={<OperacionDetailPage />} />
            <Route path="/inmersion/:id" element={<InmersionDetailPage />} />
            
            {/* Profile and Settings */}
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
