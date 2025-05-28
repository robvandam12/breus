import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import AuthRoute from '@/components/auth/AuthRoute';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import Dashboard from '@/pages/Dashboard';
import Operaciones from '@/pages/operaciones/Operaciones';
import OperacionDetail from '@/components/operaciones/OperacionDetail';
import EquipoBuceo from '@/pages/EquipoBuceo';
import PoolPersonal from '@/pages/PoolPersonal';
import PoolPersonalAdmin from '@/pages/PoolPersonalAdmin';
import Sitios from '@/pages/empresas/Sitios';
import Salmoneras from '@/pages/empresas/Salmoneras';
import Contratistas from '@/pages/empresas/Contratistas';
import Configuracion from '@/pages/Configuracion';
import HPTFormulario from '@/pages/formularios/HPTFormulario';
import AnexoBravo from '@/pages/formularios/AnexoBravo';
import BitacorasSupervisor from '@/pages/bitacoras/BitacorasSupervisor';
import BitacorasBuzo from '@/pages/bitacoras/BitacorasBuzo';
import Inmersiones from '@/pages/inmersiones/Inmersiones';
import InmersionDetail from '@/pages/inmersiones/InmersionDetail';
import ProfileSetup from '@/pages/auth/ProfileSetup';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminRoles from '@/pages/admin/AdminRoles';
import Reportes from '@/pages/Reportes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<AuthRoute><Dashboard /></AuthRoute>} />
          <Route path="/operaciones" element={<AuthRoute><Operaciones /></AuthRoute>} />
          <Route path="/operaciones/:id" element={<AuthRoute><OperacionDetail /></AuthRoute>} />
          <Route path="/equipo-de-buceo" element={<AuthRoute><EquipoBuceo /></AuthRoute>} />
          <Route path="/personal-pool" element={<AuthRoute><PoolPersonal /></AuthRoute>} />
          <Route path="/personal-pool-admin" element={<AuthRoute><PoolPersonalAdmin /></AuthRoute>} />
          <Route path="/empresas/sitios" element={<AuthRoute><Sitios /></AuthRoute>} />
          <Route path="/empresas/salmoneras" element={<AuthRoute><Salmoneras /></AuthRoute>} />
          <Route path="/empresas/contratistas" element={<AuthRoute><Contratistas /></AuthRoute>} />
          <Route path="/configuracion" element={<AuthRoute><Configuracion /></AuthRoute>} />
          <Route path="/formularios/hpt" element={<AuthRoute><HPTFormulario /></AuthRoute>} />
          <Route path="/formularios/anexo-bravo" element={<AuthRoute><AnexoBravo /></AuthRoute>} />
          <Route path="/bitacoras/supervisor" element={<AuthRoute><BitacorasSupervisor /></AuthRoute>} />
          <Route path="/bitacoras/buzo" element={<AuthRoute><BitacorasBuzo /></AuthRoute>} />
          <Route path="/inmersiones" element={<AuthRoute><Inmersiones /></AuthRoute>} />
          <Route path="/inmersiones/:id" element={<AuthRoute><InmersionDetail /></AuthRoute>} />
          <Route path="/profile-setup" element={<AuthRoute><ProfileSetup /></AuthRoute>} />
          <Route path="/admin/users" element={<AuthRoute><AdminUsers /></AuthRoute>} />
          <Route path="/admin/roles" element={<AuthRoute><AdminRoles /></AuthRoute>} />
          <Route path="/reportes" element={<AuthRoute><Reportes /></AuthRoute>} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
