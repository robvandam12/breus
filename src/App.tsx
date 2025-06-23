
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster"
import HPT from '@/pages/formularios/HPT';
import AnexoBravo from '@/pages/formularios/AnexoBravo';
import EquipoDeBuceo from '@/pages/EquipoBuceo';
import Operaciones from '@/pages/operaciones/Operaciones';
import Inmersiones from '@/pages/Inmersiones';
import BitacorasSupervisor from '@/pages/operaciones/BitacorasSupervisor';
import BitacorasBuzo from '@/pages/operaciones/BitacorasBuzo';
import Reportes from '@/pages/Reportes';
import Configuracion from '@/pages/Configuracion';
import Salmoneras from '@/pages/empresas/Salmoneras';
import Sitios from '@/pages/empresas/Sitios';
import Contratistas from '@/pages/empresas/Contratistas';
import UserManagement from '@/pages/admin/UserManagement';
import AdminRoles from '@/pages/admin/AdminRoles';
import ProfileSetup from "@/pages/ProfileSetup";
import Index from "@/pages/Index";
import NetworkMaintenance from "@/pages/operaciones/NetworkMaintenance";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/formularios/hpt" element={<HPT />} />
          <Route path="/formularios/anexo-bravo" element={<AnexoBravo />} />
          <Route path="/equipo-de-buceo" element={<EquipoDeBuceo />} />
          <Route path="/operaciones" element={<Operaciones />} />
          <Route path="/inmersiones" element={<Inmersiones />} />
          <Route path="/bitacoras/supervisor" element={<BitacorasSupervisor />} />
          <Route path="/bitacoras/buzo" element={<BitacorasBuzo />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/configuracion" element={<Configuracion />} />
          <Route path="/empresas/salmoneras" element={<Salmoneras />} />
          <Route path="/empresas/sitios" element={<Sitios />} />
          <Route path="/empresas/contratistas" element={<Contratistas />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/roles" element={<AdminRoles />} />
          <Route path="/operaciones/network-maintenance" element={<NetworkMaintenance />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
