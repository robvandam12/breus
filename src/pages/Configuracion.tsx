
import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Webhook, Bell, Database, User } from 'lucide-react';
import { WebhookSettings } from '@/components/configuracion/WebhookSettings';
import { NotificationSettings } from '@/components/notifications/NotificationSettings';
import { CatalogSettings } from '@/components/configuracion/CatalogSettings';
import { AccountSettings } from '@/components/configuracion/AccountSettings';

const Configuracion = () => {
  const [activeTab, setActiveTab] = useState("webhooks");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
            <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
              <SidebarTrigger className="mr-4" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Configuración</h1>
                  <p className="text-sm text-gray-500">Gestiona la configuración del sistema</p>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-6xl mx-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="webhooks" className="flex items-center gap-2">
                    <Webhook className="w-4 h-4" />
                    Webhooks
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notificaciones
                  </TabsTrigger>
                  <TabsTrigger value="catalogs" className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Catálogos
                  </TabsTrigger>
                  <TabsTrigger value="account" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Cuenta
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="webhooks">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configuración de Webhooks</CardTitle>
                      <CardDescription>
                        Gestiona los endpoints para notificaciones automáticas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <WebhookSettings />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Preferencias de Notificaciones</CardTitle>
                      <CardDescription>
                        Configura cómo y cuándo recibir notificaciones
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <NotificationSettings onClose={() => {}} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="catalogs">
                  <Card>
                    <CardHeader>
                      <CardTitle>Catálogos del Sistema</CardTitle>
                      <CardDescription>
                        Gestiona las opciones disponibles en formularios
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CatalogSettings />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="account">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configuración de Cuenta</CardTitle>
                      <CardDescription>
                        Gestiona tu perfil y configuración personal
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AccountSettings />
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
