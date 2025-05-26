
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Salmoneras from "./pages/empresas/Salmoneras";
import Sitios from "./pages/empresas/Sitios";
import Contratistas from "./pages/empresas/Contratistas";
import Operaciones from "./pages/operaciones/Operaciones";
import HPT from "./pages/operaciones/HPT";
import AnexoBravo from "./pages/operaciones/AnexoBravo";
import Inmersiones from "./pages/operaciones/Inmersiones";
import BitacorasSupervisor from "./pages/operaciones/BitacorasSupervisor";
import BitacorasBuzo from "./pages/operaciones/BitacorasBuzo";
import Login from "./pages/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ProfileSetup from "./pages/auth/ProfileSetup";
import Reportes from "./pages/Reportes";
import Configuracion from "./pages/Configuracion";
import AdminRoles from "./pages/admin/AdminRoles";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/" element={<Index />} />
            <Route path="/empresas/salmoneras" element={<Salmoneras />} />
            <Route path="/empresas/sitios" element={<Sitios />} />
            <Route path="/empresas/contratistas" element={<Contratistas />} />
            <Route path="/operaciones" element={<Operaciones />} />
            <Route path="/formularios/hpt" element={<HPT />} />
            <Route path="/formularios/anexo-bravo" element={<AnexoBravo />} />
            <Route path="/inmersiones" element={<Inmersiones />} />
            <Route path="/bitacoras/supervisor" element={<BitacorasSupervisor />} />
            <Route path="/bitacoras/buzo" element={<BitacorasBuzo />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="/admin/roles" element={<AdminRoles />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
