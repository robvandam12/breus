
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';

// Páginas principales
import Dashboard from '@/pages/Dashboard';
import Inmersiones from '@/pages/Inmersiones';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import Configuracion from '@/pages/Configuracion';

// Módulo de Planificación
import Operaciones from '@/pages/operaciones/Operaciones';
import MultiX from '@/pages/operaciones/MultiX';

// Módulos Operativos - Fase 2
import MantencionRedes from '@/pages/operaciones/MantencionRedes';
import FaenasRedes from '@/pages/operaciones/FaenasRedes';
import ReportesAvanzados from '@/pages/reportes/ReportesAvanzados';
import Integraciones from '@/pages/integraciones/Integraciones';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 30, // 30 minutos
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Autenticación */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Páginas principales */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/inmersiones" element={<Inmersiones />} />
            <Route path="/configuracion" element={<Configuracion />} />
            
            {/* Módulo de Planificación */}
            <Route path="/operaciones" element={<Operaciones />} />
            <Route path="/operaciones/multix" element={<MultiX />} />
            
            {/* Módulos Operativos - Fase 2 */}
            <Route path="/mantencion-redes" element={<MantencionRedes />} />
            <Route path="/faenas-redes" element={<FaenasRedes />} />
            <Route path="/reportes-avanzados" element={<ReportesAvanzados />} />
            <Route path="/integraciones" element={<Integraciones />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
