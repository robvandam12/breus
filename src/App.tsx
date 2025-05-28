
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import Index from '@/pages/Index';
import Operaciones from '@/pages/operaciones/Operaciones';
import OperacionDetail from '@/components/operaciones/OperacionDetail';
import EquipoBuceo from '@/pages/EquipoBuceo';
import PersonalPool from '@/pages/PersonalPool';
import PersonalPoolAdmin from '@/pages/PersonalPoolAdmin';
import Sitios from '@/pages/empresas/Sitios';
import Salmoneras from '@/pages/empresas/Salmoneras';
import Contratistas from '@/pages/empresas/Contratistas';
import Configuracion from '@/pages/Configuracion';
import HPTFormulario from '@/pages/formularios/HPT';
import AnexoBravo from '@/pages/formularios/AnexoBravo';
import BitacorasSupervisor from '@/pages/operaciones/BitacorasSupervisor';
import BitacorasBuzo from '@/pages/operaciones/BitacorasBuzo';
import Inmersiones from '@/pages/Inmersiones';
import InmersionDetail from '@/pages/inmersiones/InmersionDetail';
import ProfileSetup from '@/pages/auth/ProfileSetup';
import AdminUsers from '@/pages/admin/UserManagement';
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
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/operaciones" element={<ProtectedRoute><Operaciones /></ProtectedRoute>} />
          <Route path="/operaciones/:id" element={<ProtectedRoute><OperacionDetailWrapper /></ProtectedRoute>} />
          <Route path="/equipo-de-buceo" element={<ProtectedRoute><EquipoBuceo /></ProtectedRoute>} />
          <Route path="/personal-pool" element={<ProtectedRoute><PersonalPool /></ProtectedRoute>} />
          <Route path="/personal-pool-admin" element={<ProtectedRoute><PersonalPoolAdmin /></ProtectedRoute>} />
          <Route path="/empresas/sitios" element={<ProtectedRoute><Sitios /></ProtectedRoute>} />
          <Route path="/empresas/salmoneras" element={<ProtectedRoute><Salmoneras /></ProtectedRoute>} />
          <Route path="/empresas/contratistas" element={<ProtectedRoute><Contratistas /></ProtectedRoute>} />
          <Route path="/configuracion" element={<ProtectedRoute><Configuracion /></ProtectedRoute>} />
          <Route path="/formularios/hpt" element={<ProtectedRoute><HPTFormulario /></ProtectedRoute>} />
          <Route path="/formularios/anexo-bravo" element={<ProtectedRoute><AnexoBravo /></ProtectedRoute>} />
          <Route path="/bitacoras/supervisor" element={<ProtectedRoute><BitacorasSupervisor /></ProtectedRoute>} />
          <Route path="/bitacoras/buzo" element={<ProtectedRoute><BitacorasBuzo /></ProtectedRoute>} />
          <Route path="/inmersiones" element={<ProtectedRoute><Inmersiones /></ProtectedRoute>} />
          <Route path="/inmersiones/:id" element={<ProtectedRoute><InmersionDetail /></ProtectedRoute>} />
          <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/roles" element={<ProtectedRoute><AdminRoles /></ProtectedRoute>} />
          <Route path="/reportes" element={<ProtectedRoute><Reportes /></ProtectedRoute>} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

// Wrapper component to handle the operacion parameter
import { useParams } from 'react-router-dom';
import { useOperaciones } from '@/hooks/useOperaciones';

const OperacionDetailWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const { operaciones } = useOperaciones();
  
  const operacion = operaciones.find(op => op.id === id);
  
  if (!operacion) {
    return <div>Operación no encontrada</div>;
  }
  
  return <OperacionDetail operacion={operacion} />;
};

export default App;
