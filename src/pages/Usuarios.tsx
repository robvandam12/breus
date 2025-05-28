
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight, Info } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const Usuarios = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir automáticamente a la gestión de usuarios apropiada
    if (profile?.role === 'superuser') {
      navigate('/personal-pool-admin');
    } else if (profile?.role === 'admin_salmonera') {
      navigate('/salmoneras');
    } else if (profile?.role === 'admin_servicio') {
      navigate('/contratistas');
    }
  }, [profile, navigate]);

  if (!profile) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-white">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col bg-white">
            <Header 
              title="Gestión de Usuarios" 
              subtitle="Administra los usuarios de tu empresa" 
              icon={Users} 
            />
            <div className="flex-1 flex items-center justify-center bg-white">
              <LoadingSpinner text="Cargando..." />
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  const getRedirectInfo = () => {
    switch (profile.role) {
      case 'superuser':
        return {
          title: 'Personal Pool Administrativo',
          description: 'Gestiona todos los usuarios del sistema',
          path: '/personal-pool-admin',
          buttonText: 'Ir a Personal Pool'
        };
      case 'admin_salmonera':
        return {
          title: 'Gestión de Salmonera',
          description: 'Gestiona los usuarios de tu salmonera y contratistas asociados',
          path: '/salmoneras',
          buttonText: 'Ir a Gestión de Salmonera'
        };
      case 'admin_servicio':
        return {
          title: 'Gestión de Contratista',
          description: 'Gestiona los usuarios de tu empresa contratista',
          path: '/contratistas',
          buttonText: 'Ir a Gestión de Contratista'
        };
      default:
        return {
          title: 'Sin Permisos',
          description: 'No tienes permisos para gestionar usuarios',
          path: '/dashboard',
          buttonText: 'Volver al Dashboard'
        };
    }
  };

  const redirectInfo = getRedirectInfo();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col bg-white">
          <Header 
            title="Gestión de Usuarios" 
            subtitle="Administra los usuarios de tu empresa" 
            icon={Users} 
          />
          
          <div className="flex-1 overflow-auto bg-white">
            <div className="p-4 md:p-8 max-w-4xl mx-auto">
              <Card className="text-center py-12">
                <CardContent className="space-y-6">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Info className="w-8 h-8 text-blue-600" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Redirigiendo a {redirectInfo.title}
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      {redirectInfo.description}
                    </p>
                  </div>

                  <Button 
                    onClick={() => navigate(redirectInfo.path)}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    {redirectInfo.buttonText}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <div className="text-sm text-gray-500 mt-4">
                    <p>Serás redirigido automáticamente en unos segundos...</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Usuarios;
