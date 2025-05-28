import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import { ToastProvider, Toaster } from '@/hooks/use-toast';

// Auth Pages
import AuthPage from '@/pages/AuthPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';

// Main Pages
import HomePage from '@/pages/HomePage';
import Dashboard from '@/pages/Dashboard';

// Management Pages
import Salmoneras from '@/pages/Salmoneras';
import Contratistas from '@/pages/Contratistas';
import Sitios from '@/pages/Sitios';
import Operaciones from '@/pages/Operaciones';
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

function App() {
  return (
    <QueryClient>
      <BrowserRouter>
        <ToastProvider>
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            
            {/* Main Application Routes */}
            <Route path="/" element={<HomePage />} />
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
        </ToastProvider>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;
