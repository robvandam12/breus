
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { AppSidebar } from "@/components/AppSidebar";
import { UserManagement as UserManagementComponent } from "@/components/admin/UserManagement";
import { Shield, Search, Users, Activity } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function UserManagement() {
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

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
            <div className="flex items-center justify-between">
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
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                  <Input
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>

            <Tabs defaultValue="usuarios" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="usuarios" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Usuarios
                </TabsTrigger>
                <TabsTrigger value="actividad" className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Actividad
                </TabsTrigger>
              </TabsList>

              <TabsContent value="usuarios">
                <UserManagementComponent />
              </TabsContent>

              <TabsContent value="actividad">
                <Card className="ios-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-600" />
                      Registro de Actividad
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Activity className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-zinc-900 mb-2">Registro de Actividad</h3>
                      <p className="text-zinc-500">Funcionalidad de trazabilidad en desarrollo</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
