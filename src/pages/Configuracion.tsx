
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Webhook, Bell, User, Shield } from "lucide-react";
import { WebhookManagement } from "@/components/configuration/WebhookManagement";
import { NotificationSettings } from "@/components/configuration/NotificationSettings";

const Configuracion = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Configuración" 
            subtitle="Gestiona las preferencias del sistema" 
            icon={Settings} 
          />
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              <Tabs defaultValue="webhooks" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="webhooks" className="flex items-center gap-2">
                    <Webhook className="w-4 h-4" />
                    Webhooks
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notificaciones
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Seguridad
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Perfil
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="webhooks">
                  <WebhookManagement />
                </TabsContent>

                <TabsContent value="notifications">
                  <NotificationSettings />
                </TabsContent>

                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configuración de Seguridad</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">Configuraciones de seguridad y acceso del sistema.</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Perfil de Usuario</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">Gestión del perfil personal y preferencias de cuenta.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Configuracion;
