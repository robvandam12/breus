
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { AppSidebar } from "@/components/AppSidebar";
import { AdminUserManagement } from "@/components/users/AdminUserManagement";
import { Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function UserManagement() {
  const { profile } = useAuth();

  if (profile?.role !== 'superuser') {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 p-6">
            <Card className="ios-card">
              <CardContent className="p-12 text-center">
                <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Acceso Denegado</h2>
                <p className="text-zinc-500">No tienes permisos para acceder a esta sección.</p>
              </CardContent>
            </Card>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
                  <p className="text-zinc-500">Administración completa de usuarios del sistema</p>
                </div>
              </div>
            </div>

            <AdminUserManagement />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
