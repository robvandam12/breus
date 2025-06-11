
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import { Sonner } from './components/ui/sonner';
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Onboarding from "./pages/Onboarding";
import ProfileSetup from "./pages/auth/ProfileSetup";
import Index from "./pages/Index";
import Operaciones from "./pages/Operaciones";
import Inmersiones from "./pages/Inmersiones";
import Bitacoras from "./pages/Bitacoras";
import Salmoneras from "./pages/Salmoneras";
import Sitios from "./pages/Sitios";
import Contratistas from "./pages/Contratistas";
import Configuracion from "./pages/Configuracion";
import BuzoOnboardingPage from './pages/BuzoOnboardingPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/buzo-onboarding" element={<BuzoOnboardingPage />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/" element={<Index />} />
            <Route path="/operaciones" element={<Operaciones />} />
            <Route path="/inmersiones" element={<Inmersiones />} />
            <Route path="/bitacoras" element={<Bitacoras />} />
            <Route path="/salmoneras" element={<Salmoneras />} />
            <Route path="/sitios" element={<Sitios />} />
            <Route path="/contratistas" element={<Contratistas />} />
            <Route path="/configuracion" element={<Configuracion />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
