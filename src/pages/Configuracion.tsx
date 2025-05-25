
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Webhook, Bell, User, Zap } from "lucide-react";
import { ConfiguracionAvanzada } from "@/components/configuracion/ConfiguracionAvanzada";
import { WebhookTester } from "@/components/integrations/WebhookTester";

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
              <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="general" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    General
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notificaciones
                  </TabsTrigger>
                  <TabsTrigger value="webhooks" className="flex items-center gap-2">
                    <Webhook className="w-4 h-4" />
                    Webhooks
                  </TabsTrigger>
                  <TabsTrigger value="integrations" className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Integraciones
                  </TabsTrigger>
                  <TabsTrigger value="advanced" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Avanzado
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configuración General</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">Configuración general del perfil y preferencias básicas.</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications">
                  <ConfiguracionAvanzada />
                </TabsContent>

                <TabsContent value="webhooks">
                  <Card>
                    <CardHeader>
                      <CardTitle>Gestión de Webhooks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">Configura endpoints para recibir notificaciones automáticas.</p>
                      {/* Webhook configuration would go here */}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="integrations">
                  <Card>
                    <CardHeader>
                      <CardTitle>Probador de Integraciones</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <WebhookTester />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="advanced">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configuración Avanzada</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">Configuraciones avanzadas del sistema y herramientas de diagnóstico.</p>
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
