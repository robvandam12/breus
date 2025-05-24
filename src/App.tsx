
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Salmoneras from "./pages/empresas/Salmoneras";
import Sitios from "./pages/empresas/Sitios";
import Contratistas from "./pages/empresas/Contratistas";
import Operaciones from "./pages/operaciones/Operaciones";
import HPT from "./pages/operaciones/HPT";
import AnexoBravo from "./pages/operaciones/AnexoBravo";
import Inmersiones from "./pages/operaciones/Inmersiones";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/empresas/salmoneras" element={<Salmoneras />} />
          <Route path="/empresas/sitios" element={<Sitios />} />
          <Route path="/empresas/contratistas" element={<Contratistas />} />
          <Route path="/operaciones" element={<Operaciones />} />
          <Route path="/operaciones/hpt" element={<HPT />} />
          <Route path="/operaciones/anexo-bravo" element={<AnexoBravo />} />
          <Route path="/operaciones/inmersiones" element={<Inmersiones />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
