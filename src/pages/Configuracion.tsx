
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, User, Bell, Shield, Webhook } from "lucide-react";
import { AccountSettings } from "@/components/configuracion/AccountSettings";
import { NotificationSettings } from "@/components/configuration/NotificationSettings";
import { WebhookManagement } from "@/components/configuration/WebhookManagement";
import { ConfiguracionAvanzada } from "@/components/configuracion/ConfiguracionAvanzada";

export default function Configuracion() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Configuración" 
            subtitle="Gestiona tu cuenta y preferencias del sistema" 
            icon={Settings} 
          />
          
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <Tabs defaultValue="account" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="account" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Cuenta
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notificaciones
                  </TabsTrigger>
                  <TabsTrigger value="webhooks" className="flex items-center gap-2">
                    <Webhook className="w-4 h-4" />
                    Webhooks
                  </TabsTrigger>
                  <TabsTrigger value="advanced" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Avanzado
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="account">
                  <AccountSettings />
                </TabsContent>

                <TabsContent value="notifications">
                  <NotificationSettings />
                </TabsContent>

                <TabsContent value="webhooks">
                  <WebhookManagement />
                </TabsContent>

                <TabsContent value="advanced">
                  <ConfiguracionAvanzada />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
