
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Settings, User, Bell, Shield, Save } from "lucide-react";

const Configuracion = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Configuración" 
            subtitle="Gestión de preferencias y configuración del sistema" 
            icon={Settings} 
          >
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
          </Header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-4xl mx-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 max-w-md">
                  <TabsTrigger value="profile">Perfil</TabsTrigger>
                  <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
                  <TabsTrigger value="security">Seguridad</TabsTrigger>
                  <TabsTrigger value="system">Sistema</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Información Personal
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nombre">Nombre</Label>
                          <Input id="nombre" placeholder="Tu nombre" />
                        </div>
                        <div>
                          <Label htmlFor="apellido">Apellido</Label>
                          <Input id="apellido" placeholder="Tu apellido" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="tu.email@ejemplo.com" />
                      </div>
                      <div>
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input id="telefono" placeholder="+56 9 1234 5678" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Información Profesional</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="matricula">Matrícula de Buzo</Label>
                        <Input id="matricula" placeholder="Número de matrícula" />
                      </div>
                      <div>
                        <Label htmlFor="experiencia">Años de Experiencia</Label>
                        <Input id="experiencia" type="number" placeholder="0" />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Preferencias de Notificación
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-notifications">Notificaciones por Email</Label>
                          <p className="text-sm text-gray-500">Recibir notificaciones importantes por correo</p>
                        </div>
                        <Switch id="email-notifications" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="push-notifications">Notificaciones Push</Label>
                          <p className="text-sm text-gray-500">Recibir notificaciones en tiempo real</p>
                        </div>
                        <Switch id="push-notifications" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="inmersion-alerts">Alertas de Inmersión</Label>
                          <p className="text-sm text-gray-500">Notificar sobre cambios en inmersiones</p>
                        </div>
                        <Switch id="inmersion-alerts" />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Seguridad de la Cuenta
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="current-password">Contraseña Actual</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="new-password">Nueva Contraseña</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      <Button variant="outline">
                        Cambiar Contraseña
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Autenticación de Dos Factores</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>2FA Habilitado</Label>
                          <p className="text-sm text-gray-500">Protección adicional para tu cuenta</p>
                        </div>
                        <Switch />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="system" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configuración del Sistema</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Modo Oscuro</Label>
                          <p className="text-sm text-gray-500">Cambiar tema de la aplicación</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Auto-guardado</Label>
                          <p className="text-sm text-gray-500">Guardar automáticamente los cambios</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Confirmaciones</Label>
                          <p className="text-sm text-gray-500">Mostrar confirmaciones para acciones importantes</p>
                        </div>
                        <Switch />
                      </div>
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
