
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Toaster } from '@/components/ui/toaster';

// Páginas principales
import Dashboard from '@/pages/Index';
import Inmersiones from '@/pages/Inmersiones';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import Configuracion from '@/pages/Configuracion';

// Módulo de Planificación
import Operaciones from '@/pages/operaciones/Operaciones';
import NetworkMaintenance from '@/pages/operaciones/NetworkMaintenance';

// Módulos Operativos - Fase 2
import MantencionRedes from '@/pages/operaciones/MantencionRedes';
import FaenasRedes from '@/pages/operaciones/FaenasRedes';
import ReportesAvanzados from '@/pages/reportes/ReportesAvanzados';
import Integraciones from '@/pages/integraciones/Integraciones';

// Fase 3 - Gestión de Módulos
import ModuleManagement from '@/pages/admin/ModuleManagement';

// Fase 4 - Sistema de Notificaciones y Alertas
import NotificationManagement from '@/pages/admin/NotificationManagement';

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
            
            {/* Páginas principales */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/inmersiones" element={<Inmersiones />} />
            <Route path="/configuracion" element={<Configuracion />} />
            
            {/* Módulo de Planificación */}
            <Route path="/operaciones" element={<Operaciones />} />
            <Route path="/operaciones/network-maintenance" element={<NetworkMaintenance />} />
            
            {/* Módulos Operativos - Fase 2 */}
            <Route path="/mantencion-redes" element={<MantencionRedes />} />
            <Route path="/faenas-redes" element={<FaenasRedes />} />
            <Route path="/reportes-avanzados" element={<ReportesAvanzados />} />
            <Route path="/integraciones" element={<Integraciones />} />
            
            {/* Fase 3 - Administración */}
            <Route path="/admin/module-management" element={<ModuleManagement />} />
            
            {/* Fase 4 - Notificaciones y Alertas */}
            <Route path="/admin/notifications" element={<NotificationManagement />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
