import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster"
import { HPTForm } from '@/pages/formularios/HPTForm';
import { AnexoBravoForm } from '@/pages/formularios/AnexoBravoForm';
import { EquipoDeBuceo } from '@/pages/EquipoDeBuceo';
import { Operaciones } from '@/pages/Operaciones';
import { Inmersiones } from '@/pages/Inmersiones';
import { BitacoraSupervisor } from '@/pages/bitacoras/BitacoraSupervisor';
import { BitacoraBuzo } from '@/pages/bitacoras/BitacoraBuzo';
import { Reportes } from '@/pages/Reportes';
import { Configuracion } from '@/pages/Configuracion';
import { Salmoneras } from '@/pages/empresas/Salmoneras';
import { Sitios } from '@/pages/empresas/Sitios';
import { Contratistas } from '@/pages/empresas/Contratistas';
import { UsersAdmin } from '@/pages/admin/UsersAdmin';
import { RolesAdmin } from '@/pages/admin/RolesAdmin';
import { ProfileSetup } from "@/pages/ProfileSetup";
import { Home } from "@/pages/Home";
import NetworkMaintenance from "@/pages/operaciones/NetworkMaintenance";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/formularios/hpt" element={<HPTForm />} />
          <Route path="/formularios/anexo-bravo" element={<AnexoBravoForm />} />
          <Route path="/equipo-de-buceo" element={<EquipoDeBuceo />} />
          <Route path="/operaciones" element={<Operaciones />} />
          <Route path="/inmersiones" element={<Inmersiones />} />
          <Route path="/bitacoras/supervisor" element={<BitacoraSupervisor />} />
          <Route path="/bitacoras/buzo" element={<BitacoraBuzo />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/configuracion" element={<Configuracion />} />
          <Route path="/empresas/salmoneras" element={<Salmoneras />} />
          <Route path="/empresas/sitios" element={<Sitios />} />
          <Route path="/empresas/contratistas" element={<Contratistas />} />
          <Route path="/admin/users" element={<UsersAdmin />} />
          <Route path="/admin/roles" element={<RolesAdmin />} />
          <Route path="/operaciones/network-maintenance" element={<NetworkMaintenance />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
