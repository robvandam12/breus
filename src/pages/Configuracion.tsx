
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Webhook, Bell, User, Shield } from "lucide-react";
import { WebhookManagement } from "@/components/configuration/WebhookManagement";
import { NotificationSettings } from "@/components/configuration/NotificationSettings";

const Configuracion = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
            <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
              <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Configuración</h1>
                  <p className="text-sm text-zinc-500">Gestiona las preferencias del sistema</p>
                </div>
              </div>
            </div>
          </header>
          
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
