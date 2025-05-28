
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Users, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const Usuarios = () => {
  const { profile, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && profile) {
      // Redirigir basado en el rol del usuario para mejorar el rendimiento
      if (profile.role === 'admin_salmonera') {
        navigate('/admin/users', { replace: true });
      } else if (profile.role === 'admin_servicio') {
        navigate('/admin/users', { replace: true });
      } else if (profile.role === 'superuser') {
        navigate('/admin/users', { replace: true });
      } else {
        // Para otros roles, mostrar información de contacto
        return;
      }
    }
  }, [profile, isLoading, navigate]);

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-white">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col bg-white">
            <Header 
              title="Gestión de Usuarios" 
              subtitle="Cargando..." 
              icon={Users} 
            />
            <div className="flex-1 flex items-center justify-center bg-white">
              <LoadingSpinner text="Cargando usuarios..." />
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  // Si el usuario no tiene permisos administrativos, mostrar mensaje
  if (profile?.role === 'buzo' || profile?.role === 'supervisor') {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-white">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col bg-white">
            <Header 
              title="Gestión de Usuarios" 
              subtitle="Acceso limitado" 
              icon={Users} 
            />
            <div className="flex-1 overflow-auto bg-white">
              <div className="p-4 md:p-8 max-w-7xl mx-auto">
                <Card className="text-center py-12">
                  <CardContent>
                    <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">
                      Acceso Limitado
                    </h3>
                    <p className="text-zinc-500 mb-4">
                      Tu rol actual no permite gestionar usuarios. Contacta a tu administrador si necesitas acceso.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-blue-600">
                      <span className="text-sm">Ir al panel de administración</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  // Este return nunca debería ejecutarse debido al useEffect redirect
  return null;
};

export default Usuarios;
