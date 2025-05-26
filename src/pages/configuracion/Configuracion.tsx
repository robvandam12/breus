
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Webhook, Bell, Users, Database } from "lucide-react";

const Configuracion = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
            <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
              <SidebarTrigger className="mr-4" />
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Configuración</h1>
                  <p className="text-sm text-zinc-500">Gestión de configuraciones del sistema</p>
                </div>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="ios-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Webhook className="w-5 h-5 text-blue-600" />
                      Webhooks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-600 mb-4">
                      Configurar endpoints para notificaciones externas
                    </p>
                    <div className="space-y-2">
                      <div className="text-sm text-zinc-500">• Configurar URLs de destino</div>
                      <div className="text-sm text-zinc-500">• Gestionar tokens de seguridad</div>
                      <div className="text-sm text-zinc-500">• Monitorear entregas</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="ios-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-green-600" />
                      Notificaciones
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-600 mb-4">
                      Configurar preferencias de notificaciones
                    </p>
                    <div className="space-y-2">
                      <div className="text-sm text-zinc-500">• Suscripciones por evento</div>
                      <div className="text-sm text-zinc-500">• Canales de entrega</div>
                      <div className="text-sm text-zinc-500">• Horarios de envío</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="ios-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      Gestión de Cuenta
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-600 mb-4">
                      Configuración de perfil de usuario
                    </p>
                    <div className="space-y-2">
                      <div className="text-sm text-zinc-500">• Cambiar contraseña</div>
                      <div className="text-sm text-zinc-500">• Configurar Passkeys</div>
                      <div className="text-sm text-zinc-500">• Datos personales</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="ios-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-orange-600" />
                      Catálogos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-600 mb-4">
                      Gestionar opciones de formularios
                    </p>
                    <div className="space-y-2">
                      <div className="text-sm text-zinc-500">• Equipos de protección (EPP)</div>
                      <div className="text-sm text-zinc-500">• Estándares de riesgo (ERC)</div>
                      <div className="text-sm text-zinc-500">• Tipos de riesgos</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Configuracion;
